(function() {
  'use strict';

  angular.module('deckBuilder').factory('AllCardsService', ['$http', 'CardsDatabase', function($http, CardsDatabase) {
    var allCards = null;

    $http.get(CardsDatabase).success(function (json) {
      allCards = json;
    });

    return {
      setData: function (data) {
          allCards = data;
      },
      getAllCards: function () {
          return $http.get(CardsDatabase);
      },
      getIdentities: function() {
        return null;
      },
      getRunnerIdentities: function() {
        return null;
      },
      getCorpIdentities: function() {
        return null;
      }
    };
  }]);
})();
