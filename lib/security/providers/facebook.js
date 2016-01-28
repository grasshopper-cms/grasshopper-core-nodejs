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
    err;

//strings = new Strings('en');
//appId = config.identities.google.appId;
//OAuth2Client = googleapis.OAuth2Client;
//secret = config.identities.google.secret;
//redirect = config.identities.google.oauthCallback;
//oAuthClient = new OAuth2Client(appId, secret, redirect);

module.exports = {
    auth: function(options) {

        return BB.bind({ creds: null, socialUserInfo: null, userInfo: null, options:options })
                .then(_getPersistantFacebookToken)
                .then(_getUserDetailsFromFacebook)
                .then(_setUserInfoFromSocialAccount)
                .then(_setUserInfoFromEmailAsBackup)
                .then(_linkOrCreateUser)
                //.then(_createNewToken)
                .then(function(){
                    console.log('GOT HERE!');
                    console.log(this);
                })
                .catch(function(err) {
                    var e = new Error(err.message);
                    e.code = strings.group('codes').forbidden;
                    throw(err);
                });



/*
                    .then(function(userInfo) {
                        db.users.googleAuthentication(userInfo.id)
                            .then(function(user) {
                                _linkIdentityCall(user._id, userInfo, googleCredentials, deferred);
                            })
                            .fail(function() {
                                _linkIfUserExists(userInfo, googleCredentials, deferred);
                            });


        return deferred.promise;*/
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
    var profileFields = config.identities.facebook.scopes,
        fields = (_.isArray(profileFields)) ? profileFields.join(',') : 'picture,timezone,email,first_name,last_name,gender,link,age_range,locale';

    return new BB(function(resolve, reject){
        graph.setAppSecret(secret);
        graph.get('/me?fields=' + fields + '&access_token=' + this.creds.access_token, function(err, res){
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
    return new BB(function(resolve, reject){
        if(this.userInfo){ //If user exists link data
            console.log('User found link identity');
            return _linkIdentity(this.userInfo._id, 'facebook', this.socialUserInfo, this.creds);
        }
        else {
            console.log('User NOT found look up by email if exists then throw error else create a new user.');
        }
    });



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

/*

function _createNewToken(userId) {
    var token = uuid.v4(),
        newTokenObj = {
            _id: token,
            uid: this.userInfo._id.toString(),
            created: new Date().toISOString(),
            type: 'facebook'
        };

    return db.tokens.insert(newTokenObj);
}


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

function _userExists(email) {
    'use strict';
    var deferred = q.defer();

    db.users.getByEmail(email)
        .then(function(user) {
            deferred.resolve(user);
        })
        .fail(deferred.reject);

    return deferred.promise;

}

function _createNewGoogleUser(googleCredentials, userInfo) {
    'use strict';
    var deferred = q.defer(),
        newUser;

    newUser = {
        role: 'external',
        identities: {
            google: {
                id: userInfo.id,
                accessToken: googleCredentials.access_token,
                refreshToken: googleCredentials.refresh_token
            }
        },
        linkedidentities: ['google'],
        profile: {
            picture: userInfo.picture
        },
        enabled: true,
        email: userInfo.email,
        firstname: userInfo.given_name,
        lastname: userInfo.family_name
    };

    db.users.insert(newUser)
        .then(function(user) {
            deferred.resolve(user);
        })
        .fail(function(err) {
            deferred.reject(err);
        })
        .done();

    return deferred.promise;
}


















'use strict';
var q = require('q'),
    db = require('../../db'),
    BB = require('bluebird'),
    _ = require('lodash'),
    request = require('request'),
    uuid = require('node-uuid'),
    config = require('../../config'),
    Strings = require('../../strings'),
    graph = require('fbgraph'),
    strings = new Strings('en'),
    appId = config.identities.facebook.appId,
    secret = config.identities.facebook.secret,
    redirect = config.identities.facebook.oauthCallback,
    err;

config.identities.facebook = config.identities.facebook || {};

function _createNewFacebookUser(credentials, userInfo) {
    var deferred = q.defer(),
        avatar = '',
        newUser;

        //self.user.profile.gender = userInfo.gender;
        //self.user.profile.agerange = userInfo.age_range;
        //self.user.profile.locale = userInfo.locale;
        //self.user.profile.facebook.link = userInfo.link;

    //Set Image
    if(userInfo.picture && userInfo.picture.data && userInfo.picture.data.url !== ''){
        avatar = res.picture.data.url;
    }

    newUser = {
        role: 'external',
        identities: {
            facebook: {
                id: credentials.userID,
                accessToken: credentials.access_token,
                signedRequest: credentials.signedRequest,
                expiresIn: credentials.expiresIn,
                link: credentials.link
            }
        },
        linkedidentities: ['facebook'],
        profile: {
            picture: avatar
        },
        enabled: true,
        email: userInfo.email,
        firstname: userInfo.first_name,
        lastname: userInfo.last_name
    };

    db.users.insert(newUser)
        .then(function(user) {
            deferred.resolve(user);
        })
        .fail(function(err) {
            deferred.reject(err);
        })
        .done();

    return deferred.promise;
}











function _linkIfUserExists(userInfo, googleCredentials, deferred) {
    'use strict';

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

function _userExists(email) {
    return db.users.getByEmail(email);
}
*/
