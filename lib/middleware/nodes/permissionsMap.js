/**
 * The permissionsMap middleware is used to traverse up a node's family tree
 * and include the permissions granted to the use for each node. The module would be used to
 * figure out if a particular user has the rights to perform certain operations
 * not only in the current node but in it's parent. Sicne permissions should
 * cascade setting a user as an editor to one node, would automatcially assume
 * that the user was an editor to all of that node's children.
 *
 * used arguments: {id: id }
 *
 * kontx impact: push a complete mapping of user permissions to the kontx.user.permissions collection
 * result: backfills permissions to for a user to include all nodes
 *
 */
var permissionsMap = function(kontx, next){
    'use strict';

     var nodeid = kontx.args.id,
         userPermissions = kontx.user.permissions,
         currentRole = kontx.user.role.toLowerCase(),
         _ = require('lodash'),
         async = require('async'),
         roles = require('../../security/roles'),
         db = require('../../db');

    function error(err){
        next(err);
    }

    function setPermission(item, cb){
        var permission = _.find(userPermissions, function(permission){
            return (permission.nodeid.toString() === item);
        });

        if(!_.isUndefined(permission)) {
            currentRole = permission.role;
        }
        else {
            kontx.user.permissions.push({nodeid: item._id, role: currentRole});
        }

        cb();
    }

    function finalize() {
        setPermission({_id: nodeid}, next);
    }

    function buildMap(node) {
        if(_.isArray(node.ancestors)) {
            async.each(node.ancestors, setPermission);
        }
    }

    if(_.isUndefined(kontx.user.permissions)){
        kontx.user.permissions = [];
    }

    db.nodes.getById(nodeid).then(buildMap).fail(error).done(finalize);
};

module.exports = permissionsMap;