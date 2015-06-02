'use strict';

angular.module('pinterestApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', 'WinsProvider', function ($scope, $http, socket, Wins) {
    $scope.recentWins = [];
    $scope.testWins = [];
    
    
    // TODO modify to get only recent wins, and later get a stream of latest wins 
    $http.get('/api/wins/recent').success(function(recentWins) {
      $scope.recentWins = recentWins;
      console.log(recentWins);
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
  }]);
