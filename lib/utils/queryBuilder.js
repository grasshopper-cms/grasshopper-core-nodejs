'use strict';

var _ = require('lodash'),
    builderMethods;

module.exports = {
    create: function() {
        return new Builder();
    }
};

builderMethods = {
    build       : build,
    distinct    : distinct,
    equals      : equals,
    inField     : inField,
    inNodes     : inNodes,
    inTypes     : inTypes
};

_.extend(Builder.prototype, builderMethods);

function Builder() {}

function build() {
    var query = {};

    if (this.typeIds) {
        query.types = this.typeIds;
    }

    if (this.nodeIds) {
        query.nodes = this.nodeIds;
    }

    if (this.distinctField) {
        query.options = query.options || {};
        query.options.distinct = this.distinctField;
    }

    if (_.has(this, 'equalsKey') && _.has(this, 'equalsValue')) {
        query.filters = [{ key : this.equalsKey, cmp : '=', value : this.equalsValue }];
    }

    if (_.has(this, 'inFieldKey') && _.has(this, 'inFieldValues')) {
        query.filters = [{ key : this.inFieldKey, cmp : 'in', value : this.inFieldValues }];
    }

    return query;
}

function distinct(field) {
    this.distinctField = field;
    return this;
}

function equals(key, value) {
    this.equalsKey = key;
    this.equalsValue = value;
    return this;
}

function inField(key, values) {
    this.inFieldKey = key;
    this.inFieldValues = _.isArray(values) ? values : [values];
    return this;
}

function inNodes(nodeIds) {
    this.nodeIds = nodeIds;
    return this;
}

function inTypes(typeIds) {
    this.typeIds = typeIds;
    return this;
}