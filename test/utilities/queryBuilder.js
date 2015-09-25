'use strict';

var grasshopper = require('../../lib/grasshopper'),
    queryBuilder= grasshopper.utilities.queryBuilder;

require('chai').should();

describe('Query builder', function() {

    it('find by id', function() {
        queryBuilder
            .create()
            .equals('_id', 0)
            .build()
            .should.deep.equal({
                filters : [{ key : '_id', cmp : '=', value : 0 }]
            });
    });

    it('distinct by type', function() {
        queryBuilder
            .create()
            .inTypes(['ab', 'cd'])
            .distinct('fields.firstname')
            .build()
            .should.deep.equal({
                types: ['ab', 'cd'],
                options : {
                    distinct : 'fields.firstname'
                }
            });
    });

    it('should be able to find in field', function() {
        queryBuilder
            .create()
            .inNodes(['abd'])
            .inField('fields.authors.authorid', ['authorId'])
            .build()
            .should.deep.equal({
                nodes : [
                    'abd'
                ],
                filters : [
                    {
                        key: 'fields.authors.authorid',
                        cmp: 'in',
                        value: ['authorId']
                    }
                ]
            });
    });

    it('should be able to find in field given they value as a plain old string', function() {
        queryBuilder
            .create()
            .inNodes(['abd'])
            .inField('fields.authors.authorid', 'authorId')
            .build()
            .should.deep.equal({
                nodes : [
                    'abd'
                ],
                filters : [
                    {
                        key: 'fields.authors.authorid',
                        cmp: 'in',
                        value: ['authorId']
                    }
                ]
            });
    });
});