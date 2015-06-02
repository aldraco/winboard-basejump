'use strict';

angular.module('pinterestApp')
  .controller('WinboardCtrl', ['$scope', '$http', 'Auth', '$modal', 'WinsService', function($scope, $http, Auth, $modal, Wins) {
    $scope.currentUser = Auth.getCurrentUser();
    $scope.isLoggedIn = Auth.isLoggedIn;
    // get the current User's wins
    $scope.wins = $scope.currentUser.wins || [];

    console.log($scope.wins);

    $scope.addWin = function() {
      console.log("button clicked");
      var ModalInstance = $modal.open({
        templateUrl: 'app/wins/addWin.html', 
        controller: 'addWinCtrl',
        size: 'lg',
        resolve: {
          currentUser: function() {
            var currentUser = $scope.currentUser._id;
            console.log(currentUser);
            return currentUser;
          }
        }
      });

      ModalInstance.result.then(function (newWin) {
        console.log(newWin);
        var win = new Wins(newWin);
        console.log(win);
        win.$save();

      }, function(reason) {
        console.log('Modal dismissed for ', reason);
      });

    };

    $scope.deleteWin = function(winId) {
      console.log('delete button clicked', winId);
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
        console.log(deleted);

      }, function(reason) {
        console.log('cancelled delete for ', reason);
      });
    };




  }])
  .controller('profileCtrl', ['$scope', 'viewingUser', 'Auth', '$http', function($scope, viewingUser, Auth, $http) {
    $scope.currentUser = viewingUser.data;
    $scope.you = Auth.getCurrentUser()._id;
    $scope.viewingProfile = true;
    $scope.wins = $scope.currentUser.wins;
    console.log($scope.currentUser);

    $scope.likeWin = function(_id) {
      console.log(_id);
      $http.post('/api/wins/like/' + _id).
        success(function(data, status, headers, config) {
          console.log("win liked");
        }).error(function(data, status, headers, config) {
          console.log("win like failed");
        });
    };

    $scope.reblogWin = function(winId) {
      var thisUserId = $scope.you;
      console.log(thisUserId);
      $http.post('/api/wins/reblog/'+ winId, {newUserId: thisUserId}).
        success(function(data, status, headers, config) {
          console.log("win reblogged");
        }).error(function(data, status, headers, config) {
          console.log("Sorry, you cannot reblog your own wins.");
        });
    };
  }])
  .controller('RecentWinsCtrl', ['$scope', 'recentWins', 'socket', '$http', 'Auth', function($scope, recentWins, socket, $http, Auth) {
    // from resolve, will be an array 100 wins
    $scope.recentWins = recentWins.data;
    $scope.currentUser = Auth.getCurrentUser();
    $scope.holder = [];

    /*socket.syncUpdates('win', $scope.recentWins, function(event, win, wins) {
      console.log("change", win);
        // when the hopper is full

        // add the new wins to the model (which won't update yet)

        // show a div 
      
    });*/

    socket.syncUpdatesRecent('win', $scope.recentWins, function(event, win, wins) {
      console.log('new win?', win);
    });

    $scope.likeWin = function(_id) {
      console.log(_id);
      $http.post('/api/wins/like/' + _id).
        success(function(data, status, headers, config) {
          console.log("win liked");
        }).error(function(data, status, headers, config) {
          console.log("win like failed");
        });
    };

    $scope.reblogWin = function(winId) {
      var thisUserId = $scope.currentUser._id;
      console.log(thisUserId);
      $http.post('/api/wins/reblog/'+ winId, {newUserId: thisUserId}).
        success(function(data, status, headers, config) {
          console.log("win reblogged");
        }).error(function(data, status, headers, config) {
          console.log("Sorry, you cannot reblog your own wins.");
        });
    };


    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('win');
    });

  }])
  .controller('addWinCtrl', ['$scope', '$modalInstance', 'currentUser', function($scope, modal, currentUser) {
    $scope.newWin = {
      user: currentUser
    };

    $scope.ok = function(newWin) {
      modal.close(newWin);
    };

    $scope.cancel = function() {
      modal.dismiss('cancel');
    }
  }])
  .controller('deleteWinCtrl', ['$scope', 'WinsService', 'currentWin', '$modalInstance', function($scope, Win, currentWin, modal) {
    $scope.currentWinId = currentWin;

    $scope.deleteOK = function() {
      var winId = $scope.currentWinId;
      Win.delete({win_id: winId}, function(win) {
        console.log(win, 'deleted');
        modal.close(win);
      });

    }

    $scope.cancel = function() {
      modal.dismiss('cancel');
    }

  }]);