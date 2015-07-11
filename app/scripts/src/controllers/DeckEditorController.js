(function() {
  'use strict';
  angular.module('dataDealer').controller('DeckEditorController', ['$scope', '$routeParams', '$filter', 'AllCardsService', 'UserDecksService', function($scope, $routeParams, $filter, AllCardsService, UserDecksService) {
    $scope.deckStatus = UserDecksService.buildDeck($routeParams.deckId);

    AllCardsService.getAllCards(function(data) {
      var searchResults;
      $scope.allCards = data.netrunnerCards;

      if ($routeParams.identityId) {
        searchResults = $filter('filter')($scope.allCards, { code: $routeParams.identityId }, true);
        $scope.deckStatus.identity = searchResults.length ? searchResults[0] : null;
      }
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
      $scope.deckStatus.requiredAgendaPoints = $scope.getRequiredAgendaPoints($scope.deckStatus);

      $scope.isDeckSaved = false;
    };

    $scope.updateAgendaPoints = function(agendaPoints, isDecreased) {
      if (isDecreased) {
        $scope.deckStatus.agendaPoints -= agendaPoints;
      } else {
        $scope.deckStatus.agendaPoints += agendaPoints;
      }
    };

    $scope.getRequiredAgendaPoints = function() {
      var minimumAgendaPoints = 18;

      // TODO: Need to pull in the minimum cards from used identity i.e. for NBN:TWIY
      if ($scope.deckStatus.totalCards > 39) {
        // Caution: MATH - https://www.youtube.com/watch?v=gENVB6tjq_M
        minimumAgendaPoints += (Math.floor(($scope.deckStatus.totalCards - 40) / 5) * 2);
      }

      $scope.deckStatus.requiredAgendaPoints = [minimumAgendaPoints, minimumAgendaPoints + 1];
    };

    $scope.fetchRelevantIdentities = function(side, callback) {
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
  }]);
})();
