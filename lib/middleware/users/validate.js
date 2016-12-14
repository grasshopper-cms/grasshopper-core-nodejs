/**
 * Middleware that performs custom validation on a user model and can fail the request before going to the database.
 *
 * @param kontx
 * @param next
 */
module.exports = function validate(kontx, next){
    'use strict';

    var _ = require('lodash'),
        q = require('q'),
        db = require('../../db')(),
        Strings = require('../../strings'),
        messages = new Strings().group('errors'),
        createError = require('../../utils/error'),
        user = kontx.args[0];


    if ( kontx.route === 'users.insert' && !identityIsSet()) {
        next( createError( 400, messages.missing_identity ) );
    }
    else if ( kontx.route === 'users.update' && _.isUndefined( user._id ) ) {
        next( createError( 404 ) );
    }
    else if( basicIdentityIsSet() ) {
        validateBasicIdentity();
    }
    else {
        next();
    }

    function validateBasicIdentity(){

        if(kontx.route === 'users.insert') {
            if( !usernameIsSet() ) {
                next( createError( 400, messages.missing_field_identity_basic_username ) );
            } else if ( !passwordIsSet() ) {
                next( createError( 400, messages.user_password_too_short ) );
            } else if ( usernameIsSet() && user.identities.basic.username.length < 4 ) {
                next( createError( 400, messages.username_too_short ) );
            } else if ( usernameIsSet() ) {
                usernameIsUnique( user._id )
                    .then(next)
                    .fail(function ( err ){
                        next( createError( 400, err.message ) );
                    })
                    .done();
            } else {
                next();
            }
        } else if (kontx.route === 'users.update') {
            if (_.has(user.identities.basic, 'username') && _.isEmpty(user.identities.basic.username)) { // user is submitting username and it is empty.
                next( createError( 400, messages.password_cannot_be_empty));
            } else if (usernameIsSet() && user.identities.basic.username.length < 4 ) {
                next( createError( 400, messages.username_too_short ) );
            } else if ( _.has(user.identities.basic, 'hash') && !passwordIsSet()) {
                next( createError( 400, messages.user_password_too_short ) );
            } else if ( usernameIsSet() ) {
                usernameIsUnique( user._id )
                    .then(next)
                    .fail(function ( err ){
                        next( createError( 400, err.message ) );
                    })
                    .done();
            } else {
                next();
            }
        } else {
            next();
        }

    }

    // Function that returns is the user.identities property has been set to a value.
    function identityIsSet() {
        return ( _.has(user, 'identities') && !_.isEmpty(user.identities));
    }

    // Function that returns is the user.identities.basic property has been set to a value.
    function basicIdentityIsSet(){
        return _.has(user, 'identities') && _.has(user.identities, 'basic') && !_.isEmpty(user.identities.basic);
    }

    // Function that returns is the user.identities.basic.password property has been set to a value.
    function passwordIsSet() {
        return !_.isEmpty(user.identities.basic.hash );
    }

    function usernameIsSet() {
        return !_.isEmpty( user.identities.basic.username );
    }

    /*
     If this is an 'insert' method and basic authentication is set. Then we need to make sure that only 1 username
     is allowed in our system.
     */
    function usernameIsUnique ( id ) {
        var deferred = q.defer();

        db.users.query( [ { key: 'identities.basic.username', cmp: '=', value: user.identities.basic.username } ] ,
            { limit: 1, skip: 0 } ).then(
                function ( payload ) {
                    if ( payload.total === 0 ) {
                        deferred.resolve();
                    }
                    else if( !_.isUndefined( id ) && payload.results[0]._id.toString() === id.toString() ) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject( new Error(messages.duplicate_username) );
                    }
                },
                function ( err ) {
                    deferred.reject( err );
                }
            );

        return deferred.promise;
    }
};