(function() {
  'use strict';

  /**
   * The cardOrder directive allows you to specify the
   * type & direction of sorting used for views used
   * by DeckEditorController.
   *
   * Apply it by setting the attribute 'card-order' to the type
   * of ordering you require (e.g. 'title'). When you click on
   * the element with this attribute, ordering will be applied
   * against the value of card-order if it wasn't already. If
   * ordering was already using this value, the direction of
   * the order will be reversed.
   *
   * @requires DeckEditorController as DeckEditor
   * @restrict A
   * @returns {{restrict: string, link: Function}}
   */
  var cardOrder = function() {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        elem.bind('click', function () {
          if (scope.DeckEditor.orderProp === attrs.cardOrder) {
            scope.$apply(
              scope.DeckEditor.reverse = !scope.DeckEditor.reverse
            );
          } else {
            scope.$apply(function () {
              scope.DeckEditor.orderProp = attrs.cardOrder;
              scope.DeckEditor.reverse = false;
            });
          }
        });
      }
    };
  };

  angular.module('dataDealer').directive('cardOrder', cardOrder);
})();
