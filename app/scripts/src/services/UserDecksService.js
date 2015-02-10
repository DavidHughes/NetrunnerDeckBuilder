(function($, window, deckBuilder, undefined) {
  'use strict';

  deckBuilder.factory('UserDecksService', [function() {
    var allDecks = {};

    try {
      allDecks = JSON.parse(localStorage.getItem('allDecks'));
    } catch (SyntaxError e) {
      console.log("localStorage is corrupted. Probably needs to be cleared");
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
          return allDecks[id]
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
