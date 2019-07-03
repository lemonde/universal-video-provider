'use strict';

var _ = require('lodash');
var formatter = require('../formatter').video;
var fetch = require('../fetch');

/**
 * Digiteka api endpoints
 */

var fetchUrl = function fetchUrl(videoId) {
  return '//www.ultimedia.com/api/search/getvideoinfos/datatype/json/' + ('zone/' + provider.zoneId + '/mdtk/' + provider.mdtk + '/videoid/' + videoId);
};

var searchUrl = function searchUrl(query, perPage, page) {
  return '//www.ultimedia.com/api/search/search/datatype/json/' + ('zone/' + provider.zoneId + '/perpage/' + perPage + '/page/' + page + '/') + ('mdtk/' + provider.mdtk + '/owner_id/' + provider.mainCatalog + '/') + ('q/' + query + '/mode/last');
};

var fetchVideo = _.memoize(function (videoId) {
  return fetch(fetchUrl(videoId), { headers: provider.headers }).then(function (res) {
    return res.json();
  });
});

/**
 * Extractors
 */

var extractThumbnailUrl = function extractThumbnailUrl(imageUrl) {
  return _.nth(/(?:https?:)(.*)/.exec(imageUrl), 1);
};

var extractPlayerUrl = function extractPlayerUrl(iframeTag) {
  return _.nth(/src="(?:https?:)([^"]*)/.exec(iframeTag), 1);
};

/**
 * Formatters
 */

var formatEmbedCode = function formatEmbedCode(videoId) {
  return _.compact(['<iframe frameborder="0" scrolling="no" marginwidth="0" marginheight="0" hspace="0" vspace="0"', 'webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true"', 'src="//www.ultimedia.com/deliver/generic/iframe/mdtk/' + provider.mdtk, '/src/' + videoId + '/zone/1/showtitle/1"', _.get(provider, 'embed.width') ? 'width="' + provider.embed.width + '"' : null, _.get(provider, 'embed.height') ? 'height="' + provider.embed.height + '"' : null, '></iframe>']).join(' ');
};

var provider = {
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
  /^(?:https?:)?\/\/(?:www\.)?ultimedia\.com\/deliver\/generic\/iframe\/mdtk\/(?:[^?&#/]+)\/zone\/(?:[^?&#/]+)\/src\/([^?&#/]+)/i],

  getThumbnailUrl: function getThumbnailUrl(videoId) {
    return fetchVideo(videoId).then(function (res) {
      return extractThumbnailUrl(_.get(res, 'results.image_high'));
    });
  },

  getTitle: function getTitle(videoId) {
    return fetchVideo(videoId).then(function (res) {
      return _.get(res, 'results.title');
    });
  },

  getDescription: function getDescription(videoId) {
    return fetchVideo(videoId).then(function (res) {
      return _.get(res, 'results.description');
    });
  },

  getDuration: function getDuration(videoId) {
    return fetchVideo(videoId).then(function (res) {
      return _.get(res, 'results.lengthvideo');
    });
  },

  getPlayerUrl: function getPlayerUrl(videoId) {
    return fetchVideo(videoId).then(function (res) {
      return extractPlayerUrl(_.get(res, 'results.iframe'));
    });
  },

  getEmbedCode: function getEmbedCode(videoId) {
    return new Promise(function (resolve) {
      return resolve(formatEmbedCode(videoId));
    });
  },

  // search methods and constants
  itemsPerPage: 10,
  extractPlayerUrl: extractPlayerUrl,
  searchUrl: searchUrl,
  search: function search(query) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return fetch(searchUrl(query, provider.itemsPerPage, 1 + Math.ceil(offset / provider.itemsPerPage)), { timeout: 10000, headers: provider.headers }).then(function (res) {
      return res.json();
    }).then(function (res) {
      return _.get(res, 'results', []).map(
      // eslint-disable-next-line
      function (_ref) {
        var video_id = _ref.video_id,
            title = _ref.title,
            description = _ref.description,
            lengthvideo = _ref.lengthvideo,
            image_high = _ref.image_high,
            iframe = _ref.iframe;
        return formatter('digiteka', video_id, {
          title: title,
          description: description,
          duration: lengthvideo,
          thumbnailUrl: extractThumbnailUrl(image_high),
          playerUrl: extractPlayerUrl(iframe),
          embedCode: formatEmbedCode(video_id)
        });
      });
    });
  }
};

module.exports = provider;