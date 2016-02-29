var Q = require('q');
var User = require('./userModel');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

module.exports = {
  login: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var password = user.password;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.sign({ username: username, userId: user._id }, 'FRANKJOEVANMAX');
                res.json({ userId: user._id, token: token });
              } else {
                return next(new Error('Incorrect password'));
              }
            });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  signup: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var password = user.password;

    findUser({ username: username })
      .then(function(user) {
        if (user) {
          next(new Error('User already exist!'));
        } else {
          return createUser({
            username: username,
            password: password
          }).then(function(user) {
            console.log('Created user', user)
              // Generate JWT for user here
              // params: payload, secret key, encryption, callback
            var token = jwt.sign({ username: user.username, userId: user._id }, 'FRANKJOEVANMAX');
            console.log('token created', token)
            res.json({ token: token, userId: user._id, username: user.username })
            next()
          }).catch(function(err) {
            console.error('problem creating user', err);
          });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  checkJWT: function(req, res, next) {
    console.log('imcomming GET for JWT', req.params.JWT)
    var decoded = jwt.verify(req.params.JWT, 'FRANKJOEVANMAX', function(err, decoded) {
      if (err) console.log('problem decoding', err);
      else {
        // send back decoded.userId and decoded.username
        res.json({ username: decoded.username, userId: decoded.userId });
        next();
      }
    });
    // send back user id
  },

  changePassword: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var password = user.password;
    var newPassword = user.newPassword;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist!'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              user.password = newPassword;
              user.save(function(err, savedUser) {
                if (err) next(err);
                res.json();
              })
            }).catch(function(err) {
              console.error('problem changing user info', err);
            });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  changeUsername: function(req, res, next) {
    var user = JSON.parse(Object.keys(req.body)[0]);
    var username = user.username;
    var newUsername = user.newUsername;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist!'));
        } else {
          user.username = newUsername;
          user.save(function(err, savedUser) {
            if (err) next(err);
            res.json({ username: savedUser.username });
          })
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  addToFavorites: function(req, res, next) {
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) next(err);
      if (!user) {
        console.error('User was not found');
      } else {
        user.favorites.push(req.query.url);
        user.save(function(err, savedUser) {
          res.json();
        });
      }
    });
  },

  fetchFavorites: function(req, res, next) {
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) next(err);
      if (!user) {
        console.error('User was not found');
      } else {
        res.json(user.favorites);
      }
    });
  }

};
