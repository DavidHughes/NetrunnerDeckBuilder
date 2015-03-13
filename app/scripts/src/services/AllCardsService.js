(function() {
  'use strict';

  angular.module('dataDealer').factory('AllCardsService', ['$http', 'CardsDatabase', '$filter', function($http, CardsDatabase, $filter) {
    return {
      'getAllCards': function (callback) {
        return $http.get(CardsDatabase, {'cache': true}).success(callback);
      },
      'getIdentities': function(callback) {
        return $http.get(CardsDatabase, {'cache': true}).then(function(response) {
          if (response.status === 200) {
            response.data.netrunnerCards = $filter('filter')(response.data.netrunnerCards, {type: 'Identity'});
            callback(response.data);
          }
        });
      },
      'getRunnerIdentities': function(callback) {
        return $http.get(CardsDatabase, {'cache': true}).then(function(response) {
          if (response.status === 200) {
            response.data.netrunnerCards = $filter('filter')(response.data.netrunnerCards, {
              type: 'Identity',
              side: 'Runner'
            });
            callback(response.data);
          }
        });
      },
      'getCorpIdentities': function(callback) {
        return $http.get(CardsDatabase, {'cache': true}).then(function(response) {
          if (response.status === 200) {
            response.data.netrunnerCards = $filter('filter')(response.data.netrunnerCards, {
              type: 'Identity',
              side: 'Corp'
            });
            callback(response.data);
          }
        });
      }
    };
  }]);
})();
