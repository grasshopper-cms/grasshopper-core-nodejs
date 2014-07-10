require('chai').should();

var grasshopper = require('../lib/grasshopper'),
    grasshopperConfig = require('../lib/config'),
    config;

function getConfig() {
    'use strict';
    return {
        db: {},
        crypto: {},
        cache: {},
        assets: {},
        logger : {},
        identities : {
            google : {
                appId : "blahBlahBlackSheep",
                secret : "ohhSooSecret",
                redirectUrl : "/this/that",
                scopes : [
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email"
                ],
                tokenEndpoint : 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='
            }
        }
    };
}


describe('Grasshopper utils - googleAuthUrl', function(){
    'use strict';

    beforeEach(function() {
        config = getConfig();

        grasshopper.configure(function () {
            this.config = config;
        });
    });

    describe('should return a friendly error message', function() {

        it('if identities.google is not available on your ghapi config', function(done) {

            delete grasshopperConfig.identities.google;

            grasshopper.googleAuthUrl()
                .then()
                .fail(function(err) {
                    err.should.equal('Cannot Generate URL: Your ghapi config does not have a identities.google object.');
                })
                .done(done);
        });

        it('if identities.google.appId is not available on your ghapi config', function(done) {
            delete grasshopperConfig.identities.google.appId;

            grasshopper.googleAuthUrl()
                .then()
                .fail(function(err) {
                    err.should.equal('Cannot Generate URL: You need a google app id on your ghapi config.');
                })
                .done(done);
        });

        it('if identities.google.secret is not available on your ghapi config', function(done) {
            delete grasshopperConfig.identities.google.secret;

            grasshopper.googleAuthUrl()
                .then()
                .fail(function(err) {
                    err.should.equal('Cannot Generate URL: You need a google secret on your ghapi config.');
                })
                .done(done);
        });

        it('if identities.google.redirectUrl is not available on your ghapi config', function(done) {
            delete grasshopperConfig.identities.google.redirectUrl;

            grasshopper.googleAuthUrl()
                .then()
                .fail(function(err) {
                    err.should.equal('Cannot Generate URL: You need a google redirectUrl on your ghapi config.');
                })
                .done(done);
        });

        it('if identities.google.scopes is not available on your ghapi config', function(done) {
            delete grasshopperConfig.identities.google.scopes;

            grasshopper.googleAuthUrl()
                .then()
                .fail(function(err) {
                    err.should.equal('Cannot Generate URL: You need a google scopes array on your ghapi config.');
                })
                .done(done);
        });

    });

    it('should return a google auth url', function(done){
        grasshopper.googleAuthUrl()
            .then(function(url) {
                url.should.be.a.string;
            })
            .fail(function() {
                true.should.equal(false); // it should not get here.
            })
            .done(done);
    });
});

