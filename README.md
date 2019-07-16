# BEACONS MAP/TABLE WEBCOMPONENT

The following web-component exposes the data collected and maintained for the
"[BEACON SÜDTIROL - ALTO ADIGE](https://beacon.bz.it)" project coupled together
with the tourism data from "[OPENDATHUB](https://tourism.opendatahub.bz.it)".

## Overview

The web-components in this project are built on top of [Polymer's
LitElement](https://lit-element.polymer-project.org) and other UI elements and
framework ([Leaflet](https://leafletjs.com),
[OpenstreetMap](https://www.openstreetmap.org/), [VAADIN
Components](https://vaadin.com/components)). The project is organised and
managed by [NPM](https://www.npmjs.com), the build process is powered mainly by
[Lerna](https://github.com/lerna/lerna) and [Webpack](https://webpack.js.org).

The `beacons-map-table` web-component shows all beacon devices, using a map or a
table view, deployed in the region and can optionally associate them to the
nearest point-of-interest.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
#### Table of Contents

- [Getting started](#getting-started)
  - [Docker Compose](#docker-compose)
  - [Prerequisites](#prerequisites)
  - [Setup](#setup)
  - [Building](#building)
  - [Preview](#preview)
- [Usage](#usage)
  - [Attributes](#attributes)
    - [view](#view)
    - [search](#search)
    - [tourism-pois](#tourism-pois)
- [Authors](#authors)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Getting started

### Docker Compose
This is an optional step. You can test it also with
[docker-compose](https://docs.docker.com/compose/) if you like.

Run `docker-compose up` to start the web server. Then, execute the following
commands to install the [dependencies](#setup) and, if you change something,
[rebuild](#building) the web component with the second command:

    docker-compose run --rm app ./bin/setup.sh
    docker-compose run --rm app ./bin/build.sh


### Prerequisites

In order to work on the project, you'll just need a recent and working
installation of Node and NPM, the rest of the tools will be installed
automatically in the project's scope.

### Setup

This step is required and will install all required software and tools in the
project folder. This needs to be run just once and must be repeated in case of
relevant changes to the overall project structure.

    bin/setup.sh

### Building

Building the project will yield the distributable components in the `dist`
folder, namely `beacons-map-table.min.js`.

    bin/build.sh

### Preview

The built components can be previewed and evaluated using a built-in server at
the address [http://0.0.0.0:8000](http://0.0.0.0:8000).

    bin/serve.sh

## Usage

You can download the packaged/build components and include them in your website
or link the resources directly by means of a CDN service. For that, we use
[jsDelivr](https://www.jsdelivr.com/?docs=gh), which takes our dist-files
directly from our GitHub repository.

    <!-- include self-hosted component -->
    <script src="./js/beacons-map-table.min.js"></script>

    <!-- include from CDN -->
    <script src="https://cdn.jsdelivr.net/gh/noi-techpark/webcomp-beacons-map-table@master/dist/beacons-map-table.min.js"></script>

Once the component is correctly included, the following custom tag can be used

    <beacons-map-table view="map" search />

### Attributes

#### view

The view attribute can take the following values: `all` (default), `map`,
`table` and determines how with which view the beacons are shown.

#### size

This attribute is useful for sizing the height of the component based on a ratio on the width of the component's container. The following values can be specified

* `wide` (16:9 ratio)
* `classic` (4:3 ratio)
* `full` (1:1 ratio, as high as wide)

If not specified, you'll be responsible for setting the height of the component as you see fit. To ensure the usability of the component, a minimum height is enforced.

#### search

This boolean attribute determines if the search functionality should be enabled
or not (default).

#### tourism-pois

This boolean attribute determines if the integration with Opendatahub's Tourism
data should be enabled or not (default).

## Authors

* Daniel Rampanelli [hello@danielrampanelli.com](mailto:hello@danielrampanelli.com)

## License

See LICENSE.md