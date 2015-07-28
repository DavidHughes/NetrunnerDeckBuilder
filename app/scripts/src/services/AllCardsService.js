(function() {
  'use strict';

  angular.module('dataDealer').factory('AllCardsService', function($http, $q, CardsDatabase) {
    var AllCardsService = {};

    AllCardsService.allCards = {};

    AllCardsService.getAllCards = function () {
      var deferred = $q.defer();

      $http.get(CardsDatabase, {cache: true}).success(function(response) {
        AllCardsService.allCards = response.netrunnerCards;
        deferred.resolve(response.netrunnerCards);
      });

      return deferred.promise;
    };

    return AllCardsService;
  });
})();
