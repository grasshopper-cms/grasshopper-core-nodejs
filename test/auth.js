'use strict';
var should = require('chai').should(),
    path = require('path'),
    grasshopper,
    start = require('./_start');


describe('Grasshopper core - testing authentications', function(){

    before(function(done) {
        this.timeout(10000);
        start(grasshopper).then(function(gh) { grasshopper = gh; done(); });
    });

    after(function(){
        this.timeout(10000);
    });

    describe('Basic Authentication', function() {
        it('not authenticate because user doesn\'t exist', function(done) {
            grasshopper.auth('Basic', {username:'travis', password:'12345'})
                .then(function(obj){
                    should.not.exist(obj);
                })
                .fail(function(err){
                    err.message.should.equal('Your username was invalid.');
                })
                .done(function(){
                    done();
                });
        });

        it('should authenticate with a valid user.', function(done) {
            grasshopper.auth('Basic', {username:'admin', password:'TestPassword'})
                .then(function(obj){
                    should.exist(obj);
                })
                .fail(function(err){
                    should.not.exist(err);
                })
                .done(function(){
                    done();
                });
        });
    });

    describe('Google Authentication', function() {
        describe('given the google token of a non-existing user', function() {
            it('should add the user to the system', function() {
                // send the auth
                // check that the user is in DB
            });

            it('should add email address to user.email', function() {
                // send the auth
                // check that the user has a good email address
            });

            it('should add the google id to the user.identities.google.userid', function() {

            });

            it('should save the access token to the user.identities.google.accesstoken', function() {

            });

            it('should save the refresh token to the user.identities.google.refreshtoken', function() {

            });
        });

        describe('given the token of a existing user', function() {
            it('should return a valid token', function() {

            });
        });


    });

});
