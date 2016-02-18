var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  // password will be hashed with salt appended using bcrypt
  password: {
    type: String, 
    required: true
  }
  // photos: [ photoID1, photoID2 ];
});

module.exports = mongoose.model('User', UserSchema);