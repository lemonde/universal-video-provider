module.exports = {
  extends: ['airbnb-base', 'prettier'],
  plugins: ['import', 'prettier'],
  rules: {
    'no-use-before-define': 'off',
    'comma-dangle': 'off', // trailing comma, can be turned ON after removing jshint
    'import/no-dynamic-require': 'off', // used in tests require(`${cms.base}/...`)
    'class-methods-use-this': 'off',
    'import/no-extraneous-dependencies': 'off',
  },
  globals: {
    $: true,
  },
};
