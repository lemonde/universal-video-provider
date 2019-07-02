const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const fixtures = require('../fixtures/youtube');

describe('Youtube Provider', () => {
  let youtube;
  describe('#regexp', () => {
    before(() => {
      youtube = proxyquire('../../src/providers/youtube', {
        '../fetch': sinon.stub().returns(() => null),
      });
    });

    it('should parse standard url', () => {
      expect(
        youtube.videoIdExtractRegExps[0].exec(
          'https://www.youtube.com/watch?v=ky6CRSBcf98'
        )[1]
      ).to.equal('ky6CRSBcf98');
    });

    it('should parse direct url', () => {
      expect(
        youtube.videoIdExtractRegExps[1].exec(
          'http://www.youtube.com/v/ky6CRSBcf98'
        )[1]
      ).to.equal('ky6CRSBcf98');
    });

    it('should parse embed url', () => {
      expect(
        youtube.videoIdExtractRegExps[2].exec(
          'http://www.youtube.com/embed/ky6CRSBcf98?rel=0'
        )[1]
      ).to.equal('ky6CRSBcf98');
    });

    it('should parse short url', () => {
      expect(
        youtube.videoIdExtractRegExps[3].exec('http://youtu.be/ky6CRSBcf98')[1]
      ).to.equal('ky6CRSBcf98');
    });
  });

  describe('#search', () => {
    const searchData = fixtures.search;
    const { videoOne, videoTwo } = fixtures;

    before(() => {
      youtube = proxyquire('../../src/providers/youtube', {
        '../fetch': sinon
          .stub()
          .onFirstCall()
          .returns(Promise.resolve({ json: () => searchData }))
          .onSecondCall()
          .returns(Promise.resolve({ json: () => videoOne }))
          .onThirdCall()
          .returns(Promise.resolve({ json: () => videoTwo })),
      });
    });

    it('should return a collection of videos', done => {
      youtube
        .search('word to search')
        .then(results => {
          const { videos } = results;
          expect(results.nextPageToken).to.eql('CAUQAA');
          expect(videos.length).to.equal(2);
          const videoOneResult = videoOne.items[0];
          const videoTwoResult = videoTwo.items[0];
          expect(videos[0]).to.eql({
            description: videoOneResult.snippet.description,
            duration: '09:42',
            metadata: {
              embedCode: videoOneResult.player.embedHtml,
            },
            playerUrl: `//www.youtube.com/embed/${videoOneResult.id}`,
            provider: 'youtube',
            providerVideoId: videoOneResult.id,
            thumbnailUrl: videoOneResult.snippet.thumbnails.maxres.url,
            title: videoOneResult.snippet.title,
          });
          expect(videos[1]).to.eql({
            description: videoTwoResult.snippet.description,
            duration: '46:41',
            metadata: {
              embedCode: videoTwoResult.player.embedHtml,
            },
            playerUrl: `//www.youtube.com/embed/${videoTwoResult.id}`,
            provider: 'youtube',
            providerVideoId: videoTwoResult.id,
            thumbnailUrl: videoTwoResult.snippet.thumbnails.maxres.url,
            title: videoTwoResult.snippet.title,
          });
          done();
        })
        .catch(done);
    });
  });
});
