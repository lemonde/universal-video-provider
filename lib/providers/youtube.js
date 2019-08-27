"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ = require('lodash');

var fetch = require('../fetch');

var formatter = require('../formatter').video;
/**
 * Url api v3
 */


var getUrl = function getUrl(videoId) {
  return "//www.youtube.com/embed/" + videoId;
};

var fetchUrl = function fetchUrl(videoId, part) {
  return "https://www.googleapis.com/youtube/v3/videos?part=" + part + "&id=" + videoId + "&key=" + provider.apiKey;
};

var searchUrl = function searchUrl(query, token) {
  var url;
  url = 'https://www.googleapis.com/youtube/v3/search' + ("?part=snippet&type=video&key=" + provider.apiKey) + ("&q=" + query);

  if (provider.channelId) {
    url = url + "&channelId=" + provider.channelId;
  }

  if (token) {
    url = url + "&pageToken=" + token;
  }

  return url;
};

var fetchVideo = function fetchVideo(videoId, part) {
  return fetch(fetchUrl(videoId, part), {
    headers: provider.headers
  }).then(function (res) {
    return res.json();
  });
};
/**
 * Convert duration ISO 8601 to seconds
 */


var convertDurationToSc = function convertDurationToSc(duration) {
  if (!duration) return 0;
  var parsed = duration.match(/PT([0-9]{1,2}H)?([0-9]{1,2}M)?([0-9]{1,2}S)?/).map(function (value) {
    return parseInt(value, 10) || 0;
  }); // => [0,H,M,S]

  /* eslint-disable no-mixed-operators */

  return parsed[1] * 3600 + parsed[2] * 60 + parsed[3];
};

var provider = {
  name: 'youtube',
  label: 'Youtube',
  headers: {},
  apiKey: null,
  channelId: null,
  videoIdExtractRegExps: [// standard url
  // ex. https://www.youtube.com/watch?v=ky6CRSBcf98
  /^(?:https?:)?\/\/(?:www\.)?youtube\.com\/.*?\?v=([^?&#/]+)/i, // direct url
  // ex. http://www.youtube.com/v/ky6CRSBcf98
  /^(?:https?:)?\/\/(?:www\.)?youtube\.com\/v\/([^?&#/]+)/i, // embed url
  // ex. http://www.youtube.com/v/ky6CRSBcf98
  /^(?:https?:)?\/\/(?:www\.)?youtube\.com\/embed\/([^?&#/]+)/i, // short url
  // ex. http://youtu.be/ky6CRSBcf98
  /^(?:https?:)?\/\/youtu\.be\/([^?&#/]+)/i],
  getThumbnailUrl: function getThumbnailUrl(videoId) {
    return new Promise(function (resolve) {
      return resolve("//img.youtube.com/vi/" + videoId + "/hqdefault.jpg");
    });
  },
  getTitle: function getTitle(videoId) {
    return fetchVideo(videoId, 'snippet').then(function (result) {
      return _.get(result, 'items.0.snippet.title');
    });
  },
  getPublishedDate: function getPublishedDate(videoId) {
    return fetchVideo(videoId, 'snippet').then(function (result) {
      return _.get(result, 'items.0.snippet.publishedAt');
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
      return resolve(_.compact(["<iframe src=\"" + getUrl(videoId) + "\"", 'frameborder="0"', _.get(provider, 'embed.width') ? "width=\"" + provider.embed.width + "\"" : null, _.get(provider, 'embed.height') ? "height=\"" + provider.embed.height + "\"" : null, '></iframe>']).join(' '));
    });
  },
  search: function search(query, token) {
    var result = [];
    return fetch(searchUrl(query, token), {
      timeout: 10000,
      headers: provider.headers
    }).then(function (res) {
      return res.json();
    }).then(function (_ref) {
      var items = _ref.items,
          nextPageToken = _ref.nextPageToken;
      result.nextPageToken = nextPageToken;
      return Promise.all(items.map(function (item) {
        return fetchVideo(item.id.videoId, 'contentDetails, snippet, player');
      }));
    }).then(function (res) {
      var formattedVideos = res.map(function (item) {
        var _$get = _.get(item, 'items.0'),
            id = _$get.id,
            _$get$snippet = _$get.snippet,
            title = _$get$snippet.title,
            description = _$get$snippet.description,
            thumbnails = _$get$snippet.thumbnails,
            publishedAt = _$get$snippet.publishedAt,
            contentDetails = _$get.contentDetails,
            embedHtml = _$get.player.embedHtml;

        return formatter('youtube', id, {
          title: title,
          description: description,
          publishedDate: publishedAt,
          duration: convertDurationToSc(contentDetails.duration),
          thumbnailUrl: _.get(thumbnails, 'maxres.url') || _.get(thumbnails, 'high.url'),
          playerUrl: getUrl(id),
          embedCode: embedHtml
        });
      });
      return _objectSpread({}, result, {
        videos: formattedVideos
      });
    });
  }
};
module.exports = provider;