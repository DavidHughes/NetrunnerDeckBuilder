/*global describe, beforeEach, module, inject, it, expect*/
describe('directive: card-order', function() {
  'use strict';
  var element, scope;
  const defaultType = 'title';

  beforeEach(module('dataDealer'));

  beforeEach(inject(function($rootScope, $compile, $controller) {
    scope = $rootScope.$new();

    element = '<div card-order="{{ type }}"></div>';

    scope.DeckEditor = $controller('DeckEditorController');

    scope.type = defaultType;
    element = $compile(element)(scope);
    scope.$digest();
  }));

  it('should update the type of card sorting on click', function() {
    expect(scope.DeckEditor.orderProp).to.equal('faction');
    element.click();
    expect(scope.DeckEditor.orderProp).to.equal(defaultType);
  });
});
