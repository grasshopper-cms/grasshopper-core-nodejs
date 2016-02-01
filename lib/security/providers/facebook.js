'use strict';
var _ = require('lodash'),
    BB = require('bluebird'),
    db = require('../../db'),
    request = require('request'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    graph = require('fbgraph'),
    strings = new Strings('en'),
    appId = config.identities.facebook.appId,
    secret = config.identities.facebook.secret,
    scopes = config.identities.facebook.scopes,
    profileFields = (_.isArray(scopes)) ? scopes.join(',') : 'picture,timezone,email,first_name,last_name,gender,link,age_range,locale';

module.exports = {
    auth: function(options) {

        return BB.bind({ creds: null, socialUserInfo: null, userInfo: null, options:options })
                .then(_getPersistantFacebookToken)
                .then(_getUserDetailsFromFacebook)
                .then(_setUserInfoFromSocialAccount)
                .then(_linkOrCreateUser)
                .then(_createNewToken)
                .then(function(obj){
                    return obj._id; //Return valid token
                })
                .catch(function(err) {
                    var e = new Error(err.message);
                    e.code = strings.group('codes').forbidden;
                    throw(err);
                });
    }
};

// Function will accept the passed in authentication token from FB and exchange
// it for a permenant token. This token will be saved to the user's identities profile.
function _getPersistantFacebookToken(){
    return new BB(function(resolve, reject){
        graph.setAppSecret(secret);
        graph.get('/oauth/access_token?' +
            'grant_type=fb_exchange_token&' +
            'client_id=' + appId + '&' +
            'client_secret=' + secret + '&' +
            'fb_exchange_token=' + this.options.code, function(err, res){
                if(err){
                    reject(err.message);
                    return;
                }

                this.creds = res;
                resolve(res);
            }.bind(this));
    }.bind(this));
}

// Function will obtian the user's social information from facebook and return it
// as user info to our promise chain. This info can later be used to look up our
// users a either create an account or log them in
function _getUserDetailsFromFacebook() {
    return new BB(function(resolve, reject){
        graph.setAppSecret(secret);
        graph.get('/me?fields=' + profileFields + '&access_token=' + this.creds.access_token, function(err, res){
            if(err){
                throw new Error(err);
            }
            this.socialUserInfo = res;
            resolve(res);
        }.bind(this));
    }.bind(this));
}

// Function will look up a user by their social id and then assign it to the userInfo object
function _setUserInfoFromSocialAccount(){
    return db.users.socialAuthentication('facebook', this.socialUserInfo.id)
            .then(function(user){
                this.userInfo = user;
            }.bind(this))
            .catch(function(err){ // If user isn't found surpress error. If found and still error then throw.
                if(err.code !== 404){
                    throw(err);
                }
            });
}

// This function will take an social identity and assign it to a user.
function _linkOrCreateUser() {
    if(this.userInfo){ //If user exists link data
        return _linkIdentity(this.userInfo._id, 'facebook', this.socialUserInfo, this.creds);
    }
    else {
        return _createUser.call(this)
                .then(function(user){
                    this.userInfo = user;
                }.bind(this));
    }
}

// Function will create a user if it doesn't exist. If the same email is found
// then we will throw an error. Because we should never "create" a new user with
// an email address that is already in the system. Accounts like this should be "linked".
function _createUser(){
    return BB.bind(this)
            .then(function(){
                return db.users.getByEmail(this.socialUserInfo.email); //Check if the email exists already
            })
            .then(function(user){
                var err = new Error('User already exists but has not linked this social account.'); //User shouldn't exist throw error
                err.code = 403;
                throw err;
            })
            .catch(function(err){
                if(err.code === 403){ //403 means that the user exists but the account isn't linked.
                    throw err;
                }
                else {
                    return _createNewFacebookUser.call(this);
                }
            });
}

// Function that takes the facebook social data and attaches it to a user in grasshopper
function _createNewFacebookUser(credentials, socialUserInfo) {
    var avatar = '',
        excludedFields = ['link', 'email', 'first_name', 'last_name','picture'],
        newUser;

    //Set Image
    if(this.socialUserInfo.picture && this.socialUserInfo.picture.data && this.socialUserInfo.picture.data.url !== ''){
        avatar = this.socialUserInfo.picture.data.url;
    }

    newUser = {
        role: 'external',
        identities: {
            facebook: {
                id: this.socialUserInfo.id,
                accessToken: this.creds.access_token,
                expiresIn: this.creds.expires
            }
        },
        linkedidentities: ['facebook'],
        profile: {
            picture: avatar
        },
        enabled: true,
        email: this.socialUserInfo.email,
        firstname: this.socialUserInfo.first_name,
        lastname: this.socialUserInfo.last_name
    };

    _.each(scopes, function(field){
        if(excludedFields.indexOf(field) === -1){
            newUser.profile[field] = this.socialUserInfo[field];
        }
    }.bind(this));

    return db.users.insert(newUser);
}

// When a user is already in the system and the email matches, then we would
// update their social data with the newly supplied info. 
function _linkIdentity(userId, key, socialUserInfo, creds) {
    var identityOptions = {
            id: socialUserInfo.id,
            accessToken: creds.access_token,
            expires: creds.expires
        };

    return db.users.linkIdentity(userId, key, identityOptions);
}


// Function will create a new access token in grasshopper and return it to the app
function _createNewToken() {
    var token = uuid.v4(),
        newTokenObj = {
            _id: token,
            uid: this.userInfo._id.toString(),
            created: new Date().toISOString(),
            type: 'facebook'
        };

    return db.tokens.insert(newTokenObj);
}
