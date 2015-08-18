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
        templateUrl: 'templates/deck-editor.html',
        resolve: {
          AllCardsService: ['AllCardsService', function(AllCardsService) {
            return AllCardsService.getAllCards();
          }]
        }
      }).
      when('/deck/edit/from/:identityId', {
        controller: 'DeckEditorController',
        templateUrl: 'templates/deck-editor.html',
        resolve: {
          AllCardsService: ['AllCardsService', function(AllCardsService) {
            return AllCardsService.getAllCards();
          }]
        }
      }).
      when('/deck/new/', {
        controller: 'DeckEditorController',
        templateUrl: 'templates/deck-starter.html',
        resolve: {
          AllCardsService: ['AllCardsService', function(AllCardsService) {
            return AllCardsService.getAllCards();
          }]
        }
      }).
      otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }]);
})();

(function() {
  'use strict';

  angular.module('dataDealer').factory('AllCardsService', ['$http', '$q', 'CardsDatabase', function($http, $q, CardsDatabase) {
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
  }]);
})();

(function() {
  'use strict';

  angular.module('dataDealer').factory('UserDecksService', function() {
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
            identity: {},
            id: null
          };
        }
      }
    };
  });
})();

(function() {
  'use strict';

  angular.module('dataDealer').factory('Deck', ['UserDecksService', function (UserDecksService) {
    /**
     * Saves the active deck to the UserDecksService.
     * Deck is given a unique ID based off timestamp.
     * TODO: validate before saving
     * @param {object} deck
     *   The deck to be saved
     *
     * @return {object/boolean}
     *   The deck is returned if save completed, else false.
     */
    var saveDeck = function(deck) {
      if (!deck) {
        // No deck - no save.
        return false;
      }

      // Initialise an ID for the deck if one does not exist.
      // TODO: Figure out a proper ID scheme.
      if (!deck.id) {
        deck.id = (new Date()).getTime().toString();
      }
      UserDecksService.saveDeck(deck);
      return deck;
    };

    /**
     * Fetches the last saved version of a deck.
     * @param deck
     *   The deck to revert.
     * @returns deck
     *   The latest version of deck.
     */
    var revertDeck = function(deck) {
      return UserDecksService.buildDeck(deck.id);
    };

    /**
     * Adds a card to the deckStatus object.
     *
     * If deckStatus already has an entry for the card, the quantity is increased.
     * If the quantity is at 3 already, there is no change.
     * @param deck
     * @param card
     * @returns the updated deck
     */
    var addCard = function (deck, card) {
      var newQuantity = 1;

      // If a copy of the card is in the deck already, increment the new quantity.
      if (deck.card[card.code]) {
        newQuantity = deck.card[card.code].quantity + 1;
      }

      if (newQuantity <= 3) {
        deck.card[card.code] = {
          details: card,
          quantity: newQuantity
        };
        deck.totalCards = this.fetchCardCount(deck);

        if (card.agendapoints) {
          deck.agendaPoints = this.fetchAgendaPoints(deck);
        }
      }

      return deck;
    };

    /**
     * Remove a single copy of a card from a deck.
     * @param deck
     *   The deck to modify.
     * @param card
     *   The card to be removed.
     * @returns {deck}
     *   The deck after the cards have been removed (or unmodified if no copies of the card were used).
     */
    var removeCard = function (deck, card) {
      var newQuantity;

      // Jack out if the deck doesn't have this card.
      if (!deck.card[card.code]) {
        return deck;
      }

      newQuantity = Math.max(deck.card[card.code].quantity - 1, 0);

      if (newQuantity) {
        // If there are still copies of the card left, update the deck.
        deck.card[card.code] = {
          details: card,
          quantity: newQuantity
        };
      } else {
        // If there would be no copies of the card left, remove the card object entirely.
        delete deck.card[card.code];
      }

      deck.totalCards = this.fetchCardCount(deck);

      if (card.agendapoints) {
        deck.agendaPoints = this.fetchAgendaPoints(deck);
      }

      return deck;
    };

    /**
     * Calculates the card total for a deck.
     * @param deck
     * @returns {*}
     */
    var fetchCardCount = function(deck) {
      var usedCards = Object.keys(deck.card),
        quantity = 0;

      usedCards.forEach(function(currentCard){
        quantity += deck.card[currentCard].quantity;
      });

      return quantity;
    };

    /**
     * Fetches the agenda points used by this deck.
     * @param deck
     *  The deck to extract agenda points from.
     * @returns {*}
     */
    var fetchAgendaPoints = function(deck) {
      var agendaPoints = 0;
      var usedCards = Object.keys(deck.card);

      usedCards.forEach(function(currentCard) {
        if (deck.card[currentCard].details.type === 'Agenda') {
          agendaPoints += deck.card[currentCard].details.agendapoints * deck.card[currentCard].quantity;
        }
      });

      return agendaPoints;
    };

    /**
     * Fetches the range of required agenda points for a given deck.
     * @param deck
     *  The deck to get the agenda points for.
     * @returns {*[]}
     *  Array - [minimum required points, maximum required points].
     */
    var fetchRequiredAgendaPoints = function(deck) {
      var minimumAgendaPoints = 18;

      // TODO: Need to pull in the minimum cards from used identity i.e. for NBN:TWIY
      if (deck.totalCards > 39) {
        // Caution: MATH - https://www.youtube.com/watch?v=gENVB6tjq_M
        minimumAgendaPoints += (Math.floor((deck.totalCards - 40) / 5) * 2);
      }

      return [minimumAgendaPoints, minimumAgendaPoints + 1];
    };

    return {
      saveDeck: saveDeck,
      revertDeck: revertDeck,
      addCard: addCard,
      removeCard: removeCard,
      fetchCardCount: fetchCardCount,
      fetchAgendaPoints: fetchAgendaPoints,
      fetchRequiredAgendaPoints: fetchRequiredAgendaPoints
    };
  }]);
})();

