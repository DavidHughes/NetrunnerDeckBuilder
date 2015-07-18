(function() {
  'use strict';

  angular.module('dataDealer').factory('AllCardsService', ['$http', 'CardsDatabase', function($http, CardsDatabase) {
    return {
      getAllCards: function (callback) {
        return $http.get(CardsDatabase, {'cache': true}).success(callback);
      }
    };
  }]);
})();
