(function() {
  'use strict';
  angular.module('deckBuilder').controller('DeckManagerController', ['$scope', 'UserDecksService', function($scope, UserDecksService) {
    $scope.allDecks = UserDecksService.getDecks();
  }]);
})();
