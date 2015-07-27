(function() {
  'use strict';
  angular.module('dataDealer').controller('DeckEditorController', ['$scope', '$routeParams', '$filter', 'AllCardsService', 'UserDecksService', 'Deck', function($scope, $routeParams, $filter, AllCardsService, UserDecksService, Deck) {
    $scope.deckStatus = UserDecksService.buildDeck($routeParams.deckId);

    $scope.orderProp = 'faction';

    $scope.saveDeck = function() {
      Deck.saveDeck($scope.deckStatus);
      $scope.isDeckSaved = false;
    };

    $scope.isDeckSaved = true;

    $scope.addCard = function(card) {
      $scope.deckStatus = Deck.addCard($scope.deckStatus, card);
      $scope.isDeckSaved = false;
    };

    $scope.removeCard = function(card) {
      Deck.removeCard($scope.deckStatus, card);
      $scope.isDeckSaved = false;
    };

    $scope.updateCardCount = function() {
      var totalCards = Deck.fetchCardCount($scope.deckStatus);

      $scope.deckStatus.totalCards = totalCards;
      $scope.deckStatus.requiredAgendaPoints = $scope.getRequiredAgendaPoints($scope.deckStatus);

      $scope.isDeckSaved = false;
    };

    $scope.updateAgendaPoints = function(agendaPoints, isDecreased) {
      $scope.deckStatus.agendaPoints = Deck.updateAgendaPoints($scope.deckStatus, agendaPoints, isDecreased);
    };

    $scope.getRequiredAgendaPoints = function() {
      var requiredAgendaPoints = Deck.fetchRequiredAgendaPoints($scope.deckStatus);

      $scope.deckStatus.requiredAgendaPoints = requiredAgendaPoints;
    };

    /**
     * @deprecated
     */
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

    // Load in all the cards.
    AllCardsService.getAllCards(function(data) {
      var searchResults;
      $scope.allCards = data.netrunnerCards;

      if ($routeParams.identityId) {
        searchResults = $filter('filter')($scope.allCards, { code: $routeParams.identityId }, true);
        $scope.deckStatus.identity = searchResults.length ? searchResults[0] : null;
      }
    });
  }]);
})();
