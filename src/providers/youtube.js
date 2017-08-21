const _ = require('lodash');
const fetch = require('../fetch');

/**
 * Url api v3
 */

const getUrl = videoId => `//www.youtube.com/embed/${videoId}`;

const fetchUrl = (videoId, part) => (
  `https://www.googleapis.com/youtube/v3/videos?part=${part}&id=${videoId}&key=${provider.apiKey}`
);

const fetchVideo = (videoId, part) => fetch(fetchUrl(videoId, part), { headers: provider.headers })
    .then(res => res.json());

/**
 * Convert duration ISO 8601 to seconds
 */
const convertDurationToSc = (duration) => {
  if (!duration) return 0;

  const parsed = duration
  .match(/PT([0-9]{1,2}H)?([0-9]{1,2}M)?([0-9]{1,2}S)?/)
  .map(value => parseInt(value, 10) || 0);
  // => [0,H,M,S]

  return (parsed[1] * 3600) + (parsed[2] * 60) + parsed[3];
};

const provider = {
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
    /^(?:https?:)?\/\/youtu\.be\/([^?&#/]+)/i
  ],

  getThumbnailUrl: videoId => (
    new Promise(resolve => resolve(`//img.youtube.com/vi/${videoId}/hqdefault.jpg`))
  ),

  getTitle: videoId => (
    fetchVideo(videoId, 'snippet')
    .then(result => _.get(result, 'items.0.snippet.title'))
  ),

  getDescription: videoId => (
    fetchVideo(videoId, 'snippet')
    .then(result => _.get(result, 'items.0.snippet.description'))
  ),

  getDuration: videoId => (
    fetchVideo(videoId, 'contentDetails')
    .then(result => convertDurationToSc(_.get(result, 'items.0.contentDetails.duration')))
  ),

  getPlayerUrl: videoId => (
    new Promise(resolve => resolve(getUrl(videoId)))
  ),

  getEmbedCode: videoId => (
    new Promise(resolve => resolve(_.compact([
      `<iframe src="${getUrl(videoId)}"`,
      'frameborder="0"',
      _.get(provider, 'embed.width') ? `width="${provider.embed.width}"` : null,
      _.get(provider, 'embed.height') ? `height="${provider.embed.height}"` : null,
      '></iframe>'
    ]).join(' ')))
  ),
};

module.exports = provider;
