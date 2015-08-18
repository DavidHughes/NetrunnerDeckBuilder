/*global describe, beforeEach, module, inject, it, expect*/
describe('DeckEditorController', function() {
  'use strict';
  var newCard, newAgenda, controller, routeParams, runnerId, corpId;

  beforeEach(function() {
    module('dataDealer');

    newCard = {
      'type': 'Upgrade',
      'title': 'Corporate Troubleshooter',
      'side': 'Corp',
      'code': 1
    };
    newAgenda = {
      'type': 'Agenda',
      'title': 'AstroScript Pilot Program',
      'agendapoints': 2
    };
    corpId = {
      type: 'Identity',
      name: 'NBN Test',
      side: 'Corp'
    };
    runnerId = {
      type: 'Identity',
      name: 'Anarch Test',
      side: 'Runner'
    };
    routeParams = {
      deckId: 1
    };

    inject(function($controller) {
      controller = $controller('DeckEditorController', {
        $routeParams: routeParams
      });
    });
  });

  it('can add up to 3 copies of a single card to the current deck', function() {
    var count;
    for (count = 1; count <= 4; count++) {
      controller.addCard(newCard);
      expect(controller.deckStatus.totalCards).to.equal(Math.min(count, 3));
      expect(controller.deckStatus.card[1].quantity).to.equal(Math.min(count, 3));
    }
  });

  it('can remove a card from the current deck', function() {
    var count;
    for (count = 0; count < 3; count++) {
      controller.addCard(newCard);
    }

    for (count = 2; count >= -2; count--) {
      controller.removeCard(newCard);
      if (count > 0) {
        expect(controller.deckStatus.totalCards).to.equal(count);
        expect(controller.deckStatus.card[1].quantity).to.equal(count);
      } else {
        expect(controller.deckStatus.totalCards).to.be.empty();
        expect(controller.deckStatus.card).to.be.empty();
      }
    }
  });

  it('monitors agenda points as cards are changed', function() {
    controller.addCard(newCard);
    expect(controller.deckStatus.agendaPoints).to.equal(0);

    controller.addCard(newAgenda);
    expect(controller.deckStatus.agendaPoints).to.equal(newAgenda.agendapoints);
    controller.addCard(newAgenda);
    expect(controller.deckStatus.agendaPoints).to.equal(newAgenda.agendapoints * 2);
    controller.removeCard(newAgenda);
    expect(controller.deckStatus.agendaPoints).to.equal(newAgenda.agendapoints);
    controller.removeCard(newAgenda);
    expect(controller.deckStatus.agendaPoints).to.equal(0);

    controller.removeCard(newCard);
    expect(controller.deckStatus.agendaPoints).to.equal(0);
  });

  it('shows only cards on the same side as the deck identity', function() {
    controller.setIdentity(corpId);
    expect(controller.searchCriteria.side).to.equal(corpId.side);
    controller.setIdentity(runnerId);
    expect(controller.searchCriteria.side).to.equal(runnerId.side);
  });
});
