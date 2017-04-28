const _ = require('lodash');
const fetch = require('../fetch');
const BASE_GRAPH_API_URL = 'https://graph.facebook.com/v2.9/';

/**
 * Graph Api v2.9
 */

const fetchVideo = _.memoize(
  (url) => fetch(url, { headers: provider.headers })
    .then(res => res.json())
);

const provider = {
  name: 'facebook',
  label: 'Facebook',
  headers: {},
  pageAccessToken: null,
  videoIdExtractRegExps: [
    // standard url
    // ex. https://www.facebook.com/canalplus/videos/1441853042524556
    /^(?:https?:)?\/\/(?:www\.)?facebook\.com\/(?:[^_&#]+)\/videos\/(\d+)/i,
  ],

  getThumbnailUrl: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=picture`)
      .then(result => _.get(result, 'picture'))
  ),

  getTitle: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=title`)
      .then(result => _.get(result, 'title'))
  ),

  getDescription: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=description`)
      .then(result => _.get(result, 'description'))
  ),

  getDuration: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=length`)
      .then(result => _.get(result, 'length'))
  ),

  getPlayerUrl: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=permalink_url`)
      .then(result => `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com${result.permalink_url}`)
  ),

};

module.exports = provider;
