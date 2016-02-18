var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  location: {
    type: String,
    required: true,
    unique: true
  }
  // users: [ userID1, userID2 ];
});

module.exports = mongoose.model('Photos', PhotoSchema);
