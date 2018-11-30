# PosterVote frontend

This is the repo for the PosterVote front end source code.
It is a [VueJs](https://vuejs.org/) app written in JavaScript and deployed through [Docker](https://www.docker.com/).
It is a [PWA](https://developers.google.com/web/progressive-web-apps/)
served inside a single `index.html` file which is compiled through the
[vue cli](https://cli.vuejs.org/) using [Webpack](https://webpack.js.org/).

## Table of Contents

- [Development](/development)
  - [Scripts](/scripts)
  - [Structure](/structure)
  - [Formatting](/formatting)
  - [Other tools](/other-tools)
- [Deployment](/deployment)
  - [Building the image](/building-the-image)
  - [Using the image](/using-the-image)

## Development

### Scripts

```bash
# Install dependencies (run once after a clone)
npm install

# Run a development server
npm run serve
open http://localhost:8080

# Manually lint dependancies
npm run lint
```

### Structure

| Folder         | Use                                                          |
| -------------- | ------------------------------------------------------------ |
| public         | Static assets to be served by nginx                          |
| src            | The location of the source code                              |
| src/assets     | Assets to be compiled in with webpack                        |
| src/components | Custom Vue components                                        |
| src/services   | Custom js services to access things, i.e. the postervote api |
| src/views      | Custom Vue components to be routed to                        |
| tools          | Scripts to ease development                                  |

### Formatting

This repo uses [Prettier](https://prettier.io/) to automatically format code when you stage changes.
This means that code that is pushed is always formatted to a consistent standard.
You can manually run the formatter with `npm run prettier`.

### Other tools

```bash
# Generates sized favicons based on `public/large-icon.png`
node tools/genFavicon.js

# Generate the table of contents for this readme
node tools/markdownTOC.js
```

## Deployment

### Building the image

This project uses a [GitLab CI](https://about.gitlab.com/product/continuous-integration/)
to build a Docker image when you push a git tag.
This is designed to be used with the `npm version` command so all docker images
are semantically versioned.

```bash
npm version ... # major | minor | patch
git push --tags
```

### Using the image

With this docker image you can easily deploy it to your server using docker-compose.
This repo uses [configurable nginx](https://github.com/robb-j/configurable-nginx/)
to allow docker environment variables be set inside the JavaScript PWA.
You can set where the api is as seen below.

```yml
version: '3'

services:
  web:
    image: openlab.ncl.ac.uk:4567/poster-vote/vue-frontend:1.0.0
    restart: unless-stopped
    ports:
      - 80:80
    environment:
      - CONFIG_KEYS=API_URL
      - API_URL=https://api.postervote.example.io
```
