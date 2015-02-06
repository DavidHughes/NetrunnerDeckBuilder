(function($, window, undefined) {
  'use strict';
  window.deckBuilder.controller('DeckBuilderController', ['$scope', '$http', function($scope, $http) {
    $http({
        method: 'GET',
        url: 'data/allCards.json'
    }).success(function(data) {
        $scope.allCards = data.netrunnerCards;
    });

    $scope.orderProp = 'faction';

    $scope.addCard = function(card) {
      card.quantity = card.quantity ? card.quantity++ : 1;
      console.log(card);
    };

    $scope.deckStatus = {};
  }]);
})(jQuery, this);
