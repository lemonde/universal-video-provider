const moment = require('moment');

const formatDuration = (duration, pattern = 'HH:mm:ss') => (
  moment.unix(duration)
  .utc()
  .format(pattern)
  .replace(/^00:/, '')
);

const formatVideo = (
  providerName,
  videoId,
  { title, description, duration, thumbnailUrl, playerUrl, embedCode }
) => ({
  title,
  description,
  thumbnailUrl,
  playerUrl,
  duration: formatDuration(duration),
  metadata: { embedCode },
  provider: providerName,
  providerVideoId: videoId,
});

module.exports.duration = formatDuration;
module.exports.video = formatVideo;
