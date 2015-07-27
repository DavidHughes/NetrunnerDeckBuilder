(function() {
  'use strict';
  angular.module('dataDealer').controller('DeckEditorController', ['$routeParams', '$filter', 'AllCardsService', 'UserDecksService', 'Deck', function($routeParams, $filter, AllCardsService, UserDecksService, Deck) {
    var self = this;

    self.deckStatus = UserDecksService.buildDeck($routeParams.deckId);

    self.isDeckSaved = true;

    self.orderProp = 'faction';

    self.saveDeck = function() {
      Deck.saveDeck(self.deckStatus);
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
      Deck.removeCard(self.deckStatus, card);
      self.isDeckSaved = false;
    };

    self.updateCardCount = function() {
      var totalCards = Deck.fetchCardCount(self.deckStatus);

      self.deckStatus.totalCards = totalCards;
      self.deckStatus.requiredAgendaPoints = self.getRequiredAgendaPoints(self.deckStatus);
    };

    self.updateAgendaPoints = function(agendaPoints, isDecreased) {
      self.deckStatus.agendaPoints = Deck.updateAgendaPoints(self.deckStatus, agendaPoints, isDecreased);
    };

    self.getRequiredAgendaPoints = function() {
      var requiredAgendaPoints = Deck.fetchRequiredAgendaPoints(self.deckStatus);

      self.deckStatus.requiredAgendaPoints = requiredAgendaPoints;
    };

    /**
     * @deprecated
     */
    self.fetchRelevantIdentities = function(side, callback) {
      switch (side) {
        case 'runner':
        AllCardsService.getRunnerIdentities(function(data) {
          callback(data);
        });
        break;
        case 'corp':
        AllCardsService.getCorpIdentities(function(data) {
          callback(data);
        });
        break;
        default:
        AllCardsService.getIdentities(function(data) {
          callback(data);
        });
      }
    };

    self.allCards = AllCardsService.allCards;
  }]);
})();
