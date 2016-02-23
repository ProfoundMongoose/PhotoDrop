var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');

var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  // password will be hashed with salt appended using bcrypt
  password: {
    type: String, 
    required: true
  },
  salt: String
  // photos: [ photoID1, photoID2 ];
});


UserSchema.methods.comparePasswords = function (candidatePassword) {
  var savedPassword = this.password;
  return Q.Promise(function (resolve, reject) {
    bcrypt.compare(candidatePassword, savedPassword, function (err, matched) {
      if (err) {
        reject(err);
      } else {
        resolve(matched);
      }
    });
  });
};

UserSchema.pre('save', function (next) {
  var user = this;

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) {
        return next(err);
      }
      user.password = hash;
      user.salt = salt;
      next();
    });
  });
});



module.exports = mongoose.model('User', UserSchema);




