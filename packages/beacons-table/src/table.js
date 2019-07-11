import { LitElement, html } from 'lit-element'
import _ from 'lodash'
import '@polymer/paper-spinner/paper-spinner.js'
import '@vaadin/vaadin-grid/vaadin-grid.js'
import '@vaadin/vaadin-grid/vaadin-grid-sort-column.js'

class BeaconsTableView extends LitElement {

  constructor() {
    super()
  }

  render() {
    return html`
      <style>
        :host {
          height: 100%;
          width: 100%;
        }

        #table {
          height: 100%;
          width: 100%;
        }
      </style>
      <vaadin-grid id="table" theme="row-dividers" multi-sort>
        <vaadin-grid-column id="idcolumn" header="UUID" path="uuid"></vaadin-grid-column>
        <vaadin-grid-sort-column id="majorcolumn" header="MAJOR" path="major"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column id="minorcolumn" header="MINOR" path="minor"></vaadin-grid-sort-column>
        <vaadin-grid-column id="latitudecolumn" header="LATITUDE" path="latitude"></vaadin-grid-column>
        <vaadin-grid-column id="longitudecolumn" header="LONGITUDE" path="longitude"></vaadin-grid-column>
        <vaadin-grid-sort-column id="locationcolumn" header="LOCATION" path="composedLocation"></vaadin-grid-sort-column>
      </vaadin-grid>
    `
  }

  bind(beacons, filter) {
    let self = this

    self.table.items = beacons.map((beacon) => {
      return _.extend({
        composedLocation: (beacon.location || beacon.address) + ' (' + beacon.cap + ')'
      }, _.cloneDeep(beacon))
    })
  }

  async firstUpdated() {
    let self = this
    let root = this.shadowRoot

    self.table = root.getElementById('table')
  }

}

customElements.define('beacons-table', BeaconsTableView)