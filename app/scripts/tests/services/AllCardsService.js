/*global describe, beforeEach, module, inject, it, expect*/
describe('AllCardsService', function() {
  'use strict';
  var someCards = {
    'netrunnerCards': [
      {
        'type': 'Identity',
        'title': 'Noise: Hacker Extraordinaire',
        'side': 'Runner'
      },
      {
        'type': 'Identity',
        'title': 'Jinteki: Personal Evolution',
        'side': 'Corp'
      },
      {
        'type': 'Resource',
        'title': 'Aesop\'s Pawnshop',
        'side': 'Runner'
      },
      {
        'type': 'Upgrade',
        'title': 'Corporate Troubleshooter',
        'side': 'Corp'
      }
    ]
  }, httpBackend, mockCardsDatabase, AllCardsService;

  beforeEach(module('dataDealer'));
  beforeEach(inject(function(_AllCardsService_, $httpBackend, _CardsDatabase_) {
    AllCardsService = _AllCardsService_;
    mockCardsDatabase = _CardsDatabase_;

    httpBackend = $httpBackend;
    httpBackend.when('GET', mockCardsDatabase).respond(someCards);
  }));

  describe('Card fetching', function() {
    it('points to the correct card database', function() {
      expect(mockCardsDatabase).to.equal('data/allCards.json');
    });

    it('can retrieve all cards', function (done) {
      AllCardsService.getAllCards(function(data) {
        expect(data).to.deep.equal(someCards);
        done();
      });
      httpBackend.flush();
    });

    it('can retrieve all identities', function(done) {
      AllCardsService.getIdentities(function(data) {
        expect(data.netrunnerCards.length).to.equal(2);
        for (var i = 0; i < 2; i++) {
          expect(data.netrunnerCards[i].title).to.equal(someCards.netrunnerCards[i].title);
          expect(data.netrunnerCards[i].type).to.equal('Identity');
        }
        done();
      });
      httpBackend.flush();
    });

    it('can retrieve all runner identities', function(done) {
      AllCardsService.getRunnerIdentities(function(data) {
        expect(data.netrunnerCards.length).to.equal(1);
        expect(data.netrunnerCards[0].title).to.equal('Noise: Hacker Extraordinaire');
        done();
      });
      httpBackend.flush();
    });

    it('can retrieve all corp identities', function(done) {
      AllCardsService.getCorpIdentities(function(data) {
        expect(data.netrunnerCards.length).to.equal(1);
        expect(data.netrunnerCards[0].title).to.equal('Jinteki: Personal Evolution');
        done();
      });
      httpBackend.flush();
    });
  });
});
