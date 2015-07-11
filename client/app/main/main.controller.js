'use strict';

angular.module('pinterestApp')
  .controller('MainCtrl', ['$scope', '$http', 'socket', 'WinsProvider', 'Auth', '$interval', 
              function ($scope, $http, socket, Wins, Auth, $interval) {
    $scope.wins = [];
    $scope.queue = [];
    $scope.isLoggedIn = Auth.isLoggedIn;
    
    
    $http.get('/api/wins/recent').success(function(recentWins) {
      $scope.wins = recentWins.slice(0,2);
      $scope.queue = recentWins.slice(2, 5);
      
      console.log($scope.queue, $scope.wins);

      // a timeout for the nifty animation - gets the reader's attention
      var popWins = $interval($scope.popNewWin, 1500, 3);

      socket.syncUpdates('win', $scope.wins, function(event, win, wins) {
        if ($scope.wins.length > 5) {
          $scope.wins.shift();
        }
      });
    });


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('win');
      $scope.stopTimer();

    });

    // helper function for the animation
    $scope.popNewWin = function popNewWin() {
      $scope.wins.unshift($scope.queue.pop());
    }

    // helper fxn to destroy the timer
    $scope.stopTimer = function killTimer() {
      if (angular.isDefined(popWins)) {
        $interval.cancel(popWins);
        popWins = undefined;
      }
    }
  }]);
