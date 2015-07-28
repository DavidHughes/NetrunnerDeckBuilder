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
