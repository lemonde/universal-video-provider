const _ = require('lodash');
const fetch = require('../fetch');

const headers = {
  'X-Huit-Version': undefined,
  'X-App-Uuid': undefined
};

module.exports = {
  name: 'dailymotion',
  label: 'Dailymotion',
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
    /^(?:https?:)?\/\/dai\.ly\/([^?_&#]+)/i
  ],

  getThumbnailUrl: videoId => (
    new Promise(resolve => resolve(`//www.dailymotion.com/thumbnail/video/${videoId}`))
  ),

  getTitle: videoId => (
    fetch(`https://api.dailymotion.com/video/${videoId}?fields=title`, { method: 'GET', headers })
    .then(result => _.get(result, 'data.title'))
  ),

  getDescription: videoId => (
    fetch(`https://api.dailymotion.com/video/${videoId}?fields=description`, { method: 'GET', headers })
    .then(result => _.get(result, 'data.description'))
  ),

  getDuration: videoId => (
    fetch(`https://api.dailymotion.com/video/${videoId}?fields=duration`, { method: 'GET', headers })
    .then(result => _.get(result, 'data.duration'))
  ),

  getPlayerUrl: videoId => (
    new Promise(resolve => resolve(`//www.dailymotion.com/embed/video/${videoId}`))
  )
};
