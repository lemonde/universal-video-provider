'use strict';

var _ = require('lodash');
var fetch = require('../fetch');
var BASE_GRAPH_API_URL = 'https://graph.facebook.com/v2.9/';

/**
 * Graph Api v2.9
 */

var fetchVideo = _.memoize(function (url) {
  return fetch(url, { headers: provider.headers }).then(function (res) {
    return res.json();
  });
});

var provider = {
  name: 'facebook',
  label: 'Facebook',
  headers: {},
  pageAccessToken: null,
  videoIdExtractRegExps: [
  // standard url
  // ex. https://www.facebook.com/canalplus/videos/1441853042524556
  /^(?:https?:)?\/\/(?:www\.)?facebook\.com\/(?:[^_&#]+)\/videos\/(\d+)/i],

  getThumbnailUrl: function getThumbnailUrl(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=picture').then(function (result) {
      return _.get(result, 'picture');
    });
  },

  getTitle: function getTitle(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=title').then(function (result) {
      return _.get(result, 'title');
    });
  },

  getDescription: function getDescription(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=description').then(function (result) {
      return _.get(result, 'description');
    });
  },

  getDuration: function getDuration(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=length').then(function (result) {
      return _.get(result, 'length');
    });
  },

  getPlayerUrl: function getPlayerUrl(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=permalink_url').then(function (result) {
      return 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com' + result.permalink_url;
    });
  }

};

module.exports = provider;