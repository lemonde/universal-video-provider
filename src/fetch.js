/* eslint global-require: "off" */
/* eslint no-unused-expressions: "off" */
/* eslint no-undef: "off" */
try {
  if (fetch) true;
} catch (err) {
  require('es6-promise').polyfill();
  require('isomorphic-fetch');
}

module.exports = fetch;
