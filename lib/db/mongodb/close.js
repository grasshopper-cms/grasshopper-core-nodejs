'use strict';
var Strings = require('../../strings'),
    strings = new Strings('en');

/**
 * Module that will close the db connection.
 */
module.exports = function(connection) {
    //If we don't have an arugument but we do have access to mongoose.

    return connection.close()
                .then(function(){
                    console.log(strings.group('notice').db_disconnected);
                })
                .catch(function(err){
                    console.log(strings.group('notice').db_disconnected);
                });
};
