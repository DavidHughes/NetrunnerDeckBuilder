'use strict';
var deckBuilder = angular.module('deckBuilder', []);

deckBuilder.controller('DeckBuilderCtrl', ['$scope', '$http', function($scope, $http) {
    $http({
        method: 'GET',
        url: 'data/allCards.json'
    }).success(function(data) {
        $scope.allCards = data.netrunnerCards;
        console.log(data.netrunnerCards);
    });

    $scope.orderProp = 'faction';
}]);
