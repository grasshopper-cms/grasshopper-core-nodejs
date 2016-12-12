'use strict';

var grasshopper = require('../lib/grasshopper'),
    config;

require('chai').should();

function getConfig() {
    return {
        identities : {
            google : {
                appId : "blahBlahBlackSheep",
                secret : "ohhSooSecret",
                redirectUrl : "/this/that",
                scopes : [
                    "https://www.googleapis.com/auth/userinfo.profile",
                    "https://www.googleapis.com/auth/userinfo.email"
                ],
                tokenEndpoint : 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=',
                oauthCallback : 'http://localhost:2000'
            }
        }
    };
}


describe('Grasshopper utils - googleAuthUrl', function(){

    beforeEach(function() {
        grasshopper.config.init(getConfig());
    });

    describe('should return a friendly error message', function() {

        it('if identities.google is not available on your ghapi config', function(done) {

            delete grasshopper.config.identities.google;

            grasshopper.googleAuthUrl()
                .then()
                .fail(function(err) {
                    err.should.equal('Cannot Generate URL: Your ghapi config does not have a identities.google object.');
                })
                .done(done);
        });

        it('if identities.google.appId is not available on your ghapi config', function(done) {
            delete grasshopper.config.identities.google.appId;

            grasshopper.googleAuthUrl()
                .then()
                .fail(function(err) {
                    err.should.equal('Cannot Generate URL: You need a google app id on your ghapi config.');
                })
                .done(done);
        });

        it('if identities.google.secret is not available on your ghapi config', function(done) {
            delete grasshopper.config.identities.google.secret;

            grasshopper.googleAuthUrl()
                .then()
                .fail(function(err) {
                    err.should.equal('Cannot Generate URL: You need a google secret on your ghapi config.');
                })
                .done(done);
        });

        it('if identities.google.redirectUrl is not available on your ghapi config', function(done) {
            delete grasshopper.config.identities.google.redirectUrl;

            grasshopper.googleAuthUrl()
                .then()
                .fail(function(err) {
                    err.should.equal('Cannot Generate URL: You need a google redirectUrl on your ghapi config.');
                })
                .done(done);
        });

        it('if identities.google.scopes is not available on your ghapi config', function(done) {
            delete grasshopper.config.identities.google.scopes;

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
                console.log("FAIL SECTION");
                true.should.equal(false); // it should not get here.
            })
            .done(done);
    });
});
