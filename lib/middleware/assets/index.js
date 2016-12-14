var db = require('../../db')(),
    assets = require('../../assets');

/**
 * Proxy function will take a assets function and wrap it with a middleware.
 * @param func
 * @returns {Function}
 */
function proxy(func){
    'use strict';

    // Returns a middleware
    return function (kontx, next){
        func(kontx.args).then(
            function(payload){
                kontx.payload = payload;
                next();
            },
            function(err){
                next(err);
            }
        );
    };
}

module.exports.uniqueId = 'assets';
module.exports.copy = proxy(assets.copy);
module.exports.delete = proxy(assets.delete);
module.exports.deleteAll = proxy(assets.deleteAll);
module.exports.find = proxy(assets.find);
module.exports.list = proxy(assets.list);
module.exports.move = proxy(assets.move);
module.exports.rename = proxy(assets.rename);
module.exports.save = proxy(assets.save);