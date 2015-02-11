(function($, window, undefined) {
  'use strict';
  window.deckBuilder = angular.module('deckBuilder', ['ngRoute']);
})(jQuery, this);

(function($, window, deckBuilder, undefined) {
  'use strict';
  deckBuilder.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      controller: 'DeckManagerController',
      templateUrl: 'templates/deck-manager.html'
    }).
    when('/deck/edit/:deckId', {
      controller: 'DeckBuilderController',
      templateUrl: 'templates/deck-builder.html',
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

  deckBuilder.factory('UserDecksService', [function() {
    var allDecks = {};

    try {
      allDecks = JSON.parse(localStorage.getItem('allDecks'));
    } catch (e) {
      console.log('localStorage is corrupted. Probably needs to be cleared');
    }

    if (!allDecks) {
      allDecks = {};
    }

    return {
      saveDeck: function(deck) {
        allDecks[deck.id] = deck;
        localStorage.setItem('allDecks', JSON.stringify(allDecks));
      },
      getDecks: function() {
        return allDecks;
      },
      buildDeck: function(id) {
        if (allDecks[id]) {
          return allDecks[id];
        } else {
          return {
            card: {},
            totalCards: 0,
            agendaPoints: 0,
            requiredAgendaPoints: [18, 19],
            name: '',
            id: null
          };
        }
      }
    };
  }]);
})(jQuery, this, window.deckBuilder);

(function($, window, deckBuilder, undefined) {
  'use strict';
  deckBuilder.controller('DeckBuilderController', ['$scope', '$routeParams', 'AllCardsService', 'UserDecksService', function($scope, $routeParams, AllCardsService, UserDecksService) {
    $scope.deckStatus = UserDecksService.buildDeck($routeParams.deckId);

    if (AllCardsService.hasOwnProperty('promise')) {
      AllCardsService.promise.success(function(data) {
        $scope.allCards = data.netrunnerCards;
      });
    }
    $scope.orderProp = 'faction';

    /**
     * Saves the active deck to the UserDecksService.
     * Deck is given a unique ID based off timestamp.
     */
    $scope.saveDeck = function() {
      // TODO: validate before saving
      if ($scope.deckStatus.id === null) {
        $scope.deckStatus.id = (new Date()).getTime().toString();
      }
      UserDecksService.saveDeck($scope.deckStatus);
    };

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
        $scope.updateCardCount();
        if (card.agendapoints) {
          $scope.updateAgendaPoints(card.agendapoints);
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
        $scope.updateCardCount();
        if (card.agendapoints) {
          $scope.updateAgendaPoints(card.agendapoints, true);
        }
      }
    };

    $scope.updateCardCount = function() {
      var usedCards = Object.keys($scope.deckStatus.card),
        quantity = 0;

      for (var code in usedCards) {
        quantity += $scope.deckStatus.card[usedCards[code]].quantity;
      }

      $scope.deckStatus.totalCards = quantity;
      $scope.updateRequiredAgendaPoints();
    };

    $scope.updateAgendaPoints = function(agendaPoints, isDecreased) {
      if (isDecreased) {
        $scope.deckStatus.agendaPoints -= agendaPoints;
      } else {
        $scope.deckStatus.agendaPoints += agendaPoints;
      }
    };

    $scope.updateRequiredAgendaPoints = function() {
      var minimumAgendaPoints = 18;

      // TODO: Need to pull in the minimum cards from used identity i.e. for NBN:TWIY
      if ($scope.deckStatus.totalCards > 39) {
        // Caution: MATH - https://www.youtube.com/watch?v=gENVB6tjq_M
        minimumAgendaPoints += (Math.floor(($scope.deckStatus.totalCards - 40) / 5) * 2);
      }

      $scope.deckStatus.requiredAgendaPoints = [minimumAgendaPoints, minimumAgendaPoints + 1];
    };
  }]);
})(jQuery, this, window.deckBuilder);

(function($, window, deckBuilder, undefined) {
  'use strict';
  deckBuilder.controller('DeckManagerController', ['$scope', 'UserDecksService', function($scope, UserDecksService) {
    $scope.allDecks = UserDecksService.getDecks();
  }]);
})(jQuery, this, window.deckBuilder);
