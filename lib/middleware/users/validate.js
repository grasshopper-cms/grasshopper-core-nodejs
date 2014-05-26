/**
 * Middleware that performs custom validation on a user model and can fail the request before going to the database.
 *
 * @param kontx
 * @param next
 */
module.exports = function validate(kontx, next){
    'use strict';

    var _ = require('underscore'),
        q = require('q'),
        db = require('../../db'),
        Strings = require('../../strings'),
        messages = new Strings().group('errors'),
        createError = require('../../utils/error'),
        user = kontx.args[0];


    if ( !identityIsSet() || _.keys(user.identities).length === 0 ) {
        next( createError( 400, messages.missing_identity ) );
    }
    else if( basicIdentityIsSet() && passwordLengthIsValid() ) {

        if ( kontx.route === 'users.insert' ) {
            loginIsUnique().then(
                function () {
                    next();
                },
                function ( err ){
                    next( createError( 400, err.message ) );
                }
            );
        }
        else {
            next();
        }

    }
    else {
        next();
    }





    // Function that returns is the user.identites property has been set to a value.
    function identityIsSet() {
        return ( !_.isUndefined( user.identities ) && !_.isNull( user.identities ) );
    }

    // Function that returns is the user.identites.basic property has been set to a value.
    function basicIdentityIsSet(){
        return ( !_.isUndefined( user.identities.basic ) && !_.isNull( user.identities.basic ) );
    }

    // Function that returns is the user.identites.basic.password property has been set to a value.
    function passwordIsSet() {
        return ( !_.isUndefined( user.identities.basic.password ) && !_.isNull( user.identities.basic.password ) );
    }

    // Function that returns if the password passed to the middleware is >= 6 characters
    function passwordLengthIsValid () {
        var isValid = true;

        if ( basicIdentityIsSet() && passwordIsSet() && user.identities.basic.password.length < 6 ) {
            isValid = false;
            next(createError(400, messages.user_password_too_short));
        }

        return isValid;
    }

    /*
     If this is an 'insert' method and basic authentication is set. Then we need to make sure that only 1 login
     is allowed in our system.
     */
    function loginIsUnique () {
        var deferred = q.defer();

        db.users.query( [ { key: 'identities.basic.login', cmp: '=', value: user.identities.basic.login } ] ,
            { limit: 10, skip: 0 } ).then(
                function ( payload ) {
                    if( payload.total === 0 ) {
                        deferred.resolve();
                    }
                    else {
                        deferred.reject( new Error(messages.duplicate_login) );
                    }
                },
                function ( err ) {
                    deferred.reject( err );
                }
            );

        return deferred.promise;
    }
};