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
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  views: {
    type: Number,
    default: 0
  }
});

PhotoSchema.index({ loc: '2dsphere' });

module.exports = mongoose.model('Photos', PhotoSchema);
