/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var win = require('./win.model');

exports.register = function(socket) {
  win.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  win.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('win:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('win:remove', doc);
}