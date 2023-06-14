<!--
SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>

SPDX-License-Identifier: CC0-1.0
-->

# Beacons Map/Table Webcomponent

![REUSE Compliance](https://github.com/noi-techpark/webcomp-beacons-map-table/actions/workflows/reuse.yml/badge.svg)
[![CI](https://github.com/noi-techpark/webcomp-beacons-map-table/actions/workflows/main.yml/badge.svg)](https://github.com/noi-techpark/webcomp-beacons-map-table/actions/workflows/main.yml)

The following web-component exposes the data collected and maintained for the
"[BEACON SÜDTIROL - ALTO ADIGE](https://beacon.bz.it)" project coupled together
with the tourism data from "[OPENDATHUB](https://tourism.opendatahub.com)".

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

Do you want to see it in action? Go to our [web component store](https://webcomponents.opendatahub.com/webcomponent/2e117771-7047-4e26-b313-8b1a315ae75f)!

## Table of contents

- [Usage](#usage)
- [Gettings started](#getting-started)
- [Deployment](#deployment)
- [Docker environment](#docker-environment)
- [Information](#information)

## Usage

Include the Javascript file `dist/beacon-map-table.min.js` in your HTML and define the web component like this:

```html
<beacons-map-table view="all"></beacons-map-table>
```

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

## Getting started

These instructions will get you a copy of the project up and running
on your local machine for development and testing purposes.

### Prerequisites

To build the project, the following prerequisites must be met:

- Node 12 / NPM 8.1.2

For a ready to use Docker environment with all prerequisites already installed and prepared, you can check out the [Docker environment](#docker-environment) section.

### Source code

Get a copy of the repository:

```bash
git clone https://github.com/noi-techpark/webcomp-beacons-map-table.git
```

Change directory:

```bash
cd webcomp-beacons-map-table/
```

### Dependencies

Download all dependencies:

```bash
npm install
```

### Build

Build and start the project:

```bash
npm run serve
```

The application will be served and can be accessed at [http://localhost:80080](http://localhost:80080).

## Deployment

To create the distributable files, execute the following command:

```bash
npm run build
```

## Docker environment

For the project a Docker environment is already prepared and ready to use with all necessary prerequisites.

These Docker containers are the same as used by the continuous integration servers.

### Installation

Install [Docker](https://docs.docker.com/install/) (with Docker Compose) locally on your machine.

### Dependenices

First, install all dependencies:

```bash
docker-compose run --rm app /bin/bash -c "npm install"
```

### Start and stop the containers

Before start working you have to start the Docker containers:

```
docker-compose up --build --detach
```

After finished working you can stop the Docker containers:

```
docker-compose stop
```

### Running commands inside the container

When the containers are running, you can execute any command inside the environment. Just replace the dots `...` in the following example with the command you wish to execute:

```bash
docker-compose run --rm app /bin/bash -c "..."
```

Some examples are:

```bash
docker-compose run --rm app /bin/bash -c "npm run build"
```

## Information

### Support

For support, please contact [info@opendatahub.com](mailto:info@opendatahub.com).

### Contributing

If you'd like to contribute, please follow the Contributor Guidelines that can be found at [https://github.com/noi-techpark/odh-docs/wiki/Contributor-Guidelines%3A-Getting-started](https://github.com/noi-techpark/odh-docs/wiki/Contributor-Guidelines%3A-Getting-started).

### Documentation

More documentation can be found at [https://opendatahub.readthedocs.io/en/latest/index.html](https://opendatahub.readthedocs.io/en/latest/index.html).

### Boilerplate

The project uses this boilerplate: [https://github.com/noi-techpark/webcomp-boilerplate](https://github.com/noi-techpark/webcomp-boilerplate).

### License

The code in this project is licensed under the GNU AFFERO GENERAL PUBLIC LICENSE Version 3 license. See the [LICENSE.md](LICENSE.md) file for more information.

### REUSE

This project is [REUSE](https://reuse.software) compliant, more information about the usage of REUSE in NOI Techpark repositories can be found [here](https://github.com/noi-techpark/odh-docs/wiki/Guidelines-for-developers-and-licenses#guidelines-for-contributors-and-new-developers).

Since the CI for this project checks for REUSE compliance you might find it useful to use a pre-commit hook checking for REUSE compliance locally. The [pre-commit-config](.pre-commit-config.yaml) file in the repository root is already configured to check for REUSE compliance with help of the [pre-commit](https://pre-commit.com) tool.

Install the tool by running:
```bash
pip install pre-commit
```
Then install the pre-commit hook via the config file by running:
```bash
pre-commit install
```

