(function() {
  'use strict';

  angular.module('dataDealer').factory('AllCardsService', ['$http', 'CardsDatabase', function($http, CardsDatabase) {
    var AllCardsService = {};

    AllCardsService.allCards = {};

    AllCardsService.getAllCards = function () {
      return $http.get(CardsDatabase, {cache: true}).success(function(response) {
        AllCardsService.allCards = response.netrunnerCards;
      });
    };

    return AllCardsService;
  }]);
})();
