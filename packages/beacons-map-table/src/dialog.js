// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement, html } from 'lit-element'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/paper-dialog/paper-dialog.js'
import '@polymer/paper-tabs/paper-tab.js'
import '@polymer/paper-tabs/paper-tabs.js'
import * as geolib from 'geolib'

class BeaconsMapTableBeaconDialog extends LitElement {

  constructor() {
    super()
  }

  render() {
    return html`
      <style>
        #dialog {
          width: 600px !important;
        }

        #tabs {
          --paper-tabs-selection-bar-color: #29A8E0;
          --paper-tab-ink: #29A8E0;

          display: inline-block;
        }

        #beacon-tab label, #poi-tab label {
          display: block;
          font-family: "Helvetica Neue", sans-serif;
          font-weight: bold;
          margin: 8px 0 0 0;
        }

        #beacon-tab span, #poi-tab span {
          display: block;
          font-family: "Helvetica Neue", sans-serif;
        }

        #beacon-tab span a, #poi-tab span a {
          color: #29A8E0;
        }
      </style>
      <paper-dialog id="dialog" with-backdrop>
        <paper-tabs id="tabs" selected="0">
          <paper-tab>BEACON</paper-tab>
          ${!!this.tourismPoi ?
            html`<paper-tab>TOURISM POI</paper-tab>`:
            html``
          }
        </paper-tabs>
        <iron-pages selected="0" id="pages">
          <div id="beacon-tab">
            <label>UUID</label>
            <span>${this.beacon.uuid}</span>
            <label>MAJOR</label>
            <span>${this.beacon.major}</span>
            <label>MINOR</label>
            <span>${this.beacon.minor}</span>
            <label>NAME</label>
            <span>${this.beacon.name}</span>
            <label>ADDRESS</label>
            <span>${!!this.beacon.address ? html`${this.beacon.address}` : html`&mdash;`}</span>
            <label>LOCATION</label>
            <span>
              ${!!this.beacon.location && !!this.beacon.cap ? html`${this.beacon.location}, ${this.beacon.cap}` : html``}
              ${!!this.beacon.location && !this.beacon.cap ? html`${this.beacon.location}` : html``}
              ${!this.beacon.location && !!this.beacon.cap ? html`${this.beacon.cap}` : html``}
              ${!this.beacon.location && !this.beacon.cap ? html`&mdash;` : html``}
            </span>
            <label>POSITION</label>
            <span>${this.beacon.latitude}, ${this.beacon.longitude}</span>
            <label>WEBSITE</label>
            <span>${!!this.beacon.website ? html`<a href="${this.beacon.website}" target="_blank">${this.beacon.website}</a>` : html`&mdash;`}</span>
          </div>
          ${!!this.tourismPoi ?
            html`
              <div id="poi-tab">
                <label>ID</label>
                <span>${this.tourismPoi.id}</span>
                <label>TYPE</label>
                <span>${this.tourismPoi.type || '&mdash;'}</span>
                <label>NAME</label>
                <span>${this.tourismPoi.name}</span>
                <label>MUNICIPALITY</label>
                <span>${this.tourismPoi.municipality || '&mdash;'}</span>
                <label>DISTRICT</label>
                <span>${this.tourismPoi.district || '&mdash;'}</span>
                <label>POSITION</label>
                ${!!this.tourismPoi.latitude && !!this.tourismPoi.longitude ? html`
                  <span>${this.tourismPoi.latitude}, ${this.tourismPoi.longitude}</span>
                ` : html`<span>&mdash;</span>`}
                <label>DISTANCE</label>
                ${!!this.tourismPoi.latitude && !!this.tourismPoi.longitude ? html`
                  <span>${geolib.getDistance(this.beacon, this.tourismPoi)} meters</span>
                ` : html`<span>&mdash;</span>`}
              </div>
            `:
            html``
          }
        </iron-pages>
      </paper-dialog>
    `
  }

  async firstUpdated() {
    let self = this
    let root = this.shadowRoot
    let tabs = root.getElementById('tabs')
    let pages = root.getElementById('pages')

    tabs.addEventListener('iron-select', function(e) {
      if (pages.selected !== tabs.selected) {
        pages.selected = tabs.selected
      }
    })

    root.getElementById('dialog').open()
  }

  dismiss() {
    this.dialog.close()
  }

}

customElements.define('beacons-map-table-dialog', BeaconsMapTableBeaconDialog)