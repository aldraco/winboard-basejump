/* global io */
'use strict';

angular.module('pinterestApp')
  .factory('socket', function(socketFactory) {

    // socket.io now auto-configures its connection when we omit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      syncUpdatesRecent: function(modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on model save, 
         * but handles them in a way specific to the recent items controller's needs
         */

        socket.on(modelName + ':save', function(item) {
          var oldItem = _.find(array, {_id: item._id});

          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace old Item if it exists
          // otherwise just shift it into the collection

          if (oldItem) {
            array.splice(index, 1, item);
          } else {
            // instead of pushing, place the item at the beginning
            array.unshift(item);
          }

          cb(event, item, array);
        });

        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  });
