const expect = require('chai').expect;
const facebook = require('../../src/providers/facebook');

describe('Facebook provider regexp', () => {
  it('should parse standard url', () => {
    expect(
      facebook.videoIdExtractRegExps[0].exec(
        'https://www.facebook.com/canalplus/videos/1441853042524556'
      )[1]
    ).to.equal('1441853042524556');
  });
});
