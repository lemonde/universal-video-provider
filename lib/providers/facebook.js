'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ = require('lodash');

var fetch = require('../fetch');

var BASE_GRAPH_API_URL = 'https://graph.facebook.com/v2.9/';

/**
 * Graph Api v2.9
 */

var fetchVideo = _.memoize(function (url) {
  return fetch(url, { headers: provider.headers }).then(function (res) {
    return res.json();
  });
});

var provider = {
  name: 'facebook',
  label: 'Facebook',
  embed: { liquid: true },
  headers: {},
  pageAccessToken: null,
  videoIdExtractRegExps: [
  // standard url
  // ex. https://www.facebook.com/canalplus/videos/1441853042524556
  /^(?:https?:)?\/\/(?:www\.)?facebook\.com\/(?:[^_&#]+)\/videos\/(\d+)/i],

  getThumbnailUrl: function getThumbnailUrl(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=picture').then(function (result) {
      return _.get(result, 'picture');
    });
  },

  getTitle: function getTitle(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=title').then(function (result) {
      return _.get(result, 'title');
    });
  },

  getDescription: function getDescription(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=description').then(function (result) {
      return _.get(result, 'description');
    });
  },

  getDuration: function getDuration(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=length').then(function (result) {
      return _.get(result, 'length');
    });
  },

  getPlayerUrl: function getPlayerUrl(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=permalink_url').then(function (result) {
      return 'https://www.facebook.com/plugins/video.php?href=https://www.facebook.com' + result.permalink_url;
    });
  },

  getEmbedDimensions: function getEmbedDimensions(videoId) {
    return fetchVideo('' + BASE_GRAPH_API_URL + videoId + '?access_token=' + provider.pageAccessToken + '&fields=embed_html').then(function (result) {
      var _result$embed_html$ma = result.embed_html.match(/width="(\d+)" height="(\d+)"/),
          _result$embed_html$ma2 = _slicedToArray(_result$embed_html$ma, 3),
          width = _result$embed_html$ma2[1],
          height = _result$embed_html$ma2[2];

      return { width: width, height: height };
    });
  },

  getEmbedCode: function getEmbedCode(videoId) {
    return Promise.all([provider.getPlayerUrl(videoId), provider.getEmbedDimensions(videoId)]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          playerUrl = _ref2[0],
          dimensions = _ref2[1];

      var width = parseInt(_.get(provider, 'embed.width', dimensions.width, 400), 10);
      var height = parseInt(_.get(provider, 'embed.height', dimensions.height, 400), 10);
      var ratio = height / width * 100;

      if (_.get(provider, 'embed.liquid')) {
        return ['<div class="uvp-liquid-iframe" style="position:relative;height:0;overflow:hidden;padding-bottom:' + ratio + '%">', '<iframe src="' + playerUrl + '"', 'style="border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;"', 'scrolling="no" frameborder="0" allowTransparency="true"', 'allowFullScreen="true">', '</iframe>', '</div>'].join(' ');
      }

      return ['<iframe src="' + playerUrl + '"', 'style="border:none;overflow:hidden;"', 'width="' + width + '" height="' + height + '"', 'scrolling="no" frameborder="0" allowTransparency="true"', 'allowFullScreen="true">', '</iframe>'].join(' ');
    });
  }
};

module.exports = provider;