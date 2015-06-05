'use strict';

var express = require('express');
var controller = require('./win.controller');


var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/like/:id', controller.likeWin);
router.post('/reblog/:id', controller.reblogWin);
router.post('/unblog/:id', controller.removeFromBoard);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;