const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: String,
  location: String,
  rent: Number,
  contact: String,
  description: String,
  available: Boolean,
  image: String
});

module.exports = mongoose.model('Room', roomSchema);
