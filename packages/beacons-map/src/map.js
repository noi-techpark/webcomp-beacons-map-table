// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
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
          overflow: hidden;
          position: relative;
        }

        #map {
          border: 0;
          box-sizing: border-box;
          height: 100%;
          overflow: hidden;
          width: 100%;
        }

        #map .leaflet-control-container {
          pointer-events: none;
        }

        #map .leaflet-control {
          pointer-events: auto;
        }

        #map .leaflet-top,
        #map .leaflet-bottom {
          z-index: 800;
        }

        #map .leaflet-top.leaflet-left {
          margin-left: 4px;
          margin-top: 4px;
        }

        #map .leaflet-control-zoom {
          border: 1px solid #d0d7de;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(16, 24, 40, 0.12);
          margin: 8px;
          overflow: hidden;
        }

        #map .leaflet-control-zoom a {
          height: 32px;
          line-height: 32px;
          width: 32px;
        }

        #map .leaflet-pane,
        #map .leaflet-control-container {
          max-width: 100%;
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

    self._lastBounds = bounds.isValid() ? bounds : null
    self._fit(true)
  }

  _fit(resetUserView) {
    let self = this

    if (resetUserView) {
      self._userAdjusted = false
    }

    if (!self.map || !self._lastBounds || !self._lastBounds.isValid()) {
      return
    }

    const container = self.map.getContainer()

    if (!container || !container.offsetWidth || !container.offsetHeight) {
      return
    }

    self.map.invalidateSize()
    self._fitting = true
    self.map.fitBounds(self._lastBounds, {
      padding: [48, 48]
    })
    self._fitting = false
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

    self._userAdjusted = false
    self._fitting = false
    self._lastBounds = null

    self.map = L.map(mapElement, {
      zoomControl: true
    }).setView([ 46.49067, 11.33982 ], 13)

    self.map.scrollWheelZoom.disable()

    self.map.on('dragstart', () => {
      if (!self._fitting) {
        self._userAdjusted = true
      }
    })

    self.map.on('zoomstart', () => {
      if (!self._fitting) {
        self._userAdjusted = true
      }
    })

    L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: ''
    }).addTo(self.map)

    self.map.addLayer(self.clusters)

    document.addEventListener('DOMContentLoaded', () => {
      self.map.invalidateSize()
    })

    self.map.invalidateSize()

    if (typeof ResizeObserver !== 'undefined') {
      self._resizeObserver = new ResizeObserver(() => {
        if (!mapElement.offsetWidth || !mapElement.offsetHeight) {
          return
        }

        self.map.invalidateSize()

        if (!self._userAdjusted) {
          self._fit(false)
        }
      })
      self._resizeObserver.observe(mapElement)
    }
  }

}

customElements.define('beacons-map', BeaconsMapView)