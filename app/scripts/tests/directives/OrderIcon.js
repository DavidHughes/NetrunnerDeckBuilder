/*global describe, beforeEach, module, inject, it, expect*/
describe('directive: order-icon', function() {
  'use strict';
  var element, elementAlternate, scope;
  const orderType = 'type';

  beforeEach(module('dataDealer'));

  beforeEach(inject(function($rootScope, $compile, $controller) {
    scope = $rootScope.$new();
    scope.DeckEditor = $controller('DeckEditorController');

    element = '<order-icon order-on="' + orderType + '"></order-icon>';
    element = $compile(element)(scope);

    elementAlternate = '<order-icon order-on="' + scope.DeckEditor.orderProp + '"></order-icon>';
    elementAlternate = $compile(elementAlternate)(scope);

    scope.$digest();
  }));

  it('should have no classes if ordering is not on the order-on attribute', function() {
    var classList = element.find('span').attr('class');
    classList = ('' + classList).split(' ');

    expect(classList).to.not.contain('glyphicon');
    expect(classList).to.not.contain('glyphicon-chevron-up');
    expect(classList).to.not.contain('glyphicon-chevron-down');
  });

  it('should show a down arrow if ordering is ascending against the order-on attribute', function() {
    scope.$apply(function() {
      scope.DeckEditor.orderProp = orderType;
      scope.DeckEditor.reverse = false;
    });

    var classList = element.find('span').attr('class');
    classList = (classList ? classList + '' : '').split(' ');

    expect(classList).to.contain('glyphicon');
    expect(classList).to.contain('glyphicon-chevron-down');

    expect(classList).to.not.contain('glyphicon-chevron-up');
  });

  it('should show an up arrow if ordering is descending against the order-on attribute', function() {
    scope.$apply(function() {
      scope.DeckEditor.orderProp = orderType;
      scope.DeckEditor.reverse = true;
    });

    var classList = element.find('span').attr('class');
    classList = (classList ? classList + '' : '').split(' ');

    expect(classList).to.contain('glyphicon');
    expect(classList).to.contain('glyphicon-chevron-up');

    expect(classList).to.not.contain('glyphicon-chevron-down');
  });

  it('should maintain separate scopes', function() {
    var classList = elementAlternate.find('span').attr('class');
    classList = (classList ? classList + '' : '').split(' ');

    // In case this tests purpose is unclear, note that this is testing
    // a different element to the others.
    expect(classList).to.contain('glyphicon');
    expect(classList).to.contain('glyphicon-chevron-down');
  });
});
