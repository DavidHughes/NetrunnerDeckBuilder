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
