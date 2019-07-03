const _ = require('lodash');
const expect = require('chai').expect;
const proxyquire = require('proxyquire');

describe('Provider', () => {
  const fakeProvider = name => ({
    name,
    label: name,
    videoIdExtractRegExps: [
      new RegExp(`${name}:(.*)`, 'i'),
      new RegExp(`${name}#(.*)`, 'i'),
    ],
    getThumbnailUrl: () => Promise.resolve(`${name}:thumbnailUrl`),
    getTitle: () => Promise.resolve(`${name}:title`),
    getDescription: () => Promise.resolve(`${name}:description`),
    getDuration: () => Promise.resolve(55),
    getPlayerUrl: () => Promise.resolve(`${name}:playerUrl`),
    getEmbedCode: () => Promise.resolve(`${name}:embedCode`),
  });

  const provider = proxyquire('../src/provider', {
    './providers/dailymotion': fakeProvider('dailymotion'),
    './providers/youtube': fakeProvider('youtube'),
    './providers/ina': fakeProvider('ina'),
    './providers/digiteka': fakeProvider('digiteka'),
  });

  describe('#extract video', () => {
    it('should succeed (first accepted pattern)', () => {
      expect(
        provider.extractVideoId(fakeProvider('dailymotion'), 'dailymotion:10')
      ).to.equal('10');
    });

    it('should succeed (second accepted pattern)', () => {
      expect(
        provider.extractVideoId(fakeProvider('dailymotion'), 'dailymotion#10')
      ).to.equal('10');
    });

    it('should fail with unexpected url pattern', () => {
      expect(
        provider.extractVideoId(fakeProvider('dailymotion'), 'dailymotion+10')
      ).to.be.null;
    });
  });

  describe('#get provider from url', () => {
    it('should find from dailymotion url', () => {
      const result = provider.getProviderFromUrl('dailymotion:10');

      expect(result.name).to.eql(fakeProvider('dailymotion').name);
      expect(result.label).to.eql(fakeProvider('dailymotion').label);
    });

    it('should find from youtube url', () => {
      const result = provider.getProviderFromUrl('youtube:10');

      expect(result.name).to.eql(fakeProvider('youtube').name);
      expect(result.label).to.eql(fakeProvider('youtube').label);
    });

    it('should not find from snooze url', () => {
      expect(provider.getProviderFromUrl('snooze:10')).to.be.undefined;
    });
  });

  describe('#get video from id', () => {
    it('should return entire dailymotion video from url', done => {
      provider
        .getVideoFromId(fakeProvider('dailymotion'), '10')
        .then(video => {
          expect(video).to.eql({
            title: 'dailymotion:title',
            description: 'dailymotion:description',
            duration: '00:55',
            thumbnailUrl: 'dailymotion:thumbnailUrl',
            playerUrl: 'dailymotion:playerUrl',
            metadata: { embedCode: 'dailymotion:embedCode' },
            provider: 'dailymotion',
            providerVideoId: '10',
          });

          done();
        })
        .catch(done);
    });
  });

  describe('#get video from url', () => {
    it('should return entire dailymotion video from url', done => {
      provider
        .getVideoFromUrl('dailymotion:10')
        .then(video => {
          expect(video).to.eql({
            title: 'dailymotion:title',
            description: 'dailymotion:description',
            duration: '00:55',
            thumbnailUrl: 'dailymotion:thumbnailUrl',
            playerUrl: 'dailymotion:playerUrl',
            metadata: { embedCode: 'dailymotion:embedCode' },
            provider: 'dailymotion',
            providerVideoId: '10',
          });

          done();
        })
        .catch(done);
    });

    it('should return entire youtube video from url', done => {
      provider
        .getVideoFromUrl('youtube:10')
        .then(video => {
          expect(video).to.eql({
            title: 'youtube:title',
            description: 'youtube:description',
            duration: '00:55',
            thumbnailUrl: 'youtube:thumbnailUrl',
            playerUrl: 'youtube:playerUrl',
            metadata: { embedCode: 'youtube:embedCode' },
            provider: 'youtube',
            providerVideoId: '10',
          });

          done();
        })
        .catch(done);
    });

    it('should return null from a snooze url', done => {
      provider.getVideoFromUrl('snooze:10').catch(err => {
        expect(err.message).to.equal('Url pattern is not recognized');
        done();
      });
    });
  });

  describe('#get a provider from name', () => {
    it('should return a valid provider', () => {
      const dailymotion = provider.getProviderFromName('dailymotion');
      expect(dailymotion.name).to.equal('dailymotion');
      expect(dailymotion.label).to.equal('dailymotion');
    });
  });

  describe('#get supported providers', () => {
    it('should return a list', () => {
      expect(provider.getSupportedProviders()).to.eql([
        'dailymotion',
        'ina',
        'youtube',
        'digiteka',
        'facebook',
      ]);
    });
  });

  describe('#extend a provider', () => {
    it('should extend youtube provider', () => {
      provider.extendProvider('youtube', {
        apiKey: 'myKey',
        fakeFunc: _.noop,
      });

      const youtubeProvider = provider.getProviderFromUrl('youtube:10');

      expect(youtubeProvider.apiKey).to.equal('myKey');
      expect(typeof youtubeProvider.fakeFunc).to.equal('function');
    });
  });

  describe('#extend providers', () => {
    it('should extend all providers', () => {
      provider.extendProviders({
        headers: {
          'Access-Control-Allow-Headers': 'x-app-uuid,x-huit-version',
          'Access-Control-Allow-Methods': 'GET',
          'x-huit-version': undefined,
          'x-app-uuid': undefined,
        },
      });

      expect(provider.getProviderFromName('dailymotion').headers).to.eql({
        'Access-Control-Allow-Headers': 'x-app-uuid,x-huit-version',
        'Access-Control-Allow-Methods': 'GET',
        'x-huit-version': undefined,
        'x-app-uuid': undefined,
      });

      expect(provider.getProviderFromName('youtube').headers).to.eql({
        'Access-Control-Allow-Headers': 'x-app-uuid,x-huit-version',
        'Access-Control-Allow-Methods': 'GET',
        'x-huit-version': undefined,
        'x-app-uuid': undefined,
      });
    });
  });
});
