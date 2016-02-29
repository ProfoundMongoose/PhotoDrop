var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../server/server.js').app;
var db = require('../server/server.js').db;
var User = require('../server/users/userModel');


describe('', function() {

  // beforeEach(function(done) {
  //   done();
  // });

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

    it('Signup creates a new user', function(done) {
      request(app)
        .post('/signup')
        .send(JSON.stringify({
          'username': 'aaabc',
          'password': 'aaabc' }))
        .expect(302)
        .expect(function() {
          User.findOne({'username': 'aaabc'})
            .exec(function(err, user) {
              expect(user.username).to.equal('aaabc');
            });
        })
        .end(done);
    });

  });

  // describe('Account Login:', function() {

  //   it('Logs in existing users', function(done) {
  //     request(app)
  //       .post('/login')
  //       .send(JSON.stringify({
  //         'username': 'Svnh',
  //         'password': 'Svnh' }))
  //       .expect(function(res) {
  //           expect(res).to.not.throw(Error);
  //           done();
  //         };
  //         // console.log('res: ', res);
  //       })
  //       // .end(done);
  //   });

    // it('Users that do not exist are kept on login page', function(done) {
    //   request(app)
    //     .post('/login')
    //     .send({
    //       'username': 'Fred',
    //       'password': 'Fred' })
    //     .expect(302)
    //     .expect(function(res) {
    //       expect(res.headers.location).to.equal('/login');
    //     })
    //     .end(done);
    // });

  // });

});