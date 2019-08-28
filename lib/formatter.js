"use strict";

var moment = require('moment');

var formatDuration = function formatDuration(duration, pattern) {
  if (pattern === void 0) {
    pattern = 'HH:mm:ss';
  }

  return moment.unix(duration).utc().format(pattern).replace(/^00:/, '');
};

var formatVideo = function formatVideo(providerName, videoId, _ref) {
  var title = _ref.title,
      description = _ref.description,
      duration = _ref.duration,
      thumbnailUrl = _ref.thumbnailUrl,
      playerUrl = _ref.playerUrl,
      embedCode = _ref.embedCode,
      publishedDate = _ref.publishedDate;
  return {
    title: title,
    description: description,
    thumbnailUrl: thumbnailUrl,
    playerUrl: playerUrl,
    duration: formatDuration(duration),
    publishedDate: publishedDate,
    metadata: {
      embedCode: embedCode
    },
    provider: providerName,
    providerVideoId: videoId
  };
};

module.exports.duration = formatDuration;
module.exports.video = formatVideo;