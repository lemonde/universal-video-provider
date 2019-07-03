const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const fixtures = require('../fixtures/digiteka');

describe('Digiteka provider', () => {
  let digiteka;

  describe('#fetch', () => {
    const data = fixtures.fetch;

    before(() => {
      digiteka = proxyquire('../../src/providers/digiteka', {
        '../fetch': sinon.stub().returns(Promise.resolve({ json: () => data })),
      });
    });

    it('should extract video id from ultimedia url (1)', () => {
      expect(
        digiteka.videoIdExtractRegExps[0].exec(
          'http://www.ultimedia.com/default/index/videogeneric/id/5ss8kq'
        )[1]
      ).to.equal('5ss8kq');
    });

    it('should extract video id from digiteka url (2)', () => {
      expect(
        digiteka.videoIdExtractRegExps[1].exec(
          'http://www.digiteka.net/default/index/videogeneric/id/550sru'
        )[1]
      ).to.equal('550sru');
    });

    it('should extract video id from digiteka url (3)', () => {
      expect(
        digiteka.videoIdExtractRegExps[2].exec(
          'http://www.ultimedia.com/deliver/generic/iframe/mdtk/01637594/zone/34/src/550sru'
        )[1]
      ).to.equal('550sru');
    });

    it('should get thumbnail url', done => {
      digiteka
        .getThumbnailUrl('8f3q8q')
        .then(thumbnailUrl => {
          expect(thumbnailUrl).to.equal(
            '//medialb.ultimedia.com/multi/35fzl/8f3q8q-L.jpg'
          );
          done();
        })
        .catch(done);
    });

    it('should get title', done => {
      digiteka
        .getTitle('8f3q8q')
        .then(title => {
          expect(title).to.equal('Syrie : carnage après un attentat-suicide');
          done();
        })
        .catch(done);
    });

    it('should get description', done => {
      digiteka
        .getDescription('8f3q8q')
        .then(description => {
          expect(description).to.equal(
            "C’est l'une des attaques les plus meurtrières en six ans de guerre en Syrie."
          );
          done();
        })
        .catch(done);
    });

    it('should get duration', done => {
      digiteka
        .getDuration('8f3q8q')
        .then(duration => {
          expect(duration).to.equal('49');
          done();
        })
        .catch(done);
    });

    it('should get playeur url', done => {
      digiteka
        .getPlayerUrl('8f3q8q')
        .then(playerUrl => {
          expect(playerUrl).to.equal(
            '//www.ultimedia.com/deliver/generic/iframe/mdtk/01637594/zone/34/src/8f3q8q'
          );
          done();
        })
        .catch(done);
    });

    it('should get embed code', done => {
      digiteka
        .getEmbedCode('8f3q8q')
        .then(embedCode => {
          expect(embedCode).to.equal(
            [
              '<iframe frameborder="0" scrolling="no" marginwidth="0" marginheight="0" hspace="0"',
              'vspace="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true"',
              'src="//www.ultimedia.com/deliver/generic/iframe/mdtk/null /src/8f3q8q/zone/1/showtitle/1"',
              '></iframe>',
            ].join(' ')
          );
          done();
        })
        .catch(done);
    });
  });

  describe('#search', () => {
    const data = fixtures.search;

    before(() => {
      digiteka = proxyquire('../../src/providers/digiteka', {
        '../fetch': sinon.stub().returns(Promise.resolve({ json: () => data })),
      });
    });

    it('should return a collection of videos', done => {
      digiteka
        .search('word to search')
        .then(results => {
          expect(results.length).to.equal(10);
          expect(results[0]).to.eql({
            description:
              "C’est l'une des attaques les plus meurtrières " +
              'en six ans de guerre en Syrie : samedi 15 avril, 126 personnes, ' +
              'dont 68 enfants, ont été tuées dans un attentat-suicide à Rachidine. ' +
              'Un kamikaze s’est fait exploser alors que Des centaines de familles ' +
              'venues de villages prorégime attendaient près de bus, sous la ' +
              'surveillance de combattants anti-Assad, d’être évacuées en zone ' +
              'loyaliste, dans le cadre d’un accord d’échange.',
            duration: '00:49',
            metadata: {
              embedCode: [
                '<iframe frameborder="0" scrolling="no" marginwidth="0" marginheight="0" hspace="0"',
                'vspace="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true"',
                'src="//www.ultimedia.com/deliver/generic/iframe/mdtk/null /src/8f3q8q/zone/1/showtitle/1"',
                '></iframe>',
              ].join(' '),
            },
            playerUrl:
              '//www.ultimedia.com/deliver/generic/iframe/mdtk/01637594/zone/34/src/8f3q8q',
            provider: 'digiteka',
            thumbnailUrl: '//medialb.ultimedia.com/multi/35fzl/8f3q8q-L.jpg',
            title:
              'Syrie : carnage après un attentat-suicide contre un convoi de civils évacués',
            providerVideoId: '8f3q8q',
          });
          done();
        })
        .catch(done);
    });
  });

  describe('#memoize', () => {
    const data = fixtures.fetch;
    const stubFetch = sinon
      .stub()
      .returns(Promise.resolve({ json: () => data }));

    before(() => {
      digiteka = proxyquire('../../src/providers/digiteka', {
        '../fetch': stubFetch,
      });
    });

    it('should reduce fetch calls', done => {
      Promise.all([
        digiteka.getTitle('fakeId'),
        digiteka.getDescription('fakeId'),
      ])
        .then(() => {
          expect(stubFetch.calledOnce).to.be.true;
          done();
        })
        .catch(done);
    });
  });
});
