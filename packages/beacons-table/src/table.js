import { LitElement, html } from 'lit-element'
import '@polymer/paper-spinner/paper-spinner.js'
import '@vaadin/vaadin-grid/vaadin-grid.js'

class BeaconsTableView extends LitElement {

  constructor () {
    super()
  }

  render () {
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
      <vaadin-grid id="table" theme="row-dividers">
        <vaadin-grid-column id="idcolumn" header="UUID" path="uuid"></vaadin-grid-column>
        <vaadin-grid-column id="majorcolumn" header="MAJOR" path="major"></vaadin-grid-column>
        <vaadin-grid-column id="minorcolumn" header="MINOR" path="minor"></vaadin-grid-column>
        <vaadin-grid-column id="latitudecolumn" header="LATITUDE" path="latitude"></vaadin-grid-column>
        <vaadin-grid-column id="longitudecolumn" header="LONGITUDE" path="longitude"></vaadin-grid-column>
        <vaadin-grid-column id="locationcolumn" header="LOCATION"></vaadin-grid-column>
      </vaadin-grid>
    `
  }

  bind (beacons, filter) {
    let self = this

    self.table.items = beacons
  }

  async firstUpdated () {
    let self = this
    let root = this.shadowRoot

    self.table = root.getElementById('table')

    root.getElementById('locationcolumn').renderer = (root, grid, rowData) => {
      root.textContent = (rowData.item.location || rowData.item.address) + ' (' + rowData.item.cap + ')'
    }
  }

}

customElements.define('beacons-table', BeaconsTableView)