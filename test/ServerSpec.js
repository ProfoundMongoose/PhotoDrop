var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../server/server.js').app;
var db = require('../server/server.js').db;
var User = require('../server/users/userModel');

describe('', function() {

  describe('Photo Fetch:', function() {
    it('Fetch Photos should respond with 200', function(done) {
      request(app)
        .get('/fetchPhotos?lat=37.78379&lon=-122.4089&radius=50')
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('Account Creation:', function() {
    this.timeout(10000);
    it('Signup creates a new user', function(done) {
      request(app)
        .post('/signup')
        .send(JSON.stringify({
          'username': 'test',
          'password': 'test' }))
        .expect(function(res) {
          User.findOne({'username': 'test'})
            .exec(function(err, user) {
              if (err) { return done(err); }
              expect(user.username).to.equal('test');
            });
        })
        .expect(function() {
          User.remove({'username': 'test'})
            .exec(function(err, user) {
              if (err) { return done(err); }
            });
        })
        .expect(200, done);
    });

  });

  describe('Account Login:', function() {
    this.timeout(10000);
    
    beforeEach(function(done) {
      request(app)
        .post('/signup')
        .send(JSON.stringify({
          'username': 'test',
          'password': 'test' }))
        .expect(200, done); 
    });
    
    it('Logs in existing users', function(done) {
      request(app)
        .post('/login')
        .send(JSON.stringify({
          'username': 'test',
          'password': 'test' }))
        .expect(function(res) {
          expect(res.body.userId).to.not.be.undefined;
        })
        .expect(200, done);
    });

    it('Users that do not exist are not logged in', function(done) {
      request(app)
        .post('/login')
        .send(JSON.stringify({
          'username': 'Fred',
          'password': 'Fred' }))
        .expect(function(res) {
          expect(res.text).to.equal('User does not exist');
        })
        .expect(500, done);
    });

    afterEach(function(done) {
      User.remove({'username': 'test'})
        .exec(function(err, user) {
          if (err) { return done(err); }
          done();
        });
    });

  });

});