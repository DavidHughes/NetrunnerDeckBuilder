(function() {
  'use strict';

  angular.module('deckBuilder').factory('AllCardsService', ['$http', 'CardsDatabase', '$filter', function($http, CardsDatabase, $filter) {
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
      'getRunnerIdentities': function() {
        return null;
      },
      'getCorpIdentities': function() {
        return null;
      }
    };
  }]);
})();
