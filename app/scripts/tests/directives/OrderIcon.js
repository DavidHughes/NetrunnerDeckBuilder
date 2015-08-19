/*global describe, beforeEach, module, inject, it, expect*/
describe('directive: order-icon', function() {
  'use strict';
  var element, scope;
  const orderType = 'type';

  beforeEach(module('dataDealer'));

  beforeEach(inject(function($rootScope, $compile, $controller) {
    scope = $rootScope.$new();

    element = '<order-icon order-on="{{ type }}"></order-icon>';

    scope.DeckEditor = $controller('DeckEditorController');

    scope.type = orderType;
    element = $compile(element)(scope);
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
});
