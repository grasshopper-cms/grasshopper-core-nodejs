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
    profileFields = (_.isArray(scopes)) ? scopes.join(',') : 'picture,timezone,email,first_name,last_name,gender,link,age_range,locale',
    err;

module.exports = {
    auth: function(options) {

        return BB.bind({ creds: null, socialUserInfo: null, userInfo: null, options:options })
                .then(_getPersistantFacebookToken)
                .then(_getUserDetailsFromFacebook)
                .then(_setUserInfoFromSocialAccount)
                .then(_linkOrCreateUser)
                .then(_createNewToken)
                .then(function(){
                    console.log('GOT HERE!');
                    console.log(this);
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
        return _createUser.call(this);
    }
}

function _createUser(){
    return BB.bind(this)
            .then(function(){
                //Check if the email exists already
                return db.users.getByEmail(this.socialUserInfo.email)
            })
            .then(function(user){
                console.log(user);
            })
            .catch(function(err){
                console.log('Good! New USer');
                console.log(err);
            })
    /*return new BB(function(resolve, reject){

            .then(function(user) {
                var err = new Error('User already exists but has not linked this social account.');
                err.code = 403;
                reject(err)
            })
            .fail(function(){
                _createNewFacebookUser(self.creds, self.socialUserInfo)
                    .then(function(user){
                        console.log(user);
                    })
                    .catch(function(err){
                        throw err;
                    });
            });
    }.bind(this));*/
}

function _linkIdentity(userId, key, socialUserInfo, creds) {
    return new BB(function(resolve, reject){
        var identityOptions = {
                id: socialUserInfo.id,
                accessToken: creds.access_token,
                expires: creds.expires
            };

        db.users.linkIdentity(userId, key, identityOptions)
            .then(function(user) {
                resolve(user);
            })
            .fail(function(err){
                reject(err);
            })
            .catch(function(err){
                reject(err);
            });
    });

}

function _createNewFacebookUser(credentials, socialUserInfo) {
    return new BB(function(resolve, reject){
        var avatar = '',
            excludedFields = ['link', 'email', 'first_name', 'last_name','picture'],
            newUser;

        //Set Image
        if(socialUserInfo.picture && socialUserInfo.picture.data && socialUserInfo.picture.data.url !== ''){
            avatar = socialUserInfo.picture.data.url;
        }

        newUser = {
            role: 'external',
            identities: {
                facebook: {
                    id: socialUserInfo.id,
                    accessToken: credentials.access_token,
                    expiresIn: credentials.expires
                }
            },
            linkedidentities: ['facebook'],
            profile: {
                picture: avatar
            },
            enabled: true,
            email: socialUserInfo.email,
            firstname: socialUserInfo.first_name,
            lastname: socialUserInfo.last_name
        };

        _.each(scopes, function(field){
            if(excludedFields.indexOf(field) === -1){
                newUser.profile[field] = socialUserInfo[field];
            }
        });

        db.users.insert(newUser)
            .then(function(user) {
                resolve(user);
            })
            .fail(function(err) {
                reject(err);
            })
            .done();
    });
}

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

/*




function _throwFatal(code, err) {
    err.code = strings.group('codes').forbidden;
    throw err;
}

function _linkIfUserExists(userInfo, googleCredentials, deferred) {
    return BB.bind({})
            .then(function(){
                return db.users.getByEmail(userInfo.email);
            })
            .then(function(user){
                return db.users.linkIdentity(user._id, 'facebook', identityOptions);
            })
            .

    _userExists(userInfo.email)
        .then(function(user) {
            _linkIdentityCall(user._id, userInfo, googleCredentials, deferred);
        })
        .fail(function() {
            _createNewGoogleUser(googleCredentials, userInfo)
                .then(function(user) {
                    _createNewToken(user._id)
                        .then(function(token) {
                            deferred.resolve(token);
                        }, function(err){
                            _throwFatal.call(this, err, deferred);
                        });
                }, function(err){
                    _throwFatal.call(this, err, deferred);
                });
        });
}
*/
