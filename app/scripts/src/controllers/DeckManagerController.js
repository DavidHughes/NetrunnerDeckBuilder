(function() {
  'use strict';
  angular.module('deckBuilder').controller('DeckManagerController', ['$scope', 'UserDecksService', function($scope, UserDecksService) {
    $scope.allDecks = UserDecksService.getDecks();

    $scope.setDeckName = function(deckId, newName) {
      if ($scope.allDecks[deckId]) {
        $scope.allDecks[deckId].name = newName;
      }
    };
  }]);
})();
