"use strict";

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
  return Promise.all([provider.getTitle(videoId), provider.getDescription(videoId), provider.getDuration(videoId), provider.getThumbnailUrl(videoId), provider.getPlayerUrl(videoId), provider.getEmbedCode(videoId), provider.getPublishedDate(videoId)]).then(function (_ref) {
    var title = _ref[0],
        description = _ref[1],
        duration = _ref[2],
        thumbnailUrl = _ref[3],
        playerUrl = _ref[4],
        embedCode = _ref[5],
        publishedDate = _ref[6];
    return formatter(provider.name, videoId, {
      title: title,
      description: description,
      duration: duration,
      thumbnailUrl: thumbnailUrl,
      playerUrl: playerUrl,
      embedCode: embedCode,
      publishedDate: publishedDate
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
  return _.find(providers, {
    name: name
  });
};

module.exports.extendProvider = function (name, obj) {
  return _.extend(_.find(providers, {
    name: name
  }), obj);
};

module.exports.extendProviders = function (obj) {
  return exports.getSupportedProviders().map(function (name) {
    return exports.extendProvider(name, obj);
  });
};