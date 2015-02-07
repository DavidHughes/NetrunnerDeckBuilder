(function($, window, deckBuilder, undefined) {
  'use strict';
  deckBuilder.controller('DeckBuilderController', ['$scope', '$http', 'AllCardsService', function($scope, $http, AllCardsService) {
    AllCardsService.promise.success(function(data) {
      $scope.allCards = data.netrunnerCards;
    });

    $scope.orderProp = 'faction';

    /**
     * Adds a card to the deckStatus object.
     *
     * If deckStatus already has an entry for the card, the quantity is increased.
     * If the quantity is at 3 already, there is no change.
     * @param card to be added
     * @return void
     */
    $scope.addCard = function(card) {
      var newQuantity = 1;

      if ($scope.deckStatus[card.code]) {
        newQuantity = $scope.deckStatus[card.code].quantity + 1;
      }

      if (newQuantity <= 3) {
        $scope.deckStatus[card.code] = {
          details: card,
          quantity: newQuantity
        };
      }
    };

    $scope.removeCard = function(card) {
      var newQuantity = 0;

      if ($scope.deckStatus[card.code]) {
        newQuantity = $scope.deckStatus[card.code].quantity - 1;
      }

      if (newQuantity < 0) {
        newQuantity = 0;
      }

      if ($scope.deckStatus[card.code]) {
        if (newQuantity) {
          $scope.deckStatus[card.code] = {
            details: card,
            quantity: newQuantity
          };
        } else {
          delete $scope.deckStatus[card.code];
        }
      }
    };

     /**
      * card id:
      * - card object
      * - quantity
      */
    $scope.deckStatus = {};
  }]);
})(jQuery, this, window.deckBuilder);
