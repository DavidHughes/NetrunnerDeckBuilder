(function() {
  'use strict';

  /**
   * The orderIcon directive will add a dynamic icon representing the current
   * state of ordering.
   *
   * When using <order-icon>, an attribute order-on must be set. This value will
   * be compared with DeckEditor.orderProp to determine whether an icon is
   * displayed. DeckEditor.reverse is also considered when evaluating which icon
   * to render.
   *
   * @requires DeckEditorController as DeckEditor
   * @restrict E
   * @returns {{restrict: string, link: Function}}
   */
  var orderIcon = function() {
    var fetchClasses = function(currentOrdering, watchedOrderingType) {
      var classes = '';
      if (currentOrdering.facet === watchedOrderingType) {
        classes = 'glyphicon';
        if (currentOrdering.reversed) {
          classes = classes + ' glyphicon-chevron-up';
        } else {
          classes = classes + ' glyphicon-chevron-down';
        }
      }

      return classes;
    };

    return {
      restrict: 'E',
      scope: true,
      link: function($scope, $element, $attr) {
        $scope.classes = fetchClasses({
          facet: $scope.DeckEditor.orderProp,
          reversed: $scope.DeckEditor.reverse
        }, $attr.orderOn);

        $scope.$watch(function($scope) {
          return {
            facet: $scope.DeckEditor.orderProp,
            reversed: $scope.DeckEditor.reverse
          };
        }, function(currentOrdering) {
          $scope.classes = fetchClasses(currentOrdering, $attr.orderOn);
        }, true);
      },
      template: '<span ng-class="classes"></span>'
    };
  };

  angular.module('dataDealer').directive('orderIcon', orderIcon);
})();
