module.exports = {
  "extends": "airbnb-base",
  "plugins": [
    "import",
  ],
  "rules": {
    "import/no-unresolved": ["error", { "ignore": ["^modules/", "!json$", "!text$"] }],
    "comma-dangle": "off", // trailing comma, can be turned ON after removing jshint
    "no-unused-expressions": "off",
    "import/no-dynamic-require": "off", // used in tests require(`${cms.base}/...`),
    "import/extensions": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-webpack-loader-syntax": "off",
  },
  "globals": {
    // used in tests:
    "cms": true,
    "expect": true,
    "describe": true,
    "context": true,
    "it": true,
    "before": true,
    "beforeEach": true,
    "after": true,
    "afterEach": true,
    "sinon": true,
    "inject": true,
    "sinon": true,
  },
};
