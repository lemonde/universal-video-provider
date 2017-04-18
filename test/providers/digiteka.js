const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const _ = require('lodash');
const fixtures = require('../fixtures/digiteka');

describe('Digiteka provider', () => {
  let digiteka;

  describe('#fetch', () => {
    const data = fixtures.fetch;

    before(() => {
      digiteka = proxyquire('../../src/providers/digiteka', {
        '../fetch': sinon.stub().returns(Promise.resolve({ data }))
      });
    });

    it('should extract video id from ultimedia url', () => {
      expect(digiteka.videoIdExtractRegExps[0].exec(
        'http://www.ultimedia.com/default/index/videogeneric/id/5ss8kq'
      )[1]).to.equal('5ss8kq');
    });

    it('should extract video id from digiteka url', () => {
      expect(digiteka.videoIdExtractRegExps[1].exec(
        'http://www.digiteka.net/default/index/videogeneric/id/550sru'
      )[1]).to.equal('550sru');
    });

    it('should get thumbnail url', (done) => {
      digiteka.getThumbnailUrl('8f3q8q')
      .then((thumbnailUrl) => {
        expect(thumbnailUrl).to.equal('//medialb.ultimedia.com/multi/35fzl/8f3q8q-L.jpg');
        done();
      })
      .catch(done);
    });

    it('should get title', (done) => {
      digiteka.getTitle('8f3q8q')
      .then((title) => {
        expect(title).to.equal('Syrie : carnage après un attentat-suicide');
        done();
      })
      .catch(done);
    });

    it('should get description', (done) => {
      digiteka.getDescription('8f3q8q')
      .then((description) => {
        expect(description).to.equal(
          'C’est l\'une des attaques les plus meurtrières en six ans de guerre en Syrie.'
        );
        done();
      })
      .catch(done);
    });

    it('should get duration', (done) => {
      digiteka.getDuration('8f3q8q')
      .then((duration) => {
        expect(duration).to.equal('49');
        done();
      })
      .catch(done);
    });

    it('should get playeur url', (done) => {
      digiteka.getPlayerUrl('8f3q8q')
      .then((playerUrl) => {
        expect(playerUrl).to.equal(
          '//www.ultimedia.com/deliver/generic/iframe/mdtk/01637594/zone/34/src/8f3q8q'
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
        '../fetch': sinon.stub().returns(Promise.resolve({ data }))
      });
    });

    it('should return a collection of videos', (done) => {
      digiteka.search('word to search')
      .then((res) => {
        expect(_.get(res, 'data.nb_result')).to.equal(504);
        expect(_.get(res, 'data.results.length')).to.equal(10);
        done();
      })
      .catch(done);
    });
  });
});
