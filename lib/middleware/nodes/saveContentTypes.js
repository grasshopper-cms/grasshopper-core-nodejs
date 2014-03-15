module.exports = function saveContentTypes(kontx, next){
    var types = kontx.args.types,
        async = require('async'),
        db = require('../../db'),
        createError = require('../../utils/error'),
        _ = require('underscore');

    if(!(types instanceof Array)){
        types = [types];
    }

    async.each(types, function(item, cb){
        var val = (_.isString(item)) ? item : item.id;

        db.contentTypes.getById(val).then(
            function(){
                cb(null);
            },
            function(){
                cb(createError(404));
            }).done();
    }, function(err){
        if(!err){
            db.nodes.saveContentTypes(kontx.args.id, types).then(function(){
                    kontx.payload = 'Success';
                    next();
                },
                function(err){
                    next(createError(err));
                }).done();
        }
        else {
            next(err);
        }
    });
};