var Q = require('q');
var User = require('./userModel');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Photo = require('./../photos/photoModel');
var helpers = require('../config/helpers');

var findUser = Q.nbind(User.findOne, User);
var createUser = Q.nbind(User.create, User);

// helper function for deleting specific items from arrays inside of mongoose object instances:
// example usage: deleteFrom(currentUser.friends, {username: "snarf"}) --> will remove snarf as a friend. Note optionObj can only specify a single property, in this example, "username".
var deleteFrom = function (arr, optionObj) {
  var key = Object.keys(optionObj)[0];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === optionObj[key]) {
      arr.splice(i, 1);
    }
  }
  return arr;
};

module.exports = {
  login: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          next(new Error('User does not exist'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                var token = jwt.sign({ username: username, userId: user._id }, 'FRANKJOEVANMAX');
                res.json({ userId: user._id, username: user.username, token: token });
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
    var username = req.body.username;
    var password = req.body.password;

    findUser({ username: username })
      .then(function(user) {
        if (user) {
          return next(new Error('User already exist!'));
        } else {
          return createUser({
            username: username,
            password: password
          }).then(function(user) {
            console.log('Created user', user);
              // Generate JWT for user here
              // params: payload, secret key, encryption, callback
            var token = jwt.sign({ username: user.username, userId: user._id }, 'FRANKJOEVANMAX');
            console.log('token created', token);
            res.json({ token: token, userId: user._id, username: user.username });
            next();
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
    console.log('imcomming GET for JWT', req.params.JWT);
    var decoded = jwt.verify(req.params.JWT, 'FRANKJOEVANMAX', function(err, decoded) {
      if (err) {
        console.log('problem decoding', err);
      } else {
        // send back decoded.userId and decoded.username
        res.json({ username: decoded.username, userId: decoded.userId });
        next();
      }
    });
    // send back user id
  },

  changePassword: function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    var newPassword = req.body.newPassword;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          return next(new Error('User does not exist!'));
        } else {
          return user.comparePasswords(password)
            .then(function(foundUser) {
              if (foundUser) {
                user.password = newPassword;
                user.save(function(err, savedUser) {
                  if (err) {
                    next(err);
                  }
                  res.sendStatus(201);
                });
              } else {
                return next(new Error('Incorrect password'));
              }
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
    var username = req.body.username;
    var newUsername = req.body.newUsername;

    findUser({ username: username })
      .then(function(user) {
        if (!user) {
          return next(new Error('User does not exist!'));
        } else {
          user.username = newUsername;
          user.save(function(err, savedUser) {
            if (err) {
              next(err);
            }
            res.json({ username: savedUser.username });
          });
        }
      })
      .fail(function(error) {
        next(error);
      });
  },

  toggleFavorite: function(req, res, next) {
    var url = req.query.url;
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return helpers.badReturnedObjectResponse('user', 'ID', res);
      } else {
        if (user.favorites.indexOf(url) === -1) {
          user.favorites.push(url);
        } else {
          user.favorites.splice(user.favorites.indexOf(url), 1);
        }
        user.save(function(err, savedUser) {
          res.json();
        });
      }
    });
  },

  getPhotoData: function(req, res, next) {
    var currentUserId = req.query.userId;
    Photo.findOne({ url: req.query.url }, function(err, photo) {
      if (err) {
        return next(err);
      }
      if (photo) {
        User.findOne({ _id: mongoose.mongo.ObjectID(photo.userId) }, function(err, user) {
          if (err) {
            return next(err);
          }
          if (!user) {
            return helpers.badReturnedObjectResponse('user', 'ID', res);
          } else {
            User.findOne({ _id: mongoose.mongo.ObjectID(currentUserId) }, function(err, user) {
              if (err) {
                next(err);
              }
              if (!user) {
                return helpers.badReturnedObjectResponse('user', 'ID', res);
              } else {
                var favorited = (user.favorites.indexOf(req.query.url) === -1);
                res.json({ username: user.username, views: photo.views, favorited: !favorited });
              }
            });
          }
        });
      } else {
        return helpers.badReturnedObjectResponse('photo', 'url', res);
      }
    });
  },

  savePhotoToUserInDB: function (req, res, next) {
    User.update({_id: mongoose.mongo.ObjectID(req.body.userId)}, {profilePhotoUrl: req.body.url}, function (err, status) {
      if (err) {
        return next(err);
      }
      res.sendStatus(201);
    });
  },

  // Social routes - Please see API.md for API endpoint chart
  fetchFavorites: function (req, res, next) {
    User.findOne({ _id: mongoose.mongo.ObjectID(req.query.userId) }, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return helpers.badReturnedObjectResponse('user', 'ID', res);
      }
      res.json(user.favorites);
    });
  },

  fetchFriends: function (req, res, next) {
    User.find({ friends: { $elemMatch: { username: req.params.username } } }, (err, friends) => {
      if (err) {
        return next(err);
      }
      res.json(friends);
    });
  },

  fetchFriendRequests: function (req, res, next) {
    User.findOne({_id: mongoose.mongo.ObjectID(req.params.userId)}, {friendRequests: 1, _id: 0}, function (err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return helpers.badReturnedObjectResponse('user', 'ID', res);
      }
      res.json(user.friendRequests);
    });
  },

  requestFriend: function (req, res, next) {
    User.findOne({_id: mongoose.mongo.ObjectID(req.body.currentUserId)}, {username: 1, _id: 1}, function (err, currentUser) {
      if (err) {
        return next(err);
      }
      if (!currentUser) {
        return helpers.badReturnedObjectResponse('user', 'ID', res);
      }
      User.update({username: req.body.targetUsername}, {$addToSet: {friendRequests: currentUser}}, function (err, status) {
        if (err) {
          return next(err);
        }
        if (status.nModified === 0) {
          return helpers.badReturnedObjectResponse('target user', 'username', res);
        }
        res.sendStatus(201);
      });
    });
  },

  searchUsers: function (req, res, next) {
    var regexSearch = new RegExp(req.params.username);
    User.find({username: regexSearch}, {_id: 1, username: 1}, function (err, users) {
      if (err) {
        return next(err);
      }
      res.json(users);
    });
  },

  confirmFriendRequest: function (req, res, next) {
    User.findOne({_id: mongoose.mongo.ObjectID(req.body.currentUserId)}, {_id: 1, username: 1, friends: 1, friendRequests: 1}, function (err, currentUser) {
      if (err) {
        return next(err);
      }
      if (!currentUser) {
        return helpers.badReturnedObjectResponse('user', 'ID', res);
      }
      User.findOne({_id: mongoose.mongo.ObjectID(req.body.targetUserId)}, {_id: 1, username: 1, friends: 1}, function (err, targetUser) {
        if (err) {
          return next(err);
        }
        if (!targetUser) {
          return helpers.badReturnedObjectResponse('target user', 'ID', res);
        }
        currentUser.friends.addToSet({
          _id: mongoose.mongo.ObjectID(targetUser._id),
          username: targetUser.username
        });
        deleteFrom(currentUser.friendRequests, {username: targetUser.username});
        currentUser.save(function (err) {
          if (err) {
            return next(err);
          }
          targetUser.friends.addToSet({
            _id: mongoose.mongo.ObjectID(currentUser._id),
            username: currentUser.username
          });
          targetUser.save(function (err) {
            if (err) {
              return next(err);
            }
            res.sendStatus(201);
          });
        });
      });
    });
  },

  rejectFriendRequest: function (req, res, next) {
    User.update({_id: mongoose.mongo.ObjectID(req.body.currentUserId)}, {$pull: {friendRequests: {username: req.body.targetUsername}}}, function (err, status) {
      if (err) {
        return next(err);
      }
      if (status.nModified === 0) {
        return helpers.badReturnedObjectResponse('user or target user', 'ID or username', res);
      }
      res.sendStatus(201);
    });
  },

  unfriend: function (req, res, next) {
    User.update({_id: mongoose.mongo.ObjectID(req.body.currentUserId)}, {$pull: {friends: {username: req.body.targetUsername}}}, function (err, status) {
      if (err) {
        return next(err);
      }
      User.findOne({_id: mongoose.mongo.ObjectID(req.body.currentUserId)}, {username: 1, _id: 0}, function (err, currentUser) {
        if (err) {
          return next(err);
        }
        if (!currentUser) {
          return helpers.badReturnedObjectResponse('user', 'ID', res);
        }
        User.update({username: req.body.targetUsername}, {$pull: {friends: {username: currentUser.username}}}, function (err, status) {
          if (err) {
            return next(err);
          }
          if (status.nModified === 0) {
            return helpers.badReturnedObjectResponse('target user', 'username', res);
          }
          res.sendStatus(201);
        });
      });
    });
  }

};
