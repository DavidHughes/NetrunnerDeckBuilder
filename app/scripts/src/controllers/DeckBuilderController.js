(function($, window, deckBuilder, undefined) {
  'use strict';
  deckBuilder.controller('DeckBuilderController', ['$scope', '$http', 'AllCardsService', function($scope, $http, AllCardsService) {
    AllCardsService.promise.success(function(data) {
      $scope.allCards = data.netrunnerCards;
    });

    $scope.orderProp = 'faction';

    $scope.addCard = function(card) {
      var newQuantity = 1;

      if ($scope.deckStatus[card.code]) {
        newQuantity = $scope.deckStatus[card.code].quantity + 1;
      }

      if (newQuantity > 3) {
        newQuantity = 3;
      }

      $scope.deckStatus[card.code] = {
        card: card,
        quantity: newQuantity
      };
    };

    $scope.removeCard = function(card) {
      var newQuantity = 0;

      if ($scope.deckStatus[card.code]) {
        newQuantity = $scope.deckStatus[card.code].quantity - 1;
      }

      if (newQuantity < 0) {
        newQuantity = 0;
      }

      $scope.deckStatus[card.code] = {
        card: card,
        quantity: newQuantity
      };
    };

     /**
      * card id:
      * - card object
      * - quantity
      */
    $scope.deckStatus = {};
  }]);
})(jQuery, this, window.deckBuilder);
