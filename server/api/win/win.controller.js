/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /wins              ->  index
 * POST    /wins              ->  create
 * GET     /wins/:id          ->  show
 * PUT     /wins/:id          ->  update
 * DELETE  /wins/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Win = require('./win.model');

// Get list of wins
exports.index = function(req, res) {
  Win.find(function (err, wins) {
    if(err) { return handleError(res, err); }
    return res.json(200, wins);
  });
};

// Get a single win
exports.show = function(req, res) {
  Win.findById(req.params.id, function (err, win) {
    if(err) { return handleError(res, err); }
    if(!win) { return res.send(404); }
    return res.json(win);
  });
};

// Creates a new win in the DB.
exports.create = function(req, res) {
  Win.create(req.body, function(err, win) {
    if(err) { return handleError(res, err); }
    return res.json(201, win);
  });
};

// Updates an existing win in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Win.findById(req.params.id, function (err, win) {
    if (err) { return handleError(res, err); }
    if(!win) { return res.send(404); }
    var updated = _.merge(win, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, win);
    });
  });
};

// Deletes a win from the DB.
exports.destroy = function(req, res) {
  Win.findById(req.params.id, function (err, win) {
    if(err) { return handleError(res, err); }
    if(!win) { return res.send(404); }
    win.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}