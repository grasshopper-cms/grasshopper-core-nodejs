(function(){
    "use strict";

    var content = {},
        db = require("../db");

    content.create = function(obj){
        return db.content.create(obj);
    };

    content.getById = function(id){
        return db.content.getById(id);
    };

    content.deleteById = function(id){
        return db.content.deleteById(id);
    };

    content.update = function(obj){
        return db.content.update(obj);
    };

    content.query = function(nodes, types, filters, options){
        return db.content.query(nodes, types, filters, options);
    };

    module.exports = content;
})();

