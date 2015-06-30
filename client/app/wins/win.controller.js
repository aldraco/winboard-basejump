'use strict';

angular.module('pinterestApp')
  .controller('addWinCtrl', ['$scope', '$modalInstance', 'currentUser', function($scope, modal, currentUser) {
    $scope.newWin = {
      creator: currentUser
    };

    $scope.ok = function(newWin) {
      modal.close(newWin);
    };

    $scope.cancel = function() {
      modal.dismiss('cancel');
    }
  }])
  .controller('deleteWinCtrl', ['$scope', 'WinsService', 'currentWin', '$modalInstance', '$http', 'Auth',
                      function($scope, Win, currentWin, modal, $http, Auth) {
    $scope.currentWinId = currentWin;
    $scope.you = Auth.getCurrentUser()._id;

    $scope.deleteOK = function() {
      var winId = $scope.currentWinId;
      if (currentWin.creator === $scope.you) {
        $http.post('api/wins/unblog/' + winId, {currentUser: $scope.you}).
          success(function(user) {
            Win.delete({win_id: winId}, function(win) {
              modal.close(win);
            });
        });
      } else {
        $http.post('api/wins/unblog/' + winId, {currentUser: $scope.you}).
        success(function(user) {
          modal.close(user);
        });
      }


    }

    $scope.cancel = function() {
      modal.dismiss('cancel');
    }

  }]);