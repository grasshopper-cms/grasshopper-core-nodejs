require('chai').should();

describe('Grasshopper utils - version', function(){
    'use strict';

    it('check and see if we can get the current grasshopper version', function(){
        var grasshopper = require('./config/grasshopper');
        grasshopper.version.should.be.a.string;
        grasshopper.version.length.should.be.greaterThan(0);
    });
});
