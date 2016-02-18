var mongoose = require('mongoose');
var Schema = mongoose.schema;

var userSchema = new Schema({
  photoURL: {
    type: String,
    required: true,
    unique: true
  }
  // users: [ userID1, userID2 ];
});