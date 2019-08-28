const expect = require('chai').expect;
const formatter = require('../src/formatter');

describe('Formatter', () => {
  describe('#duration', () => {
    it('should return a long formatted time from sc', () => {
      expect(formatter.duration(4555)).to.equal('01:15:55');
    });

    it('should return a short formatted time from sc', () => {
      expect(formatter.duration(55)).to.equal('00:55');
    });
  });

  describe('#video', () => {
    it('should return a formatted video', () => {
      expect(
        formatter.video('digiteka', '123aze', {
          title: 'mytitle',
          description: 'mydescription',
          duration: '68',
          thumbnailUrl: 'mythumbnailUrl',
          playerUrl: 'myplayerUrl',
          embedCode: 'myembedCode',
          publishedDate: '2019-07-31T07:15:01.000Z',
        })
      ).to.eql({
        title: 'mytitle',
        description: 'mydescription',
        duration: '01:08',
        thumbnailUrl: 'mythumbnailUrl',
        playerUrl: 'myplayerUrl',
        metadata: { embedCode: 'myembedCode' },
        provider: 'digiteka',
        providerVideoId: '123aze',
        publishedDate: '2019-07-31T07:15:01.000Z',
      });
    });
  });
});
