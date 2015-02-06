(function($, window, undefined) {
  'use strict';
  window.deckBuilder.controller('DeckBuilderController', ['$scope', '$http', function($scope, $http) {
    $http({
        method: 'GET',
        url: 'data/allCards.json'
    }).success(function(data) {
        $scope.allCards = data.netrunnerCards;
        console.log(data.netrunnerCards);
    });

    $scope.orderProp = 'faction';
  }]);
})(jQuery, this);
