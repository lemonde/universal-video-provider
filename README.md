# universal-video-provider

[![Build Status](https://travis-ci.org/lemonde/universal-video-provider.svg?branch=master)](https://travis-ci.org/lemonde/universal-video-provider)

## Install

You can install it with yarn: `yarn --pure-lockfile`

## Description

It's a video provider, which expose some basics data extracted from famous video platforms.

This lib could be used natively on server side (node) and on client side, with a client package manager as npm, webpack, ...

Basic usage :

`npm install --save universal-video-provider`

or

`yarn add universal-video-provider`

```js
const videoProvider = require('universal-video-provider');

const provider = videoProvider.getProviderFromUrl('http://www.youtube.com/v/ky6CRSBcf98');
// provider is an object which contains data extraction methods

provider.getTitle()
.then(title => console.log(title))
.catch(err => console.error(err));

provider.getDescription()
.then(title => console.log(title))
.catch(err => console.error(err));

...

provider.getVideoFromUrl('http://www.youtube.com/v/ky6CRSBcf98')
then(video => console.log(video))
.catch(err => console.error(err));
// video is an object which contains all the extracted data
```

## Requirements

Run with npm and jspm. Not tested with others package managers.

## Support video platforms

`youtube, dailymotion, ina, digiteka`

For `youtube`, you have to [extend the current provider](https://github.com/lemonde/universal-video-provider#extendprovider) with an apiKey :

```js
videoProvider.extendProvider('youtube', { apiKey: 'yourKey' });
```

For `digiteka`, you have to [extend the current provider](https://github.com/lemonde/universal-video-provider#extendprovider) with credentials :

```js
videoProvider.extendProvider('digiteka', {
  // id of the site lemonde.fr on digiteka
  mdtk: '123456',
  mainCatalog: '5dmpl',
  // When playing a video, this indicates that the video is played
  // in a back-office (to avoid ads, and not count it as a view)
  zoneId: 34,
});
```

Digiteka provider has a `search` method to require in utlimedia catalog.

Youtube provider has a `search` method to search within youtube library. It returns an Object with 2 keys, one for the token for the next request, the second holds a videos collection matching the criteria:

```js
// "converge" is you search
const searcher = () => videoProvider.getProviderFromName('youtube').search(encodeURIComponent('converge'))

searcher().then(data => console.log(data))
// data is an object which contains all the extracted data
{ nextPageToken: 'CAUQAA',
  videos:
   [ { title: 'Converge - "A Single Tear"',
       description: 'Listen to the full album: http://bit.ly/2ypxqC7\n"A Single Tear" by Converge from the album The Dusk In Us',
       thumbnailUrl: 'https://i.ytimg.com/vi/DKqOp2YHfhI/maxresdefault.jpg',
       playerUrl: '//www.youtube.com/watch?v=DKqOp2YHfhI',
       duration: '04:06',
       pusblishedDate: '2017-09-25T19:05:29.000Z',
       metadata: { embedCode: '//www.youtube.com/embed/DKqOp2YHfhI' },
       provider: 'youtube',
       providerVideoId: 'DKqOp2YHfhI' },
     { title: 'Converge - "Precipice / All We Love We Leave Behind"',
       description: '"Precipice / All We Love We Leave Behind" by Converge',
       thumbnailUrl: 'https://i.ytimg.com/vi/akG2cFldO6I/maxresdefault.jpg',
       playerUrl: '//www.youtube.com/watch?v=akG2cFldO6I',
       duration: '06:17',
       publishedDate: '2017-09-25T19:05:29.000Z',
       metadata: { embedCode: '//www.youtube.com/embed/akG2cFldO6I' },
       provider: 'youtube',
       providerVideoId: 'akG2cFldO6I'
     }
   ]
 }
```

## providerVideo API

### getProviderFromUrl

Get a specific provider from an url.

`Return:` [provider Object](https://github.com/lemonde/universal-video-provider#provider-api)

```js
const provider = videoProvider.getProviderFromUrl(
  'http://www.youtube.com/v/ky6CRSBcf98'
);
```

### getVideoFromUrl

Get a video from an url.

`Return: video object`

```js
provider.getVideoFromUrl('http://www.youtube.com/v/ky6CRSBcf98');
then(video => console.log(video)).catch(err => console.error(err));
// video is an object which contains all the extracted data
```

### getVideoFromId

Get a video from a provider and a video id.

`Return: video object`

```js
const youtubeProvider = videoProvider.getProviderFromUrl(
  'http://www.youtube.com/v/ky6CRSBcf98'
);
provider.getVideoFromId(youtubeProvider, 'ky6CRSBcf98');
then(video => console.log(video)).catch(err => console.error(err));
// video is an object which contains all the extracted data
```

### extractVideoId

Extract video id from an url, with a specific provider.

```
Return: String
```

```js
const provider = videoProvider.getProviderFromUrl(
  'http://www.youtube.com/v/ky6CRSBcf98'
);
const videoId = videoProvider.extractVideoId(
  provider,
  'http://www.youtube.com/v/ky6CRSBcf98'
);
// 'ky6CRSBcf98'
```

### getProviderByName

Get a specific provider by his name

`Return:` [provider Object](https://github.com/lemonde/universal-video-provider#provider-api)

```
videoProvider.getProviderByName('dailymotion');
```

### getSupportedProviders

Get a list of supported provider

```
Return: [String]
```

```
videoProvider.getSupportedProviders();
// ['dailymotion', 'ina', 'youtube', 'digiteka']
```

### extendProvider

Extend a current provider with new constants or methods.

```
Params: provider name (String), new fields (Object)
```

```js
videoProvider.extendProvider('vimeo', {
  apiKey: 'myKey',
  search: terms =>
    fetch(`vimeoUrl/search/?terms=${terms}?apiKey=${this.apiKey}`),
});
```

### extendProvider

Extend all providers with new constants or methods.

```
Params: new fields (Object)
```

```js
videoProvider.extendProviders({ header: { 'Cache-Control': 'no-cache' } });
```

## provider API

### getThumbnailUrl

Get the thumbnail url of the video.

```
Params: video id
Returns: String
```

```js
provider
  .getThumbnailUrl(videoId)
  .then(thumbnailUrl => console.log(thumbnailUrl))
  .catch(err => console.error(err));
```

### getTitle

Get the title of the video.

```
Params: video id
Returns: String
```

```js
provider
  .getTitle(videoId)
  .then(title => console.log(title))
  .catch(err => console.error(err));
```

### getDescription

Get the description of the video.

```
Params: video id
Returns: String
```

```js
provider
  .getDescription(videoId)
  .then(description => console.log(description))
  .catch(err => console.error(err));
```

### getDuration

Get the duration of the video.

```
Params: video id
Returns: String
```

```js
provider
  .getDuration(videoId)
  .then(duration => console.log(duration))
  .catch(err => console.error(err));
```

### getPublishedDate

Get the publication date of the video.

```
Params: video id
Returns: date
```

```js
provider
  .getPublishedDate(videoId)
  .then(publishedDate => console.log(publishedDate))
  .catch(err => console.error(err));
```

### getPlayerUrl

Get the player url of the video.

```
Params: video id
Returns: String
```

```js
provider
  .getPlayerUrl(videoId)
  .then(playerUrl => console.log(playerUrl))
  .catch(err => console.error(err));
```

## How to contribute ?

Since `js-release` is included in the project, you can make a release with it:
See the changelog: `yarn release -- changelog`
make the release: `yarn release -- add <patch|minor|major>`

This will transpile the sources (`yarn build`) before creating a new release.

You can add issue, and create pull request. https://github.com/lemonde/universal-video-provider/blob/master/.github/CONTRIBUTING.md
