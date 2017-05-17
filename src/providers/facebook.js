const _ = require('lodash');

const fetch = require('../fetch');

const BASE_GRAPH_API_URL = 'https://graph.facebook.com/v2.9/';

/**
 * Graph Api v2.9
 */

const fetchVideo = _.memoize(
  url => fetch(url, { headers: provider.headers }).then(res => res.json())
);

const provider = {
  name: 'facebook',
  label: 'Facebook',
  embed: { liquid: true },
  headers: {},
  pageAccessToken: null,
  videoIdExtractRegExps: [
    // standard url
    // ex. https://www.facebook.com/canalplus/videos/1441853042524556
    /^(?:https?:)?\/\/(?:www\.)?facebook\.com\/(?:[^_&#]+)\/videos\/(\d+)/i,
  ],

  getThumbnailUrl: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=picture`)
      .then(result => _.get(result, 'picture'))
  ),

  getTitle: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=title`)
      .then(result => _.get(result, 'title'))
  ),

  getDescription: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=description`)
      .then(result => _.get(result, 'description'))
  ),

  getDuration: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=length`)
      .then(result => _.get(result, 'length'))
  ),

  getPlayerUrl: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=permalink_url`)
      .then(result => `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com${result.permalink_url}`)
  ),

  getEmbedDimensions: videoId => (
    fetchVideo(`${BASE_GRAPH_API_URL}${videoId}?access_token=${provider.pageAccessToken}&fields=embed_html`)
      .then((result) => {
        const [, width, height] = result.embed_html.match(/width="(\d+)" height="(\d+)"/);
        return { width, height };
      })
  ),

  getEmbedCode: videoId => (
    Promise.all([
      provider.getPlayerUrl(videoId),
      provider.getEmbedDimensions(videoId)
    ])
    .then(([playerUrl, dimensions]) => {
      const width = _.get(provider, 'embed.width', dimensions.width);
      const height = _.get(provider, 'embed.height', dimensions.height);
      const ratio = (height / width) * 100;

      if (_.get(provider, 'embed.liquid')) {
        return [
          `<div class="uvp-liquid-iframe" style="position:relative;height:0;overflow:hidden;padding-bottom:${ratio}%">`,
          `<iframe src="${playerUrl}"`,
          'style="border:none;overflow:hidden;position:absolute;top:0;left:0;width:100%;height:100%;"',
          'scrolling="no" frameborder="0" allowTransparency="true"',
          'allowFullScreen="true">',
          '</iframe>',
          '</div>'
        ].join(' ');
      }

      return [
        `<iframe src="${playerUrl}"`,
        'style="border:none;overflow:hidden;"',
        `width="${width}" height="${height}"`,
        'scrolling="no" frameborder="0" allowTransparency="true"',
        'allowFullScreen="true">',
        '</iframe>'
      ].join(' ');
    })
  )
};

module.exports = provider;
