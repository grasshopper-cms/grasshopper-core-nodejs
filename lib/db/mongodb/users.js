"use strict";

var mongoose = require('mongoose'),
    q = require('q'),
    crud = require("./mixins/crud"),
    _ = require("underscore"),
    collectionName = "users",
    filterFactory = require('./search/filterFactory'),
    schema = require('./schemas/user');

function handleUser(err, doc, deferred){
    if(err) {
        deferred.reject(err);
    }
    else if (doc != null) {
        deferred.resolve(doc);
    }
    else {
        deferred.reject(new Error("User does not exist"));
    }
}

var user = Object.create(crud, {
    model: {value: mongoose.model(collectionName, schema)},
    privateFields: {value: ["salt", "pass_hash"]}
});

user.getByLogin = function(login) {
    var deferred = q.defer();

    this.model.findOne({login: login}, this.buildIncludes()).lean().exec(function(err, doc){
        handleUser(err, doc, deferred);
    });

    return deferred.promise;
};

user.getByEmail = function(email) {
    var deferred = q.defer();

    this.model.findOne({email: email}, this.buildIncludes()).lean().exec(function(err, doc){
        handleUser(err, doc, deferred);
    });

    return deferred.promise;
};

user.authenticate = function(login, password){
    var deferred = q.defer();

    this.model.findOne({login: login}, function(err, doc){
        var valid = (doc != null) ? doc.authenticate(password) : false;

        if(!valid){
            handleUser(null, null, deferred);
        }
        else {
            handleUser(err, doc, deferred);
        }
    });

    return deferred.promise;
};

user.savePermissions = function(userId, nodeid, role){
    var deferred = q.defer();

    this.model.findOne({_id: userId}, function(err, doc){
        if(err){
            deferred.reject(err);
        }
        else {
            var permissions = (!doc.permissions) ? [] : _.filter(doc.permissions, function(permission) {
                return permission.nodeid.toString() != nodeid;
            });

            permissions[permissions.length] = {nodeid: nodeid, role: role};

            doc.permissions = permissions;
            doc.save(function(err, results){
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve("Success");
                }
            });
        }
    });

    return deferred.promise;
};

user.deletePermission = function(userId, nodeId){
    var deferred = q.defer();

    this.model.findOne({_id: userId}, function(err, doc){
        if(err){
            deferred.reject(err);
        }
        else {
            var permissions = (!doc.permissions) ? [] : _.filter(doc.permissions, function(permission) {
                return permission.nodeid.toString() != nodeId;
            });

            doc.permissions = permissions;
            doc.save(function(err, results){
                if(err){
                    deferred.reject(err);
                } else {
                    deferred.resolve("Success");
                }
            });
        }
    });

    return deferred.promise;
};

user.query = function(filters, options){
    var deferred = q.defer();

    var qry = {};
    filterFactory.createQuery(filters, qry);

    this.model.find(qry, this.buildIncludes({
        include: options.include,
        exclude: options.exclude
    })).lean().exec(function(err, data){
            if(err){
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });

    return deferred.promise;
};

module.exports = user;