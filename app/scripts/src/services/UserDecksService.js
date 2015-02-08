(function($, window, deckBuilder, undefined) {
  'use strict';

  deckBuilder.factory('UserDecksService', [function() {
    var allDecks = JSON.parse(localStorage.getItem('allDecks'));

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
