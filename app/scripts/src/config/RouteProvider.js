(function($, window, deckBuilder, undefined) {
  'use strict';
  deckBuilder.config(['$routeProvider', function($routeProvider){
  $routeProvider
    .when('/', {
      controller: 'DeckManagerController',
      templateUrl: 'templates/deck-manager.html'
    }).
    when('/deck/edit/:deckId', {
      controller: 'DeckBuilderController',
      templateUrl: 'templates/deck-builder.html',
      resolve:{
        'AllCardsService': function(AllCardsService) {
          return AllCardsService.promise;
        }
      }
    });
  }]);
})(jQuery, this, window.deckBuilder);
