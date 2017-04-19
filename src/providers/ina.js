const _ = require('lodash');
const xml = require('node-xml-lite').parseString;
const fetch = require('../fetch');

const find = (xmlObj, pathStr) => {
  const path = pathStr.split('.');
  return walker(xmlObj, path);
};

const walker = (xmlObj, path) => {
  if (!path.length) return xmlObj;
  return walker(_.find(xmlObj.childs, { name: path.shift() }), path);
};

const provider = {
  name: 'ina',
  label: 'INA',
  headers: {},
  videoIdExtractRegExps: [
    // ex. http://www.ina.fr/video/NA00001285844/monopoly-nantais-video.html
    /^(?:https?:)?\/\/(?:www\.)?ina\.fr\/video\/([^?&#/]+)/i
  ],

  getThumbnailUrl: videoId => (
    new Promise(resolve => resolve(`//www.ina.fr/images_v2/320x240/${videoId}.jpeg`))
  ),

  getTitle: videoId => (
    fetch(`//player.ina.fr/notices/${videoId}.mrss`, { method: 'GET', headers: provider.headers })
    .then(result => find(xml(result.data), 'channel.title').childs[0])
  ),

  getDescription: videoId => (
    fetch(`//player.ina.fr/notices/${videoId}.mrss`, { method: 'GET', headers: provider.headers })
    .then(result => find(xml(result.data), 'channel.description').childs[0])
  ),

  getDuration: videoId => (
    fetch(`//player.ina.fr/notices/${videoId}.mrss`, { method: 'GET', headers: provider.headers })
    .then(result => find(xml(result.data), 'channel.item.media:content').attrib.duration)
  ),

  getPlayerUrl: videoId => (
    new Promise(resolve => resolve(`//player.ina.fr/player/ticket/${videoId}/1/1b0bd203fbcd702f9bc9b10ac3d0fc21/0/148db8`))
  )
};

module.exports = provider;
