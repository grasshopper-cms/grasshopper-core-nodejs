require('chai').should();

describe('Grasshopper utilts - error', function(){
    'use strict';

    var err = require('../lib/utils/error');

    it('create an err without a code or message. Should return 500 with a server exception message.', function() {
        var e = err();
        e.errorCode.should.equal(500);
        e.message.should.equal('Server Error.');
    });

    it('create an err with a 404 but no message, should display correct 404 messaging.', function() {
        var e = err(404);
        e.errorCode.should.equal(404);
        e.message.should.equal('Resource could not be found.');
    });

    it('create an error with 404 but customize the error message.', function() {
        var e = err(404, 'This is my custom error message.');
        e.errorCode.should.equal(404);
        e.message.should.equal('This is my custom error message.');
    });

});
