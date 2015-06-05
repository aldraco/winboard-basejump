'use strict';

angular.module('pinterestApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', 'WinsProvider', 'Auth', function ($scope, $http, socket, Wins, Auth) {
    $scope.wins = [];
    $scope.testWins = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    
    
    // TODO modify to get only recent wins, and later get a stream of latest wins 
    $http.get('/api/wins/recent').success(function(recentWins) {
      $scope.wins = recentWins.slice(0, 10);
      console.log($scope.wins);
      socket.syncUpdates('win', $scope.wins, function(event, win, wins) {
        console.log('are these the smae?', $scope.wins[$scope.wins.length-1], win);
        if ($scope.wins.length > 10) {
          $scope.wins.shift();
        }
      });
    });


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('win');
    });
  }]);
