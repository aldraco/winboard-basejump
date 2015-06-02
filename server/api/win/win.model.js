'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../user/user.model');

var WinSchema = new Schema({
  title:       String,
  mediaSrc:   String,
  mediaType:  String,
  timestamp:  {type: Date},
  tags:       [String],
  caption:    {type: String, default: ''},
  hearts:     {type: Number, default: 0},
  reblogs:    {type: Number, default: 0},
  sourceUrl:  {type: String, default: ''},
  user:       {type: Schema.Types.ObjectId, ref: 'User'}

});

WinSchema.method('like', function(cb) {
  this.hearts++;
  this.save(function(err, win) {
    if (err) { 
      return cb(err, null);
     } else {
      return cb(null, this);
     }
  });
  
});

WinSchema.method('reblog', function(cb) {
  this.reblogs++;
  console.log(this);
  this.save(function(err, win) {
    if (err) { 
      return cb(err, null);
     } else {
      return cb(null, this);
     }
  });

});

module.exports = mongoose.model('Win', WinSchema);