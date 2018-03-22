const _ = require('lodash');
const formatter = require('../formatter').video;
const fetch = require('../fetch');

/**
 * Digiteka api endpoints
 */

const fetchUrl = videoId => (
  '//www.ultimedia.com/api/search/getvideoinfos/datatype/json/' +
  `zone/${provider.zoneId}/mdtk/${provider.mdtk}/videoid/${videoId}`
);

const searchUrl = (query, perPage, page) => (
  '//www.ultimedia.com/api/search/search/datatype/json/' +
  `zone/${provider.zoneId}/perpage/${perPage}/page/${page}/` +
  `mdtk/${provider.mdtk}/owner_id/${provider.mainCatalog}/` +
  `q/${query}/mode/last`
);

const fetchVideo = _.memoize(
  videoId => fetch(fetchUrl(videoId), { headers: provider.headers }).then(res => res.json())
);

/**
 * Extractors
 */

const extractThumbnailUrl = imageUrl => _.nth(/(?:https?:)(.*)/.exec(imageUrl), 1);

const extractPlayerUrl = iframeTag => _.nth(/src="(?:https?:)([^"]*)/.exec(iframeTag), 1);

/**
 * Formatters
 */

const formatEmbedCode = videoId => (
  _.compact([
    '<iframe frameborder="0" scrolling="no" marginwidth="0" marginheight="0" hspace="0" vspace="0"',
    'webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true"',
    `src="//www.ultimedia.com/deliver/generic/iframe/mdtk/${provider.mdtk}`,
    `/src/${videoId}/zone/1/showtitle/1"`,
    _.get(provider, 'embed.width') ? `width="${provider.embed.width}"` : null,
    _.get(provider, 'embed.height') ? `height="${provider.embed.height}"` : null,
    '></iframe>'
  ]).join(' ')
);

const provider = {
  name: 'digiteka',
  label: 'Digiteka',
  headers: {},
  zoneId: null,
  mdtk: null,
  mainCatalog: null,
  videoIdExtractRegExps: [
    // ex. http://www.ultimedia.com/default/index/videogeneric/id/5ss8kq
    /^(?:https?:)?\/\/(?:www\.)?ultimedia\.com\/default\/index\/videogeneric\/id\/([^?&#/]+)/i,
    // ex. http://www.digiteka.net/default/index/videogeneric/id/550sru
    /^(?:https?:)?\/\/(?:www\.)?digiteka\.net\/default\/index\/videogeneric\/id\/([^?&#/]+)/i,
    // ex. http//www.ultimedia.com/deliver/generic/iframe/mdtk/01637594/zone/34/src/5lfqkv
    /^(?:https?:)?\/\/(?:www\.)?ultimedia\.com\/deliver\/generic\/iframe\/mdtk\/(?:[^?&#/]+)\/zone\/(?:[^?&#/]+)\/src\/([^?&#/]+)/i
  ],

  getThumbnailUrl: videoId => (
    fetchVideo(videoId)
    .then(res => extractThumbnailUrl(_.get(res, 'results.image_high')))
  ),

  getTitle: videoId => (
    fetchVideo(videoId)
    .then(res => _.get(res, 'results.title'))
  ),

  getDescription: videoId => (
    fetchVideo(videoId)
    .then(res => _.get(res, 'results.description'))
  ),

  getDuration: videoId => (
    fetchVideo(videoId)
    .then(res => _.get(res, 'results.lengthvideo'))
  ),

  getPlayerUrl: videoId => (
    fetchVideo(videoId)
    .then(res => extractPlayerUrl(_.get(res, 'results.iframe')))
  ),

  getEmbedCode: videoId => (
    new Promise(resolve => resolve(formatEmbedCode(videoId)))
  ),

  // search methods and constants
  itemsPerPage: 10,
  extractPlayerUrl,
  searchUrl,
  search: (query, offset = 0) => (
    fetch(
      searchUrl(query, provider.itemsPerPage, 1 + Math.ceil(offset / provider.itemsPerPage)),
      { timeout: 10000, headers: provider.headers }
    )
    .then(res => res.json())
    .then(res => _.get(res, 'results', []).map(
      ({
        video_id, title, description, lengthvideo, image_high, iframe
      }) => formatter('digiteka', video_id, {
        title,
        description,
        duration: lengthvideo,
        thumbnailUrl: extractThumbnailUrl(image_high),
        playerUrl: extractPlayerUrl(iframe),
        embedCode: formatEmbedCode(video_id)
      })
    ))
  )
};

module.exports = provider;
