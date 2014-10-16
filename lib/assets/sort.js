/**
 * Sort assets by a given key
 * @param  {Arrray} list
 * @return {Array}
 */
module.exports = function(list, key){
    'use strict';
    return list.sort(function(current, next) {
        return current[key] < next[key] ? -1 : 1;
    });
};