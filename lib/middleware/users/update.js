module.exports = function updateUser(kontx, next){
    'use strict';

    var db = require('../../db')(),
        Strings = require('../../strings'),
        strings = new Strings(),
        updatedUserObj = kontx.args[0],
        createError = require('../../utils/error'),
        roles = require('../../security/roles');

    function handleError(err){
        kontx.payload = null;
        next(createError(err));
    }

    function manageTokens(userObj){
        kontx.payload = userObj;

        if(userObj.enabled === false){
            db.tokens.deleteByUserId(userObj._id.toString())
                .then(resolve)
                .fail(handleError)
                .done();
        }
        else {
            resolve();
        }
    }

    function resolve(){
        next();
    }

    function checkForRoleChange(existingUserObj){
        if(updatedUserObj.role !== existingUserObj.role){
            next(createError(403, strings.group('errors').user_privileges_exceeded_role));
        }
        else {
            db.users.update(updatedUserObj)
                .then(manageTokens)
                .fail(handleError)
                .done();
        }
    }

    if (!updatedUserObj.createdby) {
        updatedUserObj.createdby = {id: kontx.user._id, displayname: kontx.user.displayname};
    }
    updatedUserObj.updatedby = {id: kontx.user._id, displayname: kontx.user.displayname};

    //User is admin, do what they want.
    if(roles[kontx.user.role.toUpperCase()] === roles.ADMIN) {
        db.users.update(updatedUserObj)
            .then(manageTokens)
            .fail(handleError)
            .done();
    }
    //User is updating themselves, validate that they are not changing their role since they are not an admin.
    else if(kontx.user._id.toString() === updatedUserObj._id.toString()) {
        db.users.getById(kontx.user._id)
            .then(checkForRoleChange)
            .fail(handleError)
            .done();
    }
    else {
        next(createError(403, strings.group('errors').user_privileges_exceeded_role));
    }
};