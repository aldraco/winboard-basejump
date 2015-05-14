'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WinSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Win', WinSchema);