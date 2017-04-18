# universal-video-provider

[![Build Status](https://travis-ci.org/lemonde/universal-video-provider.svg?branch=master)](https://travis-ci.org/lemonde/universal-video-provider)

## Description

It's a video provider, which expose some basics data extracted from famous video platforms.

This lib could be used natively on server side (node) and on client side, with a client package manager as npm, webpack, ...

Basic usage :

`npm install --save universal-video-provider`

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

ES6

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
  zoneId: 34
});
```

## providerVideo API

### getProviderFromUrl

Get a specific provider from an url.

`Return:` [provider Object](https://github.com/lemonde/universal-video-provider#provider-api)

```js
const provider = videoProvider.getProviderFromUrl('http://www.youtube.com/v/ky6CRSBcf98');
```

### getVideoFromUrl

Get a video from an url.

`Return: video object`

```js
provider.getVideoFromUrl('http://www.youtube.com/v/ky6CRSBcf98')
then(video => console.log(video))
.catch(err => console.error(err));
// video is an object which contains all the extracted data
```

### getVideoFromId

Get a video from a provider and a video id.

`Return: video object`

```js
const youtubeProvider = videoProvider.getProviderFromUrl('http://www.youtube.com/v/ky6CRSBcf98');
provider.getVideoFromId(youtubeProvider, 'ky6CRSBcf98')
then(video => console.log(video))
.catch(err => console.error(err));
// video is an object which contains all the extracted data
```

### extractVideoId

Extract video id from an url, with a specific provider.

```
Return: String
```

```js
const provider = videoProvider.getProviderFromUrl('http://www.youtube.com/v/ky6CRSBcf98');
const videoId = videoProvider.extractVideoId(provider, 'http://www.youtube.com/v/ky6CRSBcf98')
// 'ky6CRSBcf98'
```

### formatDuration

Format duration returns by provider.

```
Params: duration (seconds), pattern (default: `HH:mm:ss`)
Return: String
Example: `01:10:15`
Other example: `10:20`
```

```js
const provider = videoProvider.getProviderFromUrl('http://www.youtube.com/v/ky6CRSBcf98');

provider.getDuration()
.then(duration => console.log(provider.formatDuration(duration)))
.catch(err => console.error(err));
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
  search: terms => fetch(`vimeoUrl/search/?terms=${terms}?apiKey=${this.apiKey}`)
});
```

## provider API

### getThumbnailUrl

Get the thumbnail url of the video.

```
Params: video id
Returns: String
```

```js
provider.getThumbnailUrl(videoId)
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
provider.getTitle(videoId)
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
provider.getDescription(videoId)
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
provider.getDuration(videoId)
.then(duration => console.log(duration))
.catch(err => console.error(err));
```

### getPlayerUrl

Get the player url of the video.

```
Params: video id
Returns: String
```

```js
provider.getPlayerUrl(videoId)
.then(playerUrl => console.log(playerUrl))
.catch(err => console.error(err));
```

## How to contribute ?

You can add issue, and create pull request. https://github.com/lemonde/universal-video-provider/blob/master/.github/CONTRIBUTING.md
