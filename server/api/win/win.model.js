'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WinSchema = new Schema({
  name:       String,
  mediaSrc:   String,
  mediaType:  String,
  timestamp:  {type: Date, default: Date.now() },
  tags:       [String],
  caption:    String,
  hearts:     Number,
  reblogs:    Number,
  sourceUrl:  String,
  user:       Schema.Types.ObjectId

});

module.exports = mongoose.model('Win', WinSchema);