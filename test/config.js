'use strict';

var should = require('chai').should(),
    config = require('../lib/config'),
    path = require('path');

describe('config', function(){

    after(function(){
        config.init({db:{defaultPageSize: 100000}});
    });

    describe('using empty config options', function() {
        it('an empty config should return back the default object', function() {
            config.db.defaultPageSize.should.equal(100000);
        });

        it('calling the init function with a different default page size should override what was previously in there.', function(){
            config.init({db:{defaultPageSize: 20}});
            config.db.defaultPageSize.should.equal(20);
        });
    });
});
