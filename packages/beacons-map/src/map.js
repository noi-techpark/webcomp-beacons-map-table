// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement, html } from 'lit-element'
import L from 'leaflet'
import LeafletMarkerCluster from 'leaflet.markercluster'

import styles__leaflet from 'leaflet/dist/leaflet.css'
import styles__leaflet_marker_cluster from 'leaflet.markercluster/dist/MarkerCluster.css'
import assets__marker_default from './marker-default.svg'

class BeaconsMapView extends LitElement {

  constructor() {
    super()
  }

  render() {
    return html`
      <style>
        ${styles__leaflet[0][1]}
        ${styles__leaflet_marker_cluster}

        :host {
          display: block;
          height: 100%;
          position: relative;
          z-index: 100;
        }

        #map {
          height: 100%;
          z-index: 500;
        }

        #map .marker-cluster {
          background-clip: padding-box;
          background-color: #ffffff;
          background-color: rgba(255, 255, 255, 0.75);
          border-radius: 20px;
        }

        #map .marker-cluster div {
          background-color: #29A8E0;
          border-radius: 15px;
          height: 30px;
          margin-left: 5px;
          margin-top: 5px;
          text-align: center;
          width: 30px;
        }

        #map .marker-cluster span {
          color: #ffffff;
          font-family: 'Helvetica Neue', sans-serif;
          line-height: 30px;
        }
      </style>
      <div id="map"></div>
    `
  }

  bind(beacons, filter) {
    let self = this

    for (var id in self.overlays) {
      self.map.removeLayer(self.overlays[id])
    }

    for (var id in self.markers) {
      self.clusters.removeLayer(self.markers[id])
    }

    self.overlays = []
    self.markers = []

    const bounds = L.latLngBounds()

    if (!!filter && !!filter.center && !!filter.radius) {
      let circle = L.circle(filter.center, {
        radius: filter.radius,
        color: '#29A8E0',
        fill: '#29A8E0'
      }).addTo(self.map)

      bounds.extend(circle.getBounds())

      self.overlays.push(circle)
    }

    if (!!beacons) {
      beacons.forEach((beacon) => {
        let marker = L.marker([ beacon.latitude, beacon.longitude ], {
          icon: L.icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(assets__marker_default),
            iconSize: [24, 24],
            iconAnchor: [12, 24]
          }),
          title: beacon.name
        }).on('click', () => ((beacon) => {
          if (!!self.ondetails) {
            self.ondetails(beacon)
          }
        })(beacon))

        self.clusters.addLayer(marker)

        bounds.extend(marker.getLatLng())

        self.markers.push(marker)
      })
    }

    self.map.invalidateSize()

    if (bounds.isValid()) {
      self.map.fitBounds(bounds, {
        padding: [32, 32]
      })
    }
  }

  async firstUpdated() {
    let self = this
    let root = this.shadowRoot

    const mapElement = root.getElementById('map')

    self.overlays = []
    self.markers = []

    self.clusters = L.markerClusterGroup({
      disableClusteringAtZoom: 12,
      maxClusterRadius: 32,
      showCoverageOnHover: false
    })

    self.map = L.map(mapElement, {
      zoomControl: true
    }).setView([ 46.49067, 11.33982 ], 13)

    self.map.scrollWheelZoom.disable()

    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(self.map)

    self.map.addLayer(self.clusters)

    document.addEventListener('DOMContentLoaded', () => {
      self.map.invalidateSize()
    })

    self.map.invalidateSize()
  }

}

customElements.define('beacons-map', BeaconsMapView)