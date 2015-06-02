angular.module('pinterestApp')
  .factory('WinsService', ['$resource', function($resource) {
    var Wins = $resource('/api/wins/:win_id',
                         {edit: {method: 'PUT'}});
    return Wins;
  }])
  .factory('WinsProvider', ['$q', 'WinsService', function($q, Wins) {
    var deferred = $q.defer();
    Wins.query({}, function(wins) {
      deferred.resolve(wins);
    }, function(err) {
      if (err.status === 404) {
          return "Not able to find wins.";
          }
        deferred.reject('Unable to fetch data from server.');
    });
    return deferred.promise;
  }]);