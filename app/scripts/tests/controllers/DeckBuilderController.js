describe('DeckBuilderController', function() {
  var scope, newCard;

  beforeEach(function() {
    module('deckBuilder');
    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      $controller("DeckBuilderController", {
        $scope: scope,
        $routeParams: {
          deckId: 1
        },
        AllCardsService: {
          getAllCards: function() {}
        },
        UserDecksService: {
          buildDeck: function(id) {
            switch (id) {
              case 1:
              default:
                return {
                  card: {},
                  totalCards: 0,
                  agendaPoints: 0,
                  requiredAgendaPoints: [18, 19],
                  name: '',
                  id: null
                };
            }
          }
        }
      });
    });
    newCard = {
      "type": "Upgrade",
      "title": "Corporate Troubleshooter",
      "side": "Corp",
      "code": 1
    };
    newAgenda = {
      "type": "Agenda",
      "title": "AstroScript Pilot Program",
      "agendapoints": 2
    };
  });

  it('can add up to 3 copies of a single card to the current deck', function() {
    var count;
    for (count = 1; count < 4; count++) {
      scope.addCard(newCard);
      expect(scope.deckStatus.totalCards).to.equal(count);
      expect(scope.deckStatus.card[1].quantity).to.equal(count);
    }
  });

  it('can remove a card from the current deck', function() {
    var count;
    for (count = 0; count < 3; count++) {
      scope.addCard(newCard);
    }

    for (count = 2; count >= -2; count--) {
      scope.removeCard(newCard);
      if (count > 0) {
        expect(scope.deckStatus.totalCards).to.equal(count);
        expect(scope.deckStatus.card[1].quantity).to.equal(count);
      } else {
        expect(scope.deckStatus.totalCards).to.be.empty();
        expect(scope.deckStatus.card).to.be.empty();
      }
    }
  });

  it('monitors agenda points as cards are changed', function() {
    scope.addCard(newCard);
    expect(scope.deckStatus.agendaPoints).to.equal(0);

    scope.addCard(newAgenda);
    expect(scope.deckStatus.agendaPoints).to.equal(newAgenda.agendapoints);
    scope.addCard(newAgenda);
    expect(scope.deckStatus.agendaPoints).to.equal(newAgenda.agendapoints * 2);
    scope.removeCard(newAgenda);
    expect(scope.deckStatus.agendaPoints).to.equal(newAgenda.agendapoints);

    scope.removeCard(newCard);
    expect(scope.deckStatus.agendaPoints).to.equal(0);
  });
});
