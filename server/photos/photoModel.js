var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true
  },
  loc: { 
    type: { type: String }, 
    coordinates: []
  }
  // users: [ userID1, userID2 ];
});

PhotoSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('Photos', PhotoSchema);
