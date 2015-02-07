(function($, window, undefined) {
  'use strict';
  window.deckBuilder = angular.module('deckBuilder', ['ngRoute']);
})(jQuery, this);

(function($, window, deckBuilder, undefined) {
  'use strict';
  deckBuilder.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/',{
      controller: 'DeckBuilderController',
      resolve:{
        'AllCardsService': function(AllCardsService) {
          return AllCardsService.promise;
        }
      }
    });
  }]);
})(jQuery, this, window.deckBuilder);

(function($, window, deckBuilder, undefined) {
  'use strict';

  deckBuilder.factory('AllCardsService', ['$http', function($http) {
    var allCards = null;

    var promise = $http.get('data/allCards.json').success(function (json) {
      console.log(json);
      allCards = json;
    });

    return {
      promise: promise,
      setData: function (data) {
          allCards = data;
      },
      fetch: function () {
          return allCards.netrunnerCards;
      }
    };
  }]);
})(jQuery, this, window.deckBuilder);

(function($, window, deckBuilder, undefined) {
  'use strict';
  deckBuilder.controller('DeckBuilderController', ['$scope', '$http', 'AllCardsService', function($scope, $http, AllCardsService) {
    AllCardsService.promise.success(function(data) {
      $scope.allCards = data.netrunnerCards;
    });

    $scope.orderProp = 'faction';

    $scope.addCard = function(card) {
      var newQuantity = 1;

      if ($scope.deckStatus[card.code]) {
        newQuantity = $scope.deckStatus[card.code].quantity + 1;
      }

      if (newQuantity > 3) {
        newQuantity = 3;
      }

      $scope.deckStatus[card.code] = {
        details: card,
        quantity: newQuantity
      };
    };

    $scope.removeCard = function(card) {
      var newQuantity = 0;

      if ($scope.deckStatus[card.code]) {
        newQuantity = $scope.deckStatus[card.code].quantity - 1;
      }

      if (newQuantity < 0) {
        newQuantity = 0;
      }

      if ($scope.deckStatus[card.code]) {
        if (newQuantity) {
          $scope.deckStatus[card.code] = {
            details: card,
            quantity: newQuantity
          };
        } else {
          delete $scope.deckStatus[card.code];
        }
      }
    };

     /**
      * card id:
      * - card object
      * - quantity
      */
    $scope.deckStatus = {};
  }]);
})(jQuery, this, window.deckBuilder);
