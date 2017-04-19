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

const fetchVideo = videoId => fetch(fetchUrl(videoId), { headers: provider.headers, cache: true });

/**
 * Extractors
 */

const extractThumbnailUrl = imageUrl => _.nth(/(?:https?:)(.*)/.exec(imageUrl), 1);

const extractPlayerUrl = iframeTag => _.nth(/src="(?:https?:)([^"]*)/.exec(iframeTag), 1);

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
    /^(?:https?:)?\/\/(?:www\.)?digiteka\.net\/default\/index\/videogeneric\/.*id\/([^?&#/]+)/i
  ],

  getThumbnailUrl: videoId => (
    fetchVideo(videoId)
    .then(res => extractThumbnailUrl(_.get(res, 'data.results.image_high')))
  ),

  getTitle: videoId => (
    fetchVideo(videoId)
    .then(res => _.get(res, 'data.results.title'))
  ),

  getDescription: videoId => (
    fetchVideo(videoId)
    .then(res => _.get(res, 'data.results.description'))
  ),

  getDuration: videoId => (
    fetchVideo(videoId)
    .then(res => _.get(res, 'data.results.lengthvideo'))
  ),

  getPlayerUrl: videoId => (
    fetchVideo(videoId)
    .then(res => extractPlayerUrl(_.get(res, 'data.results.iframe')))
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
    .then(res => _.get(res, 'data.results', []).map(
      ({
        video_id, title, description, lengthvideo, image_high, iframe
      }) => formatter('digiteka', video_id, {
        title,
        description,
        duration: lengthvideo,
        thumbnailUrl: extractThumbnailUrl(image_high),
        playerUrl: extractPlayerUrl(iframe)
      })
    ))
  )
};

module.exports = provider;
