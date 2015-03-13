function initialiseStorage() {
  'use strict';
  localStorage.setItem('allDecks', JSON.stringify({
    1: {
      card: {},
      totalCards: 0,
      agendaPoints: 0,
      requiredAgendaPoints: [18, 19],
      name: 'Blank Test Deck',
      id: 1
    }
  }));
}
initialiseStorage();

describe('DeckManagerController', function() {
  'use strict';
  var scope;
  beforeEach(function() {
    module('dataDealer');
    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller('DeckManagerController', {
        $scope: scope
      });
    });

    initialiseStorage();
  });

  it('can change the name of a deck', function() {
    var newName = 'Test Name Change';
    scope.setDeckName(1, newName);

    expect(scope.allDecks[1].name).to.equal(newName);

    scope.setDeckName(2, 'Deck does not exist');
    // Should not error - chai will automatically fail at this point.
  });
});
