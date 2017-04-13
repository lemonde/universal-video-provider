const _ = require('lodash');
const xml = require('node-xml-lite').parseString;
const fetch = require('../fetch');

module.exports = (providerName) => {
  let provider;

  try {
    /* eslint global-require: "off" */
    provider = require(`./${providerName}`)(_, xml, fetch);
  } catch (err) {
    throw new Error(`Unknown provider ${providerName}`);
  }

  return provider;
};
