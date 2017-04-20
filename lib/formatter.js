'use strict';

var moment = require('moment');

var formatDuration = function formatDuration(duration) {
  var pattern = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'HH:mm:ss';
  return moment.unix(duration).utc().format(pattern).replace(/^00:/, '');
};

var formatVideo = function formatVideo(providerName, videoId, _ref) {
  var title = _ref.title,
      description = _ref.description,
      duration = _ref.duration,
      thumbnailUrl = _ref.thumbnailUrl,
      playerUrl = _ref.playerUrl;
  return {
    title: title,
    description: description,
    thumbnailUrl: thumbnailUrl,
    playerUrl: playerUrl,
    duration: formatDuration(duration),
    metadata: '<iframe src=' + playerUrl + ' frameborder="0"></iframe>',
    provider: providerName,
    providerVideoId: videoId
  };
};

module.exports.duration = formatDuration;
module.exports.video = formatVideo;