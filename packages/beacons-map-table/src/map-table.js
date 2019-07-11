import { LitElement, html } from 'lit-element'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/paper-spinner/paper-spinner-lite.js'
import '@polymer/paper-tabs/paper-tab.js'
import '@polymer/paper-tabs/paper-tabs.js'
import '@vaadin/vaadin-dialog/vaadin-dialog.js'
import { getBeacons, getNearestTourismPOI } from 'beacons-api'
import 'beacons-map'
import 'beacons-table'
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
          display: flex;
          flex-flow: column;
          height: 480px;
          min-height: 480px;
          position: relative;
          width: 100%;
        }

        #loader {
          background: rgba(255, 255, 255, 0.6);
          bottom: 0;
          display: none;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 2000;
        }

        #spinner {
          --paper-spinner-color: #29A8E0;
          left: 50%;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        header {
          position: relative;
        }

        #search {
          width: 240px;
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
      <div id="loader">
        <paper-spinner-lite id="spinner" active="true"></paper-spinner-lite>
      </div>
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
      <vaadin-dialog id="dialog" theme="beacon"></vaadin-dialog>
      <dom-module id="beacon-dialog-overlay-styles" theme-for="vaadin-dialog-overlay">
        <template>
          <style>
            :host([theme~="beacon"]) [part="overlay"] {
              z-index: 1000;
            }
          </style>
        </template>
      </dom-module>
    `
  }

  async firstUpdated() {
    let self = this
    let root = this.shadowRoot

    const loader = root.getElementById('loader')
    const header = root.getElementById('header')
    const search = root.getElementById('search')
    const tabs = root.getElementById('tabs')
    const pages = root.getElementById('pages')
    const dialog = root.getElementById('dialog')

    dialog.renderer = (root, dialog) => {
      let createTitle = (text) => {
        const titleElement = window.document.createElement('h4')
        titleElement.textContent = text
        titleElement.style.fontSize = '1.5em'
        titleElement.style.fontWeight = 'bold'
        titleElement.style.margin = 0

        root.appendChild(titleElement)
      }

      let createField = (id, label) => {
        const labelElement = window.document.createElement('label')
        labelElement.textContent = label
        labelElement.style.fontWeight = 'bold'

        const fieldElement = window.document.createElement('div')
        fieldElement.setAttribute('id', id)
        fieldElement.style.width = '480px'

        root.appendChild(labelElement)
        root.appendChild(fieldElement)
      }

      if (!root.firstElementChild) {
        createTitle('BEACON')
        createField('beacon-uuid', 'UUID')
        createField('beacon-major', 'MAJOR')
        createField('beacon-minor', 'MINOR')
        createField('beacon-position', 'POSITION')

        if (!!self.tourismPoisSupported) {
          root.appendChild(window.document.createElement('hr'))

          createTitle('NEAREST POI')
          createField('poi-id', 'ID')
          createField('poi-name', 'NAME')
          createField('poi-municipality', 'MUNICIPALITY')
          createField('poi-district', 'DISTRICT')
          createField('poi-position', 'POSITION')
        }
      }

      document.getElementById('beacon-uuid').textContent = dialog.beacon.uuid
      document.getElementById('beacon-major').textContent = dialog.beacon.major
      document.getElementById('beacon-minor').textContent = dialog.beacon.minor
      document.getElementById('beacon-position').textContent = dialog.beacon.latitude + ', ' + dialog.beacon.longitude

      if (!!self.tourismPoisSupported) {
        document.getElementById('poi-id').textContent = dialog.poi.Id
        document.getElementById('poi-name').textContent = dialog.poi.Shortname

        if (!!dialog.poi.LocationInfo.MunicipalityInfo) {
          document.getElementById('poi-municipality').textContent = dialog.poi.LocationInfo.MunicipalityInfo.Name.de
        } else {
          document.getElementById('poi-municipality').innerHTML = '&mdash;'
        }

        if (!!dialog.poi.LocationInfo.DistrictInfo) {
          document.getElementById('poi-district').textContent = dialog.poi.LocationInfo.DistrictInfo.Name.de
        } else {
          document.getElementById('poi-district').innerHTML = '&mdash;'
        }

        let infos = dialog.poi.GpsInfo.filter(info => info.Gpstype === 'position')

        document.getElementById('poi-position').textContent = infos[0].Latitude + ', ' + infos[0].Longitude
      }
    }

    tabs.addEventListener('iron-select', function(e) {
      if (pages.selected !== tabs.selected) {
        pages.selected = tabs.selected
      }
    })

    self.map = root.getElementById('map')

    if (!!self.map) {
      self.map.ondetails = async (beacon) => {
        dialog.beacon = beacon

        if (!!self.tourismPoisSupported) {
          loader.style.display = 'block'

          dialog.poi = await getNearestTourismPOI(beacon.latitude, beacon.longitude)

          loader.style.display = 'none'
        }

        dialog.opened = true
      }
    }

    self.table = root.getElementById('table')

    loader.style.display = 'block'
    header.style.visibility = 'hidden'
    pages.style.visibility = 'hidden'

    self.beacons = await getBeacons()

    if (!!self.map) {
      self.map.bind(self.beacons)
    }

    if (!!self.table) {
      self.table.bind(self.beacons)
    }

    if (!!search) {
      search.beacons = self.beacons
      search.onsearch = (beacons) => {
        if (!!self.map) {
          self.map.bind(beacons)
        }

        if (!!self.table) {
          self.table.bind(beacons)
        }
      }
    }

    loader.style.display = 'none'
    header.style.visibility = 'visible'
    pages.style.visibility = 'visible'
  }

}

customElements.define('beacons-map-table', BeaconsMapTableComponent)