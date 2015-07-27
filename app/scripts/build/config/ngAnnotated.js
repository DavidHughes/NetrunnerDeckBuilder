(function() {
  'use strict';
  angular.module('dataDealer').value('CardsDatabase', 'data/allCards.json');
})();

(function() {
  'use strict';
  angular.module('dataDealer').config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
    $routeProvider
      .when('/', {
        controller: 'DeckManagerController',
        templateUrl: 'templates/deck-manager.html'
      }).
      when('/deck/edit/:deckId', {
        controller: 'DeckEditorController',
        templateUrl: 'templates/deck-editor.html',
        resolve: {
          AllCardsService: ['AllCardsService', function(AllCardsService) {
            return AllCardsService.getAllCards();
          }]
        }
      }).
      when('/deck/edit/from/:identityId', {
        controller: 'DeckEditorController',
        templateUrl: 'templates/deck-editor.html',
        resolve: {
          AllCardsService: ['AllCardsService', function(AllCardsService) {
            return AllCardsService.getAllCards();
          }]
        }
      }).
      when('/deck/new/', {
        controller: 'DeckEditorController',
        templateUrl: 'templates/deck-starter.html',
        resolve: {
          AllCardsService: ['AllCardsService', function(AllCardsService) {
            return AllCardsService.getAllCards();
          }]
        }
      }).
      otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(true);
  }]);
})();
