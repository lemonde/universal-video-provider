const _ = require('lodash');
const formatter = require('./formatter').video;
const dailymotion = require('./providers/dailymotion');
const ina = require('./providers/ina');
const youtube = require('./providers/youtube');
const digiteka = require('./providers/digiteka');
const facebook = require('./providers/facebook');

const providers = [dailymotion, ina, youtube, digiteka, facebook];

function extractVideoId(provider, url) {
  return provider.videoIdExtractRegExps.reduce(
    (videoId, regexp) => videoId || (regexp.test(url) ? regexp.exec(url)[1] : null),
    null
  );
}

function getProviderFromUrl(url) {
  return _.find(
    providers,
    provider => extractVideoId(provider, url)
  );
}

function getVideoFromId(provider, videoId) {
  return Promise.all([
    provider.getTitle(videoId),
    provider.getDescription(videoId),
    provider.getDuration(videoId),
    provider.getThumbnailUrl(videoId),
    provider.getPlayerUrl(videoId)
  ])
  .then(([title, description, duration, thumbnailUrl, playerUrl]) => formatter(
    provider.name, videoId, { title, description, duration, thumbnailUrl, playerUrl }
  ));
}

module.exports.getVideoFromUrl = (url) => {
  const provider = getProviderFromUrl(url);

  if (!provider) return Promise.reject(new Error('Url pattern is not recognized'));

  const videoId = extractVideoId(provider, url);

  return getVideoFromId(provider, videoId);
};

module.exports.getProviderFromUrl = getProviderFromUrl;
module.exports.extractVideoId = extractVideoId;
module.exports.getVideoFromId = getVideoFromId;
module.exports.getSupportedProviders = () => _.map(providers, 'name');
module.exports.getProviderFromName = name => _.find(providers, { name });
module.exports.extendProvider = (name, obj) => _.extend(_.find(providers, { name }), obj);
module.exports.extendProviders = (
  obj => exports.getSupportedProviders()
    .map(name => exports.extendProvider(name, obj))
);
