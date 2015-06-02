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
var User = require('../user/user.model');

// Get list of wins for the current logged in user
exports.index = function(req, res) {
  Win.find(function (err, wins) {
    if(err) { return handleError(res, err); }
    return res.json(200, wins);
  });
};

// Get most recent 100 wins
exports.recent = function(req, res) {
  var query = Win.find().sort('-timestamp').populate('user', 'name').limit(20);
  query.exec(function(err, wins) {
    if (err) { return handleError(res, err); }
    return res.json(wins);
  });
};

// Get a single win
exports.show = function(req, res) {
  var id = req.params.id;
  if (id === 'recent') {
    return exports.recent(req, res);
  }

  Win.findById(id, function (err, win) {
    if(err) { return handleError(res, err); }
    if(!win) { return res.send(404); }
    return res.json(win);
  });
};

// Creates a new win in the DB.
exports.create = function(req, res) {
  var win = new Win(req.body);
  win.timestamp = Date.now();

  var user = win.user;

  console.log('this is the new win', win);

  Win.create(req.body, function(err, win) {
    if(err) { return handleError(res, err); }
    //return res.json(201, win);
    User.findById(user, function(err, user) {
      if (err) { return handleError(res, err); }
      user.wins.push(win);
      user.save(function(err) {
        if (err) {
          return handleError(res, err);
        }
        return res.json(201, win);
      });
    });
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

// Users can 'like' a win, which updates the hearts count
exports.likeWin = function (req, res) {
  var id = req.params.id;

  Win.findById(id, function(err, win) {
    if (err) { return handleError(res, err); }
    if (!win) { return res.send(404); }
    win.like(function(err, win) {
      if (err) {
        return handleError(res, err);
      }
      return res.json(200, win);
    });
  });
};

// reblogs, which saves the win to another user's profile
exports.reblogWin = function(req, res) {
  var thisWin = req.params.id,
      newUserId = req.body.newUserId;

  Win.findById(thisWin, function(err, win) {
    if (err) { return handleError(res, err); }
    if (!win) { return res.send(404); }
    win.reblog(function(err, win) {
      if (err) {return handleError(res, err); }
      User.findById(newUserId, function(err, user) {
        if (err) { return handelError(res, err); }
        if (!user) { return res.send(404); }
        else {
          if (user.wins.indexOf(win)) {
            user.wins.push(thisWin);
            user.save(function(err) {
            if (err) { return handleError(res, err); }
              return res.json(200, win);
            });
          } else {
            return res.json(401, win);
          }

        }
      });
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