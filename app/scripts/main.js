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

    /**
     * Adds a card to the deckStatus object.
     *
     * If deckStatus already has an entry for the card, the quantity is increased.
     * If the quantity is at 3 already, there is no change.
     * @param card to be added
     * @return void
     */
    $scope.addCard = function(card) {
      var newQuantity = 1;

      if ($scope.deckStatus.card[card.code]) {
        newQuantity = $scope.deckStatus.card[card.code].quantity + 1;
      }

      if (newQuantity <= 3) {
        $scope.deckStatus.card[card.code] = {
          details: card,
          quantity: newQuantity
        };
        $scope.deckStatus.updateCardCount();
        if (card.agendapoints) {
          $scope.deckStatus.updateAgendaPoints(card.agendapoints);
        }
      }
    };

    $scope.removeCard = function(card) {
      var newQuantity = 0;

      if ($scope.deckStatus.card[card.code]) {
        newQuantity = $scope.deckStatus.card[card.code].quantity - 1;
      }

      if (newQuantity < 0) {
        newQuantity = 0;
      }

      if ($scope.deckStatus.card[card.code]) {
        if (newQuantity) {
          $scope.deckStatus.card[card.code] = {
            details: card,
            quantity: newQuantity
          };
        } else {
          delete $scope.deckStatus.card[card.code];
        }
        $scope.deckStatus.updateCardCount();
        if (card.agendapoints) {
          $scope.deckStatus.updateAgendaPoints(card.agendapoints, true);
        }
      }
    };

     /**
      * card id:
      * - card object
      * - quantity
      */
    $scope.deckStatus = {
      updateCardCount: function() {
        var usedCards = Object.keys($scope.deckStatus.card),
          quantity = 0;

          for (var code in usedCards) {
            quantity += $scope.deckStatus.card[usedCards[code]].quantity;
          }

          $scope.deckStatus.totalCards = quantity;
      },
      updateAgendaPoints: function(agendaPoints, isDecreased) {
        if (isDecreased) {
          $scope.deckStatus.agendaPoints -= agendaPoints;
        } else {
          $scope.deckStatus.agendaPoints += agendaPoints;
        }
      },
      card: {},
      totalCards: 0,
      agendaPoints: 0
    };
  }]);
})(jQuery, this, window.deckBuilder);
