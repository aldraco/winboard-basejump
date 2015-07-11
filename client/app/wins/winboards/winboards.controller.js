'use strict';

angular.module('pinterestApp')
  .controller('WinboardCtrl', ['$scope', '$http', 'Auth', '$modal', 'WinsService', 'socket',
              function($scope, $http, Auth, $modal, Wins, socket) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;
    // get the current User's wins
    $scope.wins = $scope.currentUser.wins || [];


    socket.syncUpdatesRecent('win', $scope.wins, function(event, win, wins) {
    });

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('win');
    });

    $scope.addWin = function() {
      var ModalInstance = $modal.open({
        templateUrl: 'app/wins/addWin.html', 
        controller: 'addWinCtrl',
        size: 'md',
        resolve: {
          currentUser: function() {
            var currentUser = $scope.currentUser._id;
            return currentUser;
          }
        }
      });

      ModalInstance.result.then(function (newWin) {
        var win = new Wins(newWin);
        //win.$save();
        $http.post('/api/wins/', newWin).
          success(function(data, status, headers, config){
          }).
          error(function(data, status, headers, config){
          });

      }, function(reason) {
      });

    };

    $scope.deleteWin = function(winId) {
      var ModalInstance = $modal.open({
        templateUrl: 'app/wins/deleteWin.html',
        controller: 'deleteWinCtrl',
        size: 'sm',
        resolve: {
          currentWin: function() {
            return winId;
          }
        }
      });

      ModalInstance.result.then(function (deleted) {

      }, function(reason) {
      });
    };




  }])
  .controller('profileCtrl', ['$scope', 'viewingUser', 'Auth', '$http', 'socket', 
              function($scope, viewingUser, Auth, $http, socket) {
    $scope.currentUser = viewingUser.data;
    $scope.you = Auth.getCurrentUser()._id;
    $scope.viewingProfile = true;
    $scope.wins = $scope.currentUser.wins;

    socket.syncUpdatesRecent('win', $scope.wins, function(event, win, wins) {
    });

    $scope.likeWin = function(_id) {
      $http.post('/api/wins/like/' + _id, {newUserId: $scope.you}).
        success(function(data, status, headers, config) {
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.reblogWin = function(winId) {
      var thisUserId = $scope.you;
      $http.post('/api/wins/reblog/'+ winId, {newUserId: thisUserId}).
        success(function(data, status, headers, config) {
        }).error(function(data, status, headers, config) {
        });
    };
    
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('win');
    });
  }])
  .controller('RecentWinsCtrl', ['$scope', 'recentWins', 'socket', '$http', 'Auth', function($scope, recentWins, socket, $http, Auth) {
    // from resolve, will be an array 100 wins
    $scope.recentWins = recentWins.data;
    if (recentWins.data.length < 10) {
      $scope.message = 'We need some more wins! Why don\'t you sign up and add a few?';
    }
    $scope.currentUser = Auth.getCurrentUser();
    $scope.holder = [];


    socket.syncUpdatesRecent('win', $scope.recentWins, function(event, win, wins) {
    });

    $scope.likeWin = function(_id) {
      $http.post('/api/wins/like/' + _id, {newUserId: $scope.currentUser._id}).
        success(function(data, status, headers, config) {
        }).error(function(data, status, headers, config) {
        });
    };

    $scope.reblogWin = function(winId) {
      var thisUserId = $scope.currentUser._id;
      $http.post('/api/wins/reblog/'+ winId, {newUserId: thisUserId}).
        success(function(data, status, headers, config) {
        }).error(function(data, status, headers, config) {
        });
    };


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('win');
    });

  }])