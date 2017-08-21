module.exports = {
  preRelease: 'npm install && npm run build && git add lib/ && git commit --no-verify --allow-empty --verbose --message="[release] build lib"'
};
