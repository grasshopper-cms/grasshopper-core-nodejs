/**
 * Module used for making sure a user has at least the permissions needed to access the resource that is
 * being requested.
 * @param requiredRole
 */
module.exports = function requireNodePermissions(requiredRole){
    'use strict';

    var _ = require('underscore'),
        createError = require('../../utils/error'),
        security = require('../../security'),
        Strings = require('../../strings'),
        strings = new Strings();

    function getNodeId(content){
        if(_.isObject(content.node)){
            return content.node._id.toString();
        }
        else {
            return null;
        }
    }
    return function validateNodePermissions(kontx, next){
        var isValid = security.node.allowed(
            getNodeId(kontx._content),
            kontx.user.role,
            kontx.user.permissions,
            requiredRole
        );

        if(isValid){
            next();
        }
        else {
            next(createError(strings.group('codes').forbidden, strings.group('error').user_privileges_exceeded));
        }
    };
};