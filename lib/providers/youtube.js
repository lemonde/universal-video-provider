'use strict';

var _ = require('lodash');
var fetch = require('../fetch');

/**
 * Url api v3
 */

var getUrl = function getUrl(videoId) {
  return '//www.youtube.com/embed/' + videoId;
};

var fetchUrl = function fetchUrl(videoId, part) {
  return 'https://www.googleapis.com/youtube/v3/videos?part=' + part + '&id=' + videoId + '&key=' + provider.apiKey;
};

var fetchVideo = _.memoize(function (videoId, part) {
  return fetch(fetchUrl(videoId, part), { headers: provider.headers }).then(function (res) {
    return res.json();
  });
});

/**
 * Convert duration ISO 8601 to seconds
 */
var convertDurationToSc = function convertDurationToSc(duration) {
  if (!duration) return 0;

  var parsed = duration.match(/PT([0-9]{1,2}H)?([0-9]{1,2}M)?([0-9]{1,2}S)?/).map(function (value) {
    return parseInt(value, 10) || 0;
  });
  // => [0,H,M,S]

  return parsed[1] * 3600 + parsed[2] * 60 + parsed[3];
};

var provider = {
  name: 'youtube',
  label: 'Youtube',
  headers: {},
  apiKey: null,
  videoIdExtractRegExps: [
  // standard url
  // ex. https://www.youtube.com/watch?v=ky6CRSBcf98
  /^(?:https?:)?\/\/(?:www\.)?youtube\.com\/.*?\?v=([^?&#/]+)/i,
  // direct url
  // ex. http://www.youtube.com/v/ky6CRSBcf98
  /^(?:https?:)?\/\/(?:www\.)?youtube\.com\/v\/([^?&#/]+)/i,
  // embed url
  // ex. http://www.youtube.com/v/ky6CRSBcf98
  /^(?:https?:)?\/\/(?:www\.)?youtube\.com\/embed\/([^?&#/]+)/i,
  // short url
  // ex. http://youtu.be/ky6CRSBcf98
  /^(?:https?:)?\/\/youtu\.be\/([^?&#/]+)/i],

  getThumbnailUrl: function getThumbnailUrl(videoId) {
    return new Promise(function (resolve) {
      return resolve('//img.youtube.com/vi/' + videoId + '/hqdefault.jpg');
    });
  },

  getTitle: function getTitle(videoId) {
    return fetchVideo(videoId, 'snippet').then(function (result) {
      return _.get(result, 'items.0.snippet.title');
    });
  },

  getDescription: function getDescription(videoId) {
    return fetchVideo(videoId, 'snippet').then(function (result) {
      return _.get(result, 'items.0.snippet.description');
    });
  },

  getDuration: function getDuration(videoId) {
    return fetchVideo(videoId, 'contentDetails').then(function (result) {
      return convertDurationToSc(_.get(result, 'items.0.contentDetails.duration'));
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