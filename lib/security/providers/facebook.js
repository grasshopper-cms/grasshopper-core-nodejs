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

module.exports = {
    auth: function(options) {
        var deferred = q.defer();

        BB.bind({creds: {}, userInfo: {}, options: options})
            .then(_getPersistantFacebookToken)
            .then(_getUserDetailsFromFacebook)
            .then(_loginSocially)

        _getPersistantFacebookToken(options.code)

            .then(function(info){
                _createNewFacebookUser(creds, info);
            })
            .catch(function(err){
                var fatalError = new Error(strings.group('errors').config_invalid_google_redirectUrl_mismatch);
                fatalError.code = strings.group('codes').forbidden;

                deferred.reject(fatalError);
            });

        _getUserDetailsFromGoogle(googleCredentials.access_token)
            .then(function(userInfo) {

            })
            .catch(function() {
                var fatalError = new Error(strings.group('errors').config_invalid_google_redirectUrl_mismatch);
                fatalError.code = strings.group('codes').forbidden;

                deferred.reject(fatalError);
            });

        return deferred.promise;
    }
};

function _getPersistantFacebookToken(){
    return new BB(function(resolve, reject){
        graph.setAppSecret(secret);
        graph.get('/oauth/access_token?' +
            'grant_type=fb_exchange_token&' +
            'client_id=' + appId + '&' +
            'client_secret=' + secret + '&' +
            'fb_exchange_token=' + self.options.code, function(err, res){
                if(err){
                    reject(err.message);
                    return;
                }

                this.creds = res;
                resolve(res);
            }.bind(this));
    }.bind(this));
}

function _getUserDetailsFromFacebook() {
    var profileFields = config.identities.facebook.fields,
        fields = (_.isArray(profileFields)) ? profileFields.join(',') : 'picture,timezone,email,first_name,last_name,gender,link,age_range,locale';

    return new BB(function(resolve, reject){
        graph.setAppSecret(secret);
        graph.get('/me?fields=' + fields + '&access_token=' + this.creds.access_token, function(err, res){
            if(err){
                deferred.reject(new Error(err.message));
                return;
            }
            this.userInfo = res;
            resolve(res);
        }.bind(this));
    }.bind(this));
}

function _loginSocially(){
    return db.users.socialAuthentication('facebook', userInfo.id)
            .then(function(user) {
                return _linkIdentityCall(user._id, userInfo, googleCredentials, deferred);
            })
            .fail(function() {
                return _linkIfUserExists(userInfo, googleCredentials, deferred);
            });
}

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











function _throwFatal(err, deferred) {
    'use strict';
    var fatalError = new Error(err);
    fatalError.code = strings.group('codes').forbidden;

    deferred.reject(fatalError);
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

function _linkIdentityCall(id, userInfo, googleCredentials, deferred) {
    'use strict';

    _linkIdentity(id, 'google', userInfo, googleCredentials)
        .then(function() {
            _createNewToken(id)
                .then(function(token) {
                    deferred.resolve(token);
                }, function(err){
                    _throwFatal.call(this, err, deferred);
                });
        }, function(err){
            _throwFatal.call(this, err, deferred);
        });
}

function _userExists(email) {
    var deferred = q.defer();

    db.users.getByEmail(email)
        .then(function(user) {
            deferred.resolve(user);
        })
        .fail(deferred.reject);

    return deferred.promise;

}

function _linkIdentity(userId, key, options, credentials) {
    var identityOptions = {
            id: credentials.userID,
            accessToken: credentials.access_token,
            signedRequest: credentials.signedRequest,
            expiresIn: credentials.expiresIn,
            link: credentials.link
        };

    return db.users.linkIdentity(userId, key, identityOptions);
}

function _createNewToken(userId) {
    var deferred = q.defer(),
        token = uuid.v4(),
        newTokenObj = {
            _id: token,
            uid: userId,
            created: new Date().toISOString(),
            type: 'facebook'
        };

    db.tokens.insert(newTokenObj)
        .then(function() {
            deferred.resolve(token);
        });

    return deferred.promise;
}
