module.exports = {
  preRelease:
    'yarn --pure-lockfile && yarn build && git add lib/ && git commit --no-verify --allow-empty --verbose --message="[release] build lib"'
};
