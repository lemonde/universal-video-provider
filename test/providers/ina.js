const path = require('path');
const fs = require('fs');
const expect = require('chai').expect;
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Ina provider', () => {
  let ina;

  before((done) => {
    fs.readFile(path.join(__dirname, '../fixtures/ina.xml'), (err, data) => {
      if (err) return done(err);
      ina = proxyquire('../../src/providers/ina', {
        '../fetch': sinon.stub().returns(Promise.resolve({ data }))
      });
      return done();
    });
  });

  it('should extract video id', () => {
    expect(ina.videoIdExtractRegExps[0].exec(
      'http://www.ina.fr/video/NA00001285844/monopoly-nantais-video.html'
    )[1]).to.equal('NA00001285844');
  });

  it('should get thumbnail url', (done) => {
    ina.getThumbnailUrl('NA00001285844')
    .then((thumbnailUrl) => {
      expect(thumbnailUrl).to.equal('//www.ina.fr/images_v2/320x240/NA00001285844.jpeg');
      done();
    })
    .catch(done);
  });

  it('should get title', (done) => {
    ina.getTitle('NA00001285844')
    .then((title) => {
      expect(title).to.equal('Laine et Haute Couture');
      done();
    })
    .catch(done);
  });

  it('should get description', (done) => {
    ina.getDescription('NA00001285844')
    .then((description) => {
      expect(description).to.equal('Présentation de modèles Haute Couture pour le printemps et l\'été.');
      done();
    })
    .catch(done);
  });

  it('should get duration', (done) => {
    ina.getDuration('NA00001285844')
    .then((duration) => {
      expect(duration).to.equal('290');
      done();
    })
    .catch(done);
  });

  it('should get playeur url', (done) => {
    ina.getPlayerUrl('NA00001285844')
    .then((playerUrl) => {
      expect(playerUrl).to.equal('//player.ina.fr/player/ticket/NA00001285844/1/1b0bd203fbcd702f9bc9b10ac3d0fc21/0/148db8');
      done();
    })
    .catch(done);
  });
});
