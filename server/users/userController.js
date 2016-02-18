var Q = require('q');
var User = require('./userModel');

var getUsers = Q.nbind(User.find, User);

module.exports = {
  allUsers: function (req, res, next) {
    getUsers({})
      .then(function(users) {
        res.json(users);
      })
      .fail(function(error) {
        next(error);
      });
  }
};