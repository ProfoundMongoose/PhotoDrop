var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
  groupname: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
  },
  administrator: {
    type: String,
    required: true
  },
  members: {
    type: Array,
    default: []
  },
  photoUrls: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Group', GroupSchema);
