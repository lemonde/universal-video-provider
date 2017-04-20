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
  /^(?:https?:)?\/\/(?:www\.)?digiteka\.net\/default\/index\/videogeneric\/.*id\/([^?&#/]+)/i],

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

  // search methods and constants
  itemsPerPage: 10,
  extractPlayerUrl: extractPlayerUrl,
  searchUrl: searchUrl,
  search: function search(query) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    return fetch(searchUrl(query, provider.itemsPerPage, 1 + Math.ceil(offset / provider.itemsPerPage)), { timeout: 10000, headers: provider.headers }).then(function (res) {
      return res.json();
    }).then(function (res) {
      return _.get(res, 'results', []).map(function (_ref) {
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
          playerUrl: extractPlayerUrl(iframe)
        });
      });
    });
  }
};

module.exports = provider;