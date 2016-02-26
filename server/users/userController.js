var Q = require('q');
var User = require('./userModel');
var jwt = require('jsonwebtoken');

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
                res.json({userId: user._id, token: token});
              } else {
                return next(new Error('No user'));
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
            res.json({token: token, userId: user._id})
            next()
          }).catch(function(err) {
            console.log('problem creating user')
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
        console.log('decode worked', decoded)
        // send back decoded.userId and decoded.username
        res.json({username: decoded.username, userId: decoded.userId});
        next();
      }
    });
    // send back user id
  }
};
