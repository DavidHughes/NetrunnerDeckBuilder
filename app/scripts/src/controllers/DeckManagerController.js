(function($, window, deckBuilder, undefined) {
  'use strict';
  deckBuilder.controller('DeckManagerController', ['$scope', 'UserDecksService', function($scope, UserDecksService) {
    $scope.allDecks = UserDecksService.getDecks();
  }]);
})(jQuery, this, window.deckBuilder);
