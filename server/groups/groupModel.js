var mongoose = require('mongoose');

var GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  users: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model('Group', GroupSchema);
