'use strict';

angular.module('pinterestApp')
  .controller('WinboardCtrl', ['$scope', '$http', 'Auth', function($scope, $http, Auth) {
    $scope.currentUser = Auth.getCurrentUser();
    console.log("Current user", $scope.currentUser);
    $scope.isLoggedIn = Auth.isLoggedIn;

    $scope.wins = [
    {
      mediaSrc: 'http://lorempixel.com/400/400/abstract',
      mediaType: 'image'
    },
    {
      mediaSrc: 'http://lorempixel.com/400/400/abstract',
      mediaType: 'video'
    },
    {
      mediaSrc: 'http://lorempixel.com/400/400/abstract',
      mediaType: 'video'
    },
    {
      mediaSrc: 'http://lorempixel.com/400/400/abstract',
      mediaType: 'video'
    },
    {
      mediaSrc: 'http://lorempixel.com/400/400/abstract',
      mediaType: 'image'
    },
    {
      mediaSrc: 'http://lorempixel.com/400/400/abstract',
      mediaType: 'image'
    },
    {
      mediaSrc: 'http://lorempixel.com/400/400/abstract',
      mediaType: 'video'
    }]

  }]);