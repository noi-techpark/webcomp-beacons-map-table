// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement, html } from 'lit-element'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-tabs/paper-tab.js'
import '@polymer/paper-tabs/paper-tabs.js'
import { getBeacons, getNearestTourismPOI } from 'beacons-api'
import 'beacons-map'
import 'beacons-table'
import './dialog.js'
import './error-overlay.js'
import './loading-overlay.js'
import './search.js'

class BeaconsMapTableComponent extends LitElement {

  static get properties() {
    return {
      view: { attribute: 'view', type: String },
      searchSupported: { attribute: 'search', type: Boolean },
      tourismPoisSupported: { attribute: 'tourism-pois', type: Boolean }
    }
  }

  constructor() {
    super()
    this.view = 'all'
    this.searchSupported = false
    this.tourismPoisSupported = false
  }

  render() {
    return html`
      <style>
        :host {
          --paper-font-common-base_-_font-family: "Helvetica Neue", sans-serif;
          --paper-font-subhead_-_font-family: "Helvetica Neue", sans-serif;
          --paper-input-container-shared-input-style_-_font-family: "Helvetica Neue", sans-serif;

          display: block;
          min-height: 480px;
          position: relative;
          width: 100%;
        }

        :host([size="wide"]) {
          padding-top: 56.25%;
        }

        :host([size="classic"]) {
          padding-top: 75%;
        }

        :host([size="full"]) {
          padding-top: 100%;
        }

        #root {
          bottom: 0;
          display: flex;
          flex-flow: column;
          height: 100%;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          width: 100%;
        }

        beacons-map-table-loading-overlay, beacons-map-table-error-overlay {
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 2000;
        }

        #search {
          float: left;
        }

        #tabs {
          --paper-tabs-selection-bar-color: #29A8E0;
          --paper-tab-ink: #29A8E0;

          float: right;
          margin: 2px 0 0 0;
        }

        #pages {
          flex: 1;
        }

        #map, #table {
          height: 100%;
          width: 100%;
        }
      </style>
      <div id="root">
        <header id="header">
          ${!!this.searchSupported?
            html`<beacons-search id="search"></beacons-search>`:
            html``
          }
          ${!this.view || this.view === 'all' || (this.view !== 'map' && this.view !== 'table')?
            html`
            <paper-tabs id="tabs" selected="0">
              <paper-tab>MAP</paper-tab>
              <paper-tab>TABLE</paper-tab>
            </paper-tabs>
            `:
            html``
          }
        </header>
        <iron-pages selected="0" id="pages">
          ${!this.view || this.view === 'all' || (this.view !== 'map' && this.view !== 'table')?
            html`
            <beacons-map id="map"></beacons-map>
            <beacons-table id="table"></beacons-table>
            `:
            html``
          }
          ${!!this.view && this.view === 'map'?
            html`
            <beacons-map id="map"></beacons-map>
            `:
            html``
          }
          ${!!this.view && this.view === 'table'?
            html`
            <beacons-table id="table"></beacons-table>
            `:
            html``
          }
        </iron-pages>
      </div>
    `
  }

  async setupData() {
    let self = this
    let root = this.shadowRoot

    let loadingOverlay = document.createElement('beacons-map-table-loading-overlay')
    loadingOverlay.message = 'Loading beacons data...'
    loadingOverlay.fallback = { timeout: 2500, message: 'Loading beacons data, almost done...' }

    loadingOverlay.show(root)

    try {
      self.beacons = await getBeacons()

      loadingOverlay.dismiss()
    } catch (err) {
      // ignore, since we catch it later
    }

    if (!self.beacons) {
      let errorOverlay = document.createElement('beacons-map-table-error-overlay')
      errorOverlay.message = 'Ooops, an unknown error occurred while loading the required data. If the problem persists, please try again at a later time.'
      errorOverlay.action = {
        label: 'Try again',
        callback: async () => {
          errorOverlay.dismiss()
          await self.setupData()
        }
      }

      errorOverlay.show(root)
    } else {
      if (!!self.map) {
        self.map.bind(self.beacons, null)
      }

      if (!!self.table) {
        self.table.bind(self.beacons, null)
      }
    }
  }

  async showDetails(beacon) {
    let self = this
    let root = this.shadowRoot

    let loadingOverlay = null
    let tourismPoi = null

    try {
      if (!!self.tourismPoisSupported) {
        loadingOverlay = document.createElement('beacons-map-table-loading-overlay')
        loadingOverlay.message = 'Loading beacon and point-of-interest data...'
        loadingOverlay.fallback = { timeout: 2000, message: 'Loading beacon and point-of-interest data, almost done...' }

        loadingOverlay.show(root)

        tourismPoi = await getNearestTourismPOI(beacon.latitude, beacon.longitude)

        loadingOverlay.dismiss()
      }

      let dialog = document.createElement('beacons-map-table-dialog')
      dialog.beacon = beacon
      dialog.tourismPoi = tourismPoi

      root.appendChild(dialog)
    } catch (error) {
      if (!!loadingOverlay) {
        loadingOverlay.dismiss()
      }

      let errorOverlay = document.createElement('beacons-map-table-error-overlay')
      errorOverlay.message = 'Ooops, an unknown error occurred while loading the required data. If the problem persists, please try again at a later time.'
      errorOverlay.action = {
        label: 'Close',
        callback: async () => {
          errorOverlay.dismiss()
        }
      }

      errorOverlay.show(root)
    }
  }

  async firstUpdated() {
    let self = this
    let root = this.shadowRoot

    const header = root.getElementById('header')
    const search = root.getElementById('search')
    const tabs = root.getElementById('tabs')
    const pages = root.getElementById('pages')

    if (!!tabs) {
      tabs.addEventListener('iron-select', function(e) {
        if (pages.selected !== tabs.selected) {
          pages.selected = tabs.selected
        }
      })
    }

    self.map = root.getElementById('map')

    if (!!self.map) {
      self.map.ondetails = async (beacon) => {
        await self.showDetails(beacon)
      }
    }

    self.table = root.getElementById('table')

    if (!!self.table) {
      self.table.ondetails = async (beacon) => {
        await self.showDetails(beacon)
      }
    }

    await self.setupData()

    if (!!search) {
      search.onfilter = (filter) => {
        let results = self.beacons

        if (!!filter && !!filter.fn) {
          results = self.beacons.filter(filter.fn)
        }

        if (!!self.map) {
          self.map.bind(results, filter)
        }

        if (!!self.table) {
          self.table.bind(results, filter)
        }
      }
    }
  }

}

customElements.define('beacons-map-table', BeaconsMapTableComponent)