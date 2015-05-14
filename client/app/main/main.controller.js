'use strict';

angular.module('pinterestApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.recentWins = [];

    
    // TODO modify to get only recent wins, and later get a stream of latest wins 
    $http.get('/api/wins').success(function(recentWins) {
      $scope.recentWins = recentWins;
      socket.syncUpdates('win', $scope.recentWins);
    });

    $scope.addWin = function() {
      if($scope.newWin === '') {
        return;
      }
      $http.post('/api/wins', { name: $scope.newWin });
      $scope.newWin = '';
    };

    $scope.deleteWin = function(win) {
      $http.delete('/api/wins/' + win._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('win');
    });
  });