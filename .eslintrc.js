module.exports = {
  extends: "airbnb-base",
  plugins: ["import"],
  rules: {
    "no-use-before-define": "off",
    "comma-dangle": "off", // trailing comma, can be turned ON after removing jshint
    "import/no-dynamic-require": "off", // used in tests require(`${cms.base}/...`)
    "class-methods-use-this": "off",
    "import/no-extraneous-dependencies": "off"
  },
  globals: {
    $: true
  }
};
