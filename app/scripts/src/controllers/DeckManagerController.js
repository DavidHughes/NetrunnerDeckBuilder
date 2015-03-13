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
