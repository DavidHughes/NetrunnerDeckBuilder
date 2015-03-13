(function() {
  'use strict';
  angular.module('dataDealer', ['ngRoute']);
})();

(function() {
  'use strict';
  angular.module('dataDealer').value('CardsDatabase', 'data/allCards.json');
})();

(function() {
  'use strict';
  angular.module('dataDealer').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        controller: 'DeckManagerController',
        templateUrl: 'templates/deck-manager.html'
      }).
      when('/deck/edit/:deckId', {
        controller: 'DeckEditorController',
        templateUrl: 'templates/deck-builder.html',
        resolve: {
          'AllCardsService': function(AllCardsService) {
            return AllCardsService;
          }
        }
      });

    $locationProvider.html5Mode(true);
  }]);
})();

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

(function() {
  'use strict';

  angular.module('dataDealer').factory('UserDecksService', [function() {
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
          return angular.copy(allDecks[id]);
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
})();

(function() {
  'use strict';
  angular.module('dataDealer').controller('DeckEditorController', ['$scope', '$routeParams', 'AllCardsService', 'UserDecksService', function($scope, $routeParams, AllCardsService, UserDecksService) {
    $scope.deckStatus = UserDecksService.buildDeck($routeParams.deckId);

    AllCardsService.getAllCards(function(data) {
      $scope.allCards = data.netrunnerCards;
    });

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
      $scope.isDeckSaved = true;
    };

    $scope.revertDeck = function() {
      $scope.deckStatus = UserDecksService.buildDeck($scope.deckStatus.id);
      $scope.isDeckSaved = true;
    };

    $scope.isDeckSaved = true;

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
        newQuantity = Math.max($scope.deckStatus.card[card.code].quantity - 1, 0);
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

      $scope.isDeckSaved = false;
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
})();

(function() {
  'use strict';
  angular.module('dataDealer').controller('DeckManagerController', ['$scope', 'UserDecksService', function($scope, UserDecksService) {
    $scope.allDecks = UserDecksService.getDecks();

    $scope.changeDeckName = null;

    $scope.setDeckName = function(deckId, newName) {
      if ($scope.allDecks[deckId]) {
        $scope.allDecks[deckId].name = newName;
        UserDecksService.saveDeck($scope.allDecks[deckId]);
      }
    };
  }]);
})();
