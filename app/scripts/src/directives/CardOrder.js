(function() {
  'use strict';

  angular.module('dataDealer').directive('cardOrder', function() {
    return {
      restrict: 'A',
      link: function(scope, elem, attrs) {
        elem.bind('click', function () {
          if (scope.DeckEditor.orderProp === attrs.cardOrder) {
            scope.$apply(
              scope.DeckEditor.reverse = !scope.DeckEditor.reverse
            );
          } else {
            scope.$apply(function() {
              scope.DeckEditor.orderProp = attrs.cardOrder;
              scope.DeckEditor.reverse = false;
            });
          }
        });
      }
    };
  });
})();
