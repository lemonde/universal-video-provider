const expect = require('chai').expect;
const dailymotion = require('../../src/providers')('dailymotion');

describe('Dailymotion provider regexp', () => {
  it('should parse standard url', () => {
    expect(dailymotion.videoIdExtractRegExps[0].exec(
      'http://www.dailymotion.com/video/x22i6cm_la-guerre-a-gaza-en-5-minutes_news'
    )[1]).to.equal('x22i6cm');
  });

  it('should parse standard url with extra path', () => {
    expect(dailymotion.videoIdExtractRegExps[1].exec(
      'http://www.dailymotion.com/toto/video/x22i6cm_la-guerre-a-gaza-en-5-minutes_news'
    )[1]).to.equal('x22i6cm');
  });

  it('should parse short url', () => {
    expect(dailymotion.videoIdExtractRegExps[2].exec(
      'http://dai.ly/x22i6cm'
    )[1]).to.equal('x22i6cm');
  });
});
