/**
 * Module used for making sure a user has at least the permissions needed to access the resource that is
 * being requested.
 *
 * kontx impact: None
 * result: if minimum role is not available then fail request with a 403
 *
 * @param requiredRole
 */
module.exports = function requireNodePermissions(requiredRole){
    'use strict';

    var _ = require('lodash'),
        createError = require('../../utils/error'),
        security = require('../../security'),
        Strings = require('../../strings'),
        strings = new Strings();

    function getNodeId(content){
        if(_.isObject(content.meta) && !_.isUndefined(content.meta.node)){
            return content.meta.node.toString();
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
            next(createError(strings.group('codes').forbidden, strings.group('errors').user_privileges_exceeded));
        }
    };
};