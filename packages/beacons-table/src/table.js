// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement, html } from 'lit-element'
import _ from 'lodash'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
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

        paper-icon-button {
          opacity: 0.5;
          transition: all 0.2s ease-in-out;
        }

        paper-icon-button:hover {
          color: #29A8E0;
          opacity: 1.0;
        }
      </style>
      <vaadin-grid id="table" theme="row-dividers" multi-sort>
        <vaadin-grid-column id="detailscolumn" flex-grow="0" width="72px"></vaadin-grid-column>
        <vaadin-grid-sort-column id="namecolumn" header="NAME" path="name" flex-grow="2"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column id="placecolumn" header="PLACE" path="place" flex-grow="1"></vaadin-grid-sort-column>
        <vaadin-grid-column id="idcolumn" header="UUID" path="uuid"></vaadin-grid-column>
        <vaadin-grid-sort-column id="majorcolumn" header="MAJOR" path="major" flex-grow="0" width="120px"></vaadin-grid-sort-column>
        <vaadin-grid-sort-column id="minorcolumn" header="MINOR" path="minor" flex-grow="0" width="120px"></vaadin-grid-sort-column>
        <vaadin-grid-column id="positioncolumn" header="POSITION" path="position"></vaadin-grid-column>
      </vaadin-grid>
    `
  }

  bind(beacons, filter) {
    let self = this

    if (!!beacons) {
      self.table.items = beacons.map((beacon) => {
        var place = []

        if (!!beacon.address) {
          place.push(beacon.address)
        }

        if (!!beacon.location) {
          place.push(beacon.location)
        }

        if (!!beacon.cap) {
          place.push(beacon.cap)
        }

        return _.extend({
          place: place.join(', '),
          position: beacon.latitude + ', ' + beacon.longitude
        }, _.cloneDeep(beacon))
      })
    }
  }

  async firstUpdated() {
    let self = this
    let root = this.shadowRoot

    self.table = root.getElementById('table')

    let detailsColumn = root.getElementById('detailscolumn')
    detailsColumn.renderer = (root, grid, rowData) => {
      root.innerHTML = '<paper-icon-button icon="launch" alt="Show the beacon\'s details"></paper-icon-button>'
      root.querySelector('paper-icon-button').addEventListener('click', () => ((beacon) => {
        if (!!self.ondetails) {
          self.ondetails(beacon)
        }
      })(rowData.item))
    }
  }
}

customElements.define('beacons-table', BeaconsTableView)