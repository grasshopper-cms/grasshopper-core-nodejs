(function(){
    "use strict";

    var users = {},
        db = require("../db"),
        _ = require("underscore"),
        async = require("async"),
        q = require("q"),
        privileges = require('./permissions/privileges'),
        LOGGING_CATEGORY = "GRASSHOPPER-USER";

    /**
     * Method to be called when you want to create a user in the system.
     * When saving a user all mandatory fields will be checked.
     * @param userObj
     * @param callback
     */
    users.create = function(userObj){
        return db.users.create(userObj);
    };

    users.getById = function(userId){
        return db.users.getById(userId);
    };

    users.getByEmail = function(userEmail){
        return db.users.getByEmail(userEmail);
    };

    users.getByLogin = function(userLogin){
        return db.users.getByLogin(userLogin);
    };

    users.authenticate = function(userLogin, userPassword){
        return db.users.authenticate(userLogin, userPassword);
    };

    users.deleteById = function(userId){
        return db.users.deleteById(userId);
    };

    users.updatePermission = function(userId, permissions){
        return db.users.savePermissions(userId, permissions.nodeid, permissions.role);
    };

    users.deletePermission = function(userId, nodeId){
        return db.users.deletePermissions(userId, nodeId);
    };

    users.query = function(filters, options){
        return db.users.query(filters, options);
    };

    users.list = function(options){
        var deferred = q.defer();

        async.parallel(
            [
                function(next){
                    db.users.list(options)
                        .then(function(value){
                           next(null, value);
                        })
                        .fail(function(err){
                            next(err);
                        });
                },
                function(next){
                    db.users.describe(options)
                        .then(function(value){
                           next(null, value);
                        })
                        .fail(function(err){
                            next(err);
                        });
                }
            ],function(err, results){
                if(err){
                    deferred.reject(err);
                }
                else {
                    deferred.resolve({
                        total: results[1][0].count,
                        results: results[0]
                    });
                }
            }
        );

        return deferred.promise;
    };

    users.update = function(userObj){
        var currentUserId = userObj._id,
            deferred = q.defer();

        function setError(err){
            deferred.reject(err);
        }

        function setResolution(obj){
            deferred.resolve(obj);
        }

        function manageTokens(obj){
            if(obj.enabled == false){
                db.tokens.deleteByUserId(obj._id.toString()).then(setResolution).fail(setError);
            }
            else {
                setResolution(obj);
            }
        }

        db.users.getByLogin(userObj.login)
            .then(function(existingUserObj){
                //Validate if the user tried to change their role without being an admin.
                if(existingUserObj && (userObj.role != existingUserObj.role && existingUserObj.role != privileges.available.ADMIN)){

                    deferred.reject(new Error("You do not have the permissions to change your role."));

                }
                else if(existingUserObj._id.toString() == currentUserId) {
                    db.users.update(userObj).then(manageTokens).fail(setError);
                }
                else {
                    deferred.reject(new Error("Different user with the same login already exists."));
                }
            })
            .fail(function(err){
                //Login Doesn't exist try to update.
                db.users.update(userObj).then(manageTokens).fail(setError);
            });

        return deferred.promise;
    };

    users.disable = function(userId){
        var deferred = q.defer();

        function setError(err){
            deferred.reject(err);
        }

        db.users.getById(userId)
            .then(function(val){
                if(val != null){
                    val.enabled = false;

                    db.users.update(val)
                        .then(function(updatedUser){
                            deferred.resolve(updatedUser);
                        })
                        .fail(setError);
                }
                else {
                    setError(new Error("Cannot disable user. User with provided ID could not be found."));
                }
            })
            .fail(setError);

        return deferred.promise;
    };

    users.enable = function(userId){
        var deferred = q.defer();

        db.users.getById(userId)
            .then(function(user){
                if(user != null){
                    user.enabled = true;
                    db.users.update(user)
                        .then(function(updatedUser){
                            deferred.resolve(updatedUser);
                        })
                        .fail(function(err){
                           deferred.reject(err);
                        });
                }
                else {
                    deferred.reject(new Error("Cannot enable user. User with provided ID could not be found."));
                }
            })
            .fail(function(err){
               deferred.reject(err);
            });

        return deferred.promise;
    };


    module.exports = users;
})();

