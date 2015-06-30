'use strict';

angular.module('pinterestApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('winboard', {
        url: '/winboard',
        templateUrl: 'app/wins/winboards/winBoard.html',
        controller: 'WinboardCtrl',
        authenticate: true
      })
      .state('recentWins', {
        url: '/recents',
        templateUrl: 'app/wins/winboards/recentWins.html',
        controller: 'RecentWinsCtrl',
        resolve: {
          recentWins: function($http) {

            return $http.get('/api/wins/recent').
              success(function(data, status, headers, config) {
                return data.data;
              })
              .error(function(data, status, headers, config) {
                if (status === 404) {
                  return 'No recent wins.';
                }
              });
          }
        }
      })
      .state('userProfile', {
        url: 'users/:user_id',
        templateUrl: 'app/wins/winboards/winBoard.html',
        controller: 'profileCtrl',
        resolve: {
          viewingUser: function($http, $stateParams) {
            
            var user_id = $stateParams.user_id;
            return $http.get('/api/users/'+user_id).
              success(function(data, status, headers, config) {
                return data.data;
              })
              .error(function(data, status, headers, config) {
              });
          }
        }
      });
  });