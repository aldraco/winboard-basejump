'use strict';

angular.module('pinterestApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', 'WinsProvider', 'Auth', function ($scope, $http, socket, Wins, Auth) {
    $scope.wins = [];
    $scope.testWins = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    
    
    $http.get('/api/wins/recent').success(function(recentWins) {
      $scope.wins = recentWins.slice(0, 10);
      socket.syncUpdates('win', $scope.wins, function(event, win, wins) {
        if ($scope.wins.length > 10) {
          $scope.wins.shift();
        }
      });
    });


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('win');
    });
  }]);
