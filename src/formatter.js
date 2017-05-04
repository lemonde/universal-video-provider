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
  { title, description, duration, thumbnailUrl, playerUrl }
) => ({
  title,
  description,
  thumbnailUrl,
  playerUrl,
  duration: formatDuration(duration),
  metadata: { embedCode: `<iframe src=${playerUrl} frameborder="0"></iframe>` },
  provider: providerName,
  providerVideoId: videoId,
});

module.exports.duration = formatDuration;
module.exports.video = formatVideo;