(function() {
  'use strict';
  angular.module('dataDealer').controller('DeckEditorController', ['$routeParams', '$location', 'AllCardsService', 'UserDecksService', 'Deck', function($routeParams, $location, AllCardsService, UserDecksService, Deck) {
    var self = this;

    self.deckStatus = UserDecksService.buildDeck($routeParams.deckId);

    self.isDeckSaved = true;

    self.orderProp = 'faction';

    self.reverse = false;

    /**
     * Saves a deck, optionally redirecting to the edit page for that deck.
     *
     * @param {bool} andEdit
     *  If true, redirects to the edit page for the deck.
     */
    self.saveDeck = function(andEdit) {
      self.deckStatus = Deck.saveDeck(self.deckStatus);
      if (andEdit) {
        $location.path('/deck/edit/' + self.deckStatus.id);
        return;
      }

      self.isDeckSaved = true;
    };

    self.revertDeck = function() {
      self.deckStatus = Deck.revertDeck(self.deckStatus);
      self.isDeckSaved = true;
    };

    self.addCard = function(card) {
      self.deckStatus = Deck.addCard(self.deckStatus, card);
      self.isDeckSaved = false;
    };

    self.removeCard = function(card) {
      self.deckStatus = Deck.removeCard(self.deckStatus, card);
      self.isDeckSaved = false;
    };

    self.updateAgendaPoints = function(agendaPoints, isDecreased) {
      self.deckStatus.agendaPoints = Deck.updateAgendaPoints(self.deckStatus, agendaPoints, isDecreased);
    };

    self.getRequiredAgendaPoints = function() {
      var requiredAgendaPoints = Deck.fetchRequiredAgendaPoints(self.deckStatus);

      self.deckStatus.requiredAgendaPoints = requiredAgendaPoints;
    };

    self.setIdentity = function(identity) {
      self.deckStatus.identity = identity;
      self.searchCriteria.side = self.deckStatus.identity.side;
    };

    self.allCards = AllCardsService.allCards;

    self.searchCriteria = {
      type: '!Identity'
    };

    // If identity exists on controller initialisation, ensure that identity
    // is set properly.
    if (self.deckStatus.identity) {
      self.setIdentity(self.deckStatus.identity);
    }
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

(function() {
  'use strict';

  /**
   * The cardOrder directive allows you to specify the
   * type & direction of sorting used for views used
   * by DeckEditorController.
   *
   * Apply it by setting the attribute 'card-order' to the type
   * of ordering you require (e.g. 'title'). When you click on
   * the element with this attribute, ordering will be applied
   * against the value of card-order if it wasn't already. If
   * ordering was already using this value, the direction of
   * the order will be reversed.
   *
   * @requires DeckEditorController as DeckEditor
   * @restrict A
   * @returns {{restrict: string, link: Function}}
   */
  var cardOrder = function() {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        elem.bind('click', function () {
          if (scope.DeckEditor.orderProp === attrs.cardOrder) {
            scope.$apply(
              scope.DeckEditor.reverse = !scope.DeckEditor.reverse
            );
          } else {
            scope.$apply(function () {
              scope.DeckEditor.orderProp = attrs.cardOrder;
              scope.DeckEditor.reverse = false;
            });
          }
        });
      }
    };
  };

  angular.module('dataDealer').directive('cardOrder', cardOrder);
})();
