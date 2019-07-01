const _ = require("lodash");
const xml = require("node-xml-lite").parseString;
const fetch = require("../fetch");

/**
 * Ina api endpoints
 */

const getUrl = videoId =>
  `//player.ina.fr/player/ticket/${videoId}/1/1b0bd203fbcd702f9bc9b10ac3d0fc21/0/148db8`;

const find = (xmlObj, pathStr) => {
  const path = pathStr.split(".");
  return walker(xmlObj, path);
};

const walker = (xmlObj, path) => {
  if (!path.length) return xmlObj;
  return walker(_.find(xmlObj.childs, { name: path.shift() }), path);
};

const fetchVideo = _.memoize(url =>
  fetch(url, { headers: provider.headers }).then(res => res.text())
);

const provider = {
  name: "ina",
  label: "INA",
  headers: {},
  videoIdExtractRegExps: [
    // ex. http://www.ina.fr/video/NA00001285844/monopoly-nantais-video.html
    /^(?:https?:)?\/\/(?:www\.)?ina\.fr\/video\/([^?&#/]+)/i
  ],

  getThumbnailUrl: videoId =>
    new Promise(resolve =>
      resolve(`//www.ina.fr/images_v2/320x240/${videoId}.jpeg`)
    ),

  getTitle: videoId =>
    fetchVideo(`//player.ina.fr/notices/${videoId}.mrss`).then(
      result => find(xml(result), "channel.title").childs[0]
    ),

  getDescription: videoId =>
    fetchVideo(`//player.ina.fr/notices/${videoId}.mrss`).then(
      result => find(xml(result), "channel.description").childs[0]
    ),

  getDuration: videoId =>
    fetchVideo(`//player.ina.fr/notices/${videoId}.mrss`).then(
      result => find(xml(result), "channel.item.media:content").attrib.duration
    ),

  getPlayerUrl: videoId => new Promise(resolve => resolve(getUrl(videoId))),

  getEmbedCode: videoId =>
    new Promise(resolve =>
      resolve(
        _.compact([
          "<iframe",
          _.get(provider, "embed.width")
            ? `width="${provider.embed.width}"`
            : null,
          _.get(provider, "embed.height")
            ? `height="${provider.embed.height}"`
            : null,
          'frameborder="0" marginheight ="0" marginwidth="0" scrolling ="no"',
          `src="${getUrl(videoId)}"></iframe>`
        ]).join(" ")
      )
    )
};

module.exports = provider;
