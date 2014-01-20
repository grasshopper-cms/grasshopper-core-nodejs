'use strict';

module.exports = function(deferred){
    var security = {};


    security.validateToken = function(token){
        setTimeout(function(){
            console.log(deferred);
        },100);
    };

    return security;

};


