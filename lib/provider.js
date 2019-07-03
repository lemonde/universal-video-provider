'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ = require('lodash');
var formatter = require('./formatter').video;
var dailymotion = require('./providers/dailymotion');
var ina = require('./providers/ina');
var youtube = require('./providers/youtube');
var digiteka = require('./providers/digiteka');
var facebook = require('./providers/facebook');

var providers = [dailymotion, ina, youtube, digiteka, facebook];

function extractVideoId(provider, url) {
  return provider.videoIdExtractRegExps.reduce(function (videoId, regexp) {
    return videoId || (regexp.test(url) ? regexp.exec(url)[1] : null);
  }, null);
}

function getProviderFromUrl(url) {
  return _.find(providers, function (provider) {
    return extractVideoId(provider, url);
  });
}

function getVideoFromId(provider, videoId) {
  return Promise.all([provider.getTitle(videoId), provider.getDescription(videoId), provider.getDuration(videoId), provider.getThumbnailUrl(videoId), provider.getPlayerUrl(videoId), provider.getEmbedCode(videoId)]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 6),
        title = _ref2[0],
        description = _ref2[1],
        duration = _ref2[2],
        thumbnailUrl = _ref2[3],
        playerUrl = _ref2[4],
        embedCode = _ref2[5];

    return formatter(provider.name, videoId, {
      title: title,
      description: description,
      duration: duration,
      thumbnailUrl: thumbnailUrl,
      playerUrl: playerUrl,
      embedCode: embedCode
    });
  });
}

module.exports.getVideoFromUrl = function (url) {
  var provider = getProviderFromUrl(url);

  if (!provider) return Promise.reject(new Error('Url pattern is not recognized'));

  var videoId = extractVideoId(provider, url);

  return getVideoFromId(provider, videoId);
};

module.exports.getProviderFromUrl = getProviderFromUrl;
module.exports.extractVideoId = extractVideoId;
module.exports.getVideoFromId = getVideoFromId;
module.exports.getSupportedProviders = function () {
  return _.map(providers, 'name');
};
module.exports.getProviderFromName = function (name) {
  return _.find(providers, { name: name });
};
module.exports.extendProvider = function (name, obj) {
  return _.extend(_.find(providers, { name: name }), obj);
};
module.exports.extendProviders = function (obj) {
  return exports.getSupportedProviders().map(function (name) {
    return exports.extendProvider(name, obj);
  });
};