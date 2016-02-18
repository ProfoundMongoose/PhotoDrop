var mongoose = require('mongoose');
var Schema = mongoose.schema;

var photoSchema = new Schema({
  photoURL: {
    type: String,
    location: String,
    required: true,
    unique: true
  }
  // users: [ userID1, userID2 ];
});

module.exports = mongoose.model('Photos', photoSchema);
