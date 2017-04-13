const expect = require('chai').expect;
const youtube = require('../../src/providers')('youtube');

describe('Youtube provider regexp', () => {
  it('should parse standard url', () => {
    expect(youtube.videoIdExtractRegExps[0].exec(
      'https://www.youtube.com/watch?v=ky6CRSBcf98'
    )[1]).to.equal('ky6CRSBcf98');
  });

  it('should parse direct url', () => {
    expect(youtube.videoIdExtractRegExps[1].exec(
      'http://www.youtube.com/v/ky6CRSBcf98'
    )[1]).to.equal('ky6CRSBcf98');
  });

  it('should parse embed url', () => {
    expect(youtube.videoIdExtractRegExps[2].exec(
      'http://www.youtube.com/embed/ky6CRSBcf98?rel=0'
    )[1]).to.equal('ky6CRSBcf98');
  });

  it('should parse short url', () => {
    expect(youtube.videoIdExtractRegExps[3].exec(
      'http://youtu.be/ky6CRSBcf98'
    )[1]).to.equal('ky6CRSBcf98');
  });
});
