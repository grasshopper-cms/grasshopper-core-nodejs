module.exports = function update(kontx, next) {
    'use strict';

    var async = require('async'),
        db = require('../../db')();
    db.nodes.move(kontx.args.op, kontx.args.from, kontx.args.to).then(
        function (val) {
            kontx.payload = val;
            next();
        },
        function (err) {
            next(err);
        }).done();

};