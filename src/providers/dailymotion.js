const _ = require('lodash');
const fetch = require('../fetch');

/**
 * Dailymotion api endpoints
 */

const fetchVideo = _.memoize(url =>
  fetch(url, { headers: provider.headers }).then(res => res.json())
);

const getUrl = videoId => `//www.dailymotion.com/embed/video/${videoId}`;

const provider = {
  name: 'dailymotion',
  label: 'Dailymotion',
  headers: {},
  videoIdExtractRegExps: [
    // NOTE : behind the _ in the id, everything is discarded by dailymotion
    // standard url
    // ex. http://www.dailymotion.com/video/x22i6cm_la-guerre-a-gaza-en-5-minutes_news
    /^(?:https?:)?\/\/(?:www\.)?dailymotion\.com\/video\/([^?_&#]+)/i,
    // standard url with extra path
    // ex. http://www.dailymotion.com/toto/video/x22i6cm_la-guerre-a-gaza-en-5-minutes_news
    /^(?:https?:)?\/\/(?:www\.)?dailymotion\.com\/(?:[^_&#]+)\/video\/([^?_&#]+)/i,
    // short url
    // ex. http://dai.ly/x22i6cm
    /^(?:https?:)?\/\/dai\.ly\/([^?_&#]+)/i,
  ],

  getThumbnailUrl: videoId =>
    new Promise(resolve =>
      resolve(`//www.dailymotion.com/thumbnail/video/${videoId}`)
    ),

  getTitle: videoId =>
    fetchVideo(
      `https://api.dailymotion.com/video/${videoId}?fields=title`
    ).then(result => _.get(result, 'title')),

  getDescription: videoId =>
    fetchVideo(
      `https://api.dailymotion.com/video/${videoId}?fields=description`
    ).then(result => _.get(result, 'description')),

  getDuration: videoId =>
    fetchVideo(
      `https://api.dailymotion.com/video/${videoId}?fields=duration`
    ).then(result => _.get(result, 'duration')),

  getPublishedDate: videoId =>
    fetchVideo(
      `https://api.dailymotion.com/video/${videoId}?fields=created_time`
    ).then(result => _.get(result, 'created_time')),

  getPlayerUrl: videoId => new Promise(resolve => resolve(getUrl(videoId))),

  getEmbedCode: videoId =>
    new Promise(resolve =>
      resolve(
        _.compact([
          `<iframe src="${getUrl(videoId)}"`,
          'frameborder="0"',
          _.get(provider, 'embed.width')
            ? `width="${provider.embed.width}"`
            : null,
          _.get(provider, 'embed.height')
            ? `height="${provider.embed.height}"`
            : null,
          '></iframe>',
        ]).join(' ')
      )
    ),
};

module.exports = provider;
