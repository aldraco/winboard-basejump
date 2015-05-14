'use strict';

angular.module('pinterestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('winboard', {
        url: '/winboard',
        templateUrl: 'app/wins/winBoard.html'
      });
  });