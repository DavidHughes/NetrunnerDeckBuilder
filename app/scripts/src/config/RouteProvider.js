(function() {
  'use strict';
  angular.module('dataDealer').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        controller: 'DeckManagerController',
        templateUrl: 'templates/deck-manager.html'
      }).
      when('/deck/edit/:deckId', {
        controller: 'DeckBuilderController',
        templateUrl: 'templates/deck-builder.html',
        resolve: {
          'AllCardsService': function(AllCardsService) {
            return AllCardsService;
          }
        }
      });

    $locationProvider.html5Mode(true);
  }]);
})();
