var db = require('../../db'),
    q = require('q'),
    Strings = require('../../strings'),
    uuid  = require('node-uuid'),
    strings = new Strings('en'),
    err = new Error(strings.group('errors').invalid_login);

err.code = strings.group('codes').unauthorized;

module.exports = {
    auth: function(options){
        var deferred = q.defer();

        db.users.authenticate(options.username, options.password).then(function(user){
            var t = uuid.v4();

            db.tokens.insert({
                _id: t,
                uid: user._id,
                created: new Date().toISOString()
            }).then(function(){
                deferred.resolve(t);
            });
        }).fail(function(){
            deferred.reject(err);
        }).done();

        return deferred.promise;
    }
};

