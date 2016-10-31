/*
 Between = 10,
 NotBetween = 11,
 */

(function(){
    'use strict';

    var comp = {};

    function equals(value){
        return value;
    }

    function notequals(value){
        return {
            $ne: value
        };
    }

    function greaterOrEquals(value){
        return {
            $gte: value
        };
    }

    function greaterThan(value){
        return {
            $gt: value
        };
    }

    function lessOrEquals(value){
        return {
            $lte: value
        };
    }

    function lessThan(value){
        return {
            $lt: value
        };
    }

    function between(value){
        return {
            $gte: value[0],
            $lt: value[1]
        };
    }

    function notbetween(value){
        return {
            $lte: value[0],
            $gt: value[1]
        };
    }

    function like(value){
        if (value instanceof RegExp) {
            return value;
        } else {
            return new RegExp(value, 'i');
        }
    }

    function notlike(value){
        return {
            $not: like(value)
        };
    }

    function contains(value){
        return {
            $in: value
        };
    }

    function notcontains(value){
        return {
            $nin: value
        };
    }

    function size(value){
        return {
            $size: value
        };
    }

    function exists(value){
        return {
            $exists: value
        };
    }


    comp.parse = function(filter){
        var obj = {};

        switch(filter.cmp){
            case '=':
            case 'eq':
            case 'equal':
            case 'equals':
                obj = equals(filter.value);
                break;
            case '!=':
            case 'not':
            case 'notequal':
            case 'notequals':
                obj = notequals(filter.value);
                break;
            case '>=':
            case 'gte':
                obj = greaterOrEquals(filter.value);
                break;
            case '>':
            case 'gt':
                obj = greaterThan(filter.value);
                break;
            case '<=':
            case 'lte':
                obj = lessOrEquals(filter.value);
                break;
            case '<':
            case 'lt':
                obj = lessThan(filter.value);
                break;
            case 'in':
            case 'contains':
                obj = contains(filter.value);
                break;
            case '!in':
            case 'notin':
            case 'notcontains':
                obj = notcontains(filter.value);
                break;
            case '%':
            case 'like':
                obj = like(filter.value);
                break;
            case '!%':
            case 'notlike':
                obj = notlike(filter.value);
                break;
            case 'between':
                obj = between(filter.value);
                break;
            case 'notbetween':
                obj = notbetween(filter.value);
                break;
            case 'size':
                obj = size(filter.value);
                break;
            case 'exists':
                obj = exists(filter.value);
                break;
            default:
                obj = equals(filter.value);
                break;
        }

        return obj;
    };

    module.exports = comp;
})();
