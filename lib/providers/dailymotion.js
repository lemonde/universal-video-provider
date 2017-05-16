'use strict';

var _ = require('lodash');
var fetch = require('../fetch');

/**
 * Dailymotion api endpoints
 */

var fetchVideo = _.memoize(function (url) {
  return fetch(url, { headers: provider.headers }).then(function (res) {
    return res.json();
  });
});

var getUrl = function getUrl(videoId) {
  return '//www.dailymotion.com/embed/video/' + videoId;
};

var provider = {
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
  /^(?:https?:)?\/\/dai\.ly\/([^?_&#]+)/i],

  getThumbnailUrl: function getThumbnailUrl(videoId) {
    return new Promise(function (resolve) {
      return resolve('//www.dailymotion.com/thumbnail/video/' + videoId);
    });
  },

  getTitle: function getTitle(videoId) {
    return fetchVideo('https://api.dailymotion.com/video/' + videoId + '?fields=title').then(function (result) {
      return _.get(result, 'title');
    });
  },

  getDescription: function getDescription(videoId) {
    return fetchVideo('https://api.dailymotion.com/video/' + videoId + '?fields=description').then(function (result) {
      return _.get(result, 'description');
    });
  },

  getDuration: function getDuration(videoId) {
    return fetchVideo('https://api.dailymotion.com/video/' + videoId + '?fields=duration').then(function (result) {
      return _.get(result, 'duration');
    });
  },

  getPlayerUrl: function getPlayerUrl(videoId) {
    return new Promise(function (resolve) {
      return resolve(getUrl(videoId));
    });
  },

  getEmbedCode: function getEmbedCode(videoId) {
    return new Promise(function (resolve) {
      return resolve(_.compact(['<iframe src="' + getUrl(videoId) + '"', 'frameborder="0"', _.get(provider, 'embed.width') ? 'width="' + provider.embed.width + '"' : null, _.get(provider, 'embed.height') ? 'height="' + provider.embed.height + '"' : null, '></iframe>']).join(' '));
    });
  }
};

module.exports = provider;