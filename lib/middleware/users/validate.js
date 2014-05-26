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

        if( !loginIsSet() ) {
            next( createError( 400, messages.missing_field_identity_basic_login ) );
        }
        else if ( user.identities.basic.login.length < 4 ) {
            next( createError( 400, messages.login_too_short ) );
        }
        else if ( kontx.route === 'users.insert' && !passwordIsSet() ) {
            next( createError( 400, messages.user_password_too_short ) );
        }
        else {
            loginIsUnique( user._id ).then(
                function () {
                    next();
                },
                function ( err ){
                    next( createError( 400, err.message ) );
                }
            );

        }
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
        return ( !_.isUndefined( user.identities.basic.hash ) && !_.isNull( user.identities.basic.hash ) );
    }

    function loginIsSet() {
        return (
            !_.isUndefined( user.identities.basic.login ) &&
            !_.isNull( user.identities.basic.login ) &&
            user.identities.basic.login !== ''
        );
    }

    /*
     If this is an 'insert' method and basic authentication is set. Then we need to make sure that only 1 login
     is allowed in our system.
     */
    function loginIsUnique ( id ) {
        var deferred = q.defer();

        db.users.query( [ { key: 'identities.basic.login', cmp: '=', value: user.identities.basic.login } ] ,
            { limit: 1, skip: 0 } ).then(
                function ( payload ) {
                    if ( payload.total === 0 ) {
                        deferred.resolve();
                    }
                    else if( !_.isUndefined( id ) && payload.results[0]._id.toString() === id.toString() ) {
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