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
      }
    };
  }]);
})(jQuery, this, window.deckBuilder);
