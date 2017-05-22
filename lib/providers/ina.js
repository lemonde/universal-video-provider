'use strict';

var _ = require('lodash');
var xml = require('node-xml-lite').parseString;
var fetch = require('../fetch');

/**
 * Ina api endpoints
 */

var getUrl = function getUrl(videoId) {
  return '//player.ina.fr/player/ticket/' + videoId + '/1/1b0bd203fbcd702f9bc9b10ac3d0fc21/0/148db8';
};

var find = function find(xmlObj, pathStr) {
  var path = pathStr.split('.');
  return walker(xmlObj, path);
};

var walker = function walker(xmlObj, path) {
  if (!path.length) return xmlObj;
  return walker(_.find(xmlObj.childs, { name: path.shift() }), path);
};

var fetchVideo = _.memoize(function (url) {
  return fetch(url, { headers: provider.headers }).then(function (res) {
    return res.text();
  });
});

var provider = {
  name: 'ina',
  label: 'INA',
  headers: {},
  videoIdExtractRegExps: [
  // ex. http://www.ina.fr/video/NA00001285844/monopoly-nantais-video.html
  /^(?:https?:)?\/\/(?:www\.)?ina\.fr\/video\/([^?&#/]+)/i],

  getThumbnailUrl: function getThumbnailUrl(videoId) {
    return new Promise(function (resolve) {
      return resolve('//www.ina.fr/images_v2/320x240/' + videoId + '.jpeg');
    });
  },

  getTitle: function getTitle(videoId) {
    return fetchVideo('//player.ina.fr/notices/' + videoId + '.mrss').then(function (result) {
      return find(xml(result), 'channel.title').childs[0];
    });
  },

  getDescription: function getDescription(videoId) {
    return fetchVideo('//player.ina.fr/notices/' + videoId + '.mrss').then(function (result) {
      return find(xml(result), 'channel.description').childs[0];
    });
  },

  getDuration: function getDuration(videoId) {
    return fetchVideo('//player.ina.fr/notices/' + videoId + '.mrss').then(function (result) {
      return find(xml(result), 'channel.item.media:content').attrib.duration;
    });
  },

  getPlayerUrl: function getPlayerUrl(videoId) {
    return new Promise(function (resolve) {
      return resolve(getUrl(videoId));
    });
  },

  getEmbedCode: function getEmbedCode(videoId) {
    return new Promise(function (resolve) {
      return resolve(_.compact(['<iframe', _.get(provider, 'embed.width') ? 'width="' + provider.embed.width + '"' : null, _.get(provider, 'embed.height') ? 'height="' + provider.embed.height + '"' : null, 'frameborder="0" marginheight ="0" marginwidth="0" scrolling="no"', 'src="' + getUrl(videoId) + '"></iframe>']).join(' '));
    });
  }
};

module.exports = provider;