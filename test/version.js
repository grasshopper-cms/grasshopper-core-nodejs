'use strict';
require('chai').should();

describe('Grasshopper utils - version', function(){

    it('check and see if we can get the current grasshopper version', function(){
        var grasshopper = require('../lib/grasshopper');
        grasshopper.version.should.be.a.string;
        grasshopper.version.length.should.be.greaterThan(0);
    });
});
