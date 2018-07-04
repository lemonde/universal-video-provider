const _ = require('lodash');
const fetch = require('../fetch');
const formatter = require('../formatter').video;

/**
 * Url api v3
 */

const getUrl = videoId => `//www.youtube.com/embed/${videoId}`;

const fetchUrl = (videoId, part) =>
  `https://www.googleapis.com/youtube/v3/videos?part=${part}&id=${videoId}&key=${provider.apiKey}`;

const searchUrl = (query, token) => {
  let url;
  url =
    'https://www.googleapis.com/youtube/v3/search' +
    `?part=snippet&type=video&key=${provider.apiKey}` +
    `&q=${query}`;

  if (provider.channelId) {
    url = `${url}&channelId=${provider.channelId}`;
  }

  if (token) {
    url = `${url}&pageToken=${token}`;
  }

  return url;
};

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

  /* eslint-disable no-mixed-operators */
  return parsed[1] * 3600 + parsed[2] * 60 + parsed[3];
};

const provider = {
  name: 'youtube',
  label: 'Youtube',
  headers: {},
  apiKey: null,
  channelId: null,
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

  getThumbnailUrl: videoId =>
    new Promise(resolve => resolve(`//img.youtube.com/vi/${videoId}/hqdefault.jpg`)),

  getTitle: videoId =>
    fetchVideo(videoId, 'snippet').then(result => _.get(result, 'items.0.snippet.title')),

  getDescription: videoId =>
    fetchVideo(videoId, 'snippet').then(result => _.get(result, 'items.0.snippet.description')),

  getDuration: videoId =>
    fetchVideo(videoId, 'contentDetails').then(result =>
      convertDurationToSc(_.get(result, 'items.0.contentDetails.duration'))
    ),

  getPlayerUrl: videoId => new Promise(resolve => resolve(getUrl(videoId))),

  getEmbedCode: videoId =>
    new Promise(resolve =>
      resolve(
        _
          .compact([
            `<iframe src="${getUrl(videoId)}"`,
            'frameborder="0"',
            _.get(provider, 'embed.width') ? `width="${provider.embed.width}"` : null,
            _.get(provider, 'embed.height') ? `height="${provider.embed.height}"` : null,
            '></iframe>'
          ])
          .join(' ')
      )
    ),
  search: (query, token) => {
    const result = [];
    return fetch(searchUrl(query, token), {
      timeout: 10000,
      headers: provider.headers
    })
      .then(res => res.json())
      .then(({ items, nextPageToken }) => {
        result.nextPageToken = nextPageToken;
        return Promise.all(
          items.map(item => fetchVideo(item.id.videoId, 'contentDetails, snippet, player'))
        );
      })
      .then((res) => {
        const formattedVideos = res.map((item) => {
          const {
            id,
            snippet: { title, description, thumbnails },
            contentDetails,
            player: { embedHtml }
          } = _.get(item, 'items.0');
          return formatter('youtube', id, {
            title,
            description,
            duration: convertDurationToSc(contentDetails.duration),
            thumbnailUrl: _.get(thumbnails, 'maxres.url') || _.get(thumbnails, 'high.url'),
            playerUrl: getUrl(id),
            embedCode: embedHtml
          });
        });

        return { ...result, videos: formattedVideos };
      });
  }
};

module.exports = provider;
