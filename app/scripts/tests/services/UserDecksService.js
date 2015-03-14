/*global describe, beforeEach, module, inject, it, expect, afterEach*/
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

describe('UserDecksService', function() {
  'use strict';
  var UserDecksService;

  beforeEach(function() {
    module('dataDealer');

    inject(function(_UserDecksService_) {
      UserDecksService = _UserDecksService_;
    });

    initialiseStorage();
  });

  afterEach(function() {
    localStorage.clear();
  });

  it('can fetch all decks from storage', function() {
    var decks = UserDecksService.getDecks();
    expect(Object.keys(decks).length).to.equal(1);
  });

  it('can save a deck to storage', function() {
    var newDeck = {
      card: {},
      totalCards: 0,
      agendaPoints: 0,
      requiredAgendaPoints: [18, 19],
      name: 'Blank Test Deck',
      id: 2
    }, savedDecks;

    UserDecksService.saveDeck(newDeck);
    savedDecks = UserDecksService.getDecks();

    expect(savedDecks[2]).to.deep.equal(newDeck);
  });
});
