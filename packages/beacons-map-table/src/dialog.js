// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement, html } from 'lit-element'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/iron-pages/iron-pages.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
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
        :host {
          bottom: 0;
          display: block;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 1500;
        }

        #backdrop {
          background: rgba(0, 0, 0, 0.35);
          bottom: 0;
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        #panel {
          background: #ffffff;
          border: 1px solid #d0d7de;
          border-radius: 8px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          left: 50%;
          max-height: calc(100% - 24px);
          max-width: min(560px, calc(100% - 24px));
          overflow: hidden;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
        }

        #header {
          align-items: center;
          border-bottom: 1px solid #e6e8eb;
          display: flex;
          flex-shrink: 0;
          justify-content: space-between;
          padding: 4px 4px 0 8px;
        }

        #tabs {
          --paper-tabs-selection-bar-color: #29A8E0;
          --paper-tab-ink: #29A8E0;

          flex: 1;
          min-width: 0;
        }

        #close {
          color: #555555;
          flex-shrink: 0;
        }

        #pages {
          box-sizing: border-box;
          flex: 1;
          overflow: auto;
          padding: 8px 16px 16px;
          -webkit-overflow-scrolling: touch;
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
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        #beacon-tab span a, #poi-tab span a {
          color: #29A8E0;
        }
      </style>
      <div id="backdrop"></div>
      <div id="panel" role="dialog" aria-modal="true">
        <div id="header">
          <paper-tabs id="tabs" selected="0">
            <paper-tab>BEACON</paper-tab>
            ${!!this.tourismPoi ?
              html`<paper-tab>TOURISM POI</paper-tab>`:
              html``
            }
          </paper-tabs>
          <paper-icon-button id="close" icon="close" title="Close" aria-label="Close details"></paper-icon-button>
        </div>
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
      </div>
    `
  }

  async firstUpdated() {
    let self = this
    let root = this.shadowRoot
    let tabs = root.getElementById('tabs')
    let pages = root.getElementById('pages')
    let backdrop = root.getElementById('backdrop')
    let close = root.getElementById('close')

    tabs.addEventListener('iron-select', function(e) {
      if (pages.selected !== tabs.selected) {
        pages.selected = tabs.selected
      }
    })

    backdrop.addEventListener('click', () => {
      self.dismiss()
    })

    close.addEventListener('click', () => {
      self.dismiss()
    })

    self._onKeyDown = (event) => {
      if (event.key === 'Escape') {
        self.dismiss()
      }
    }

    document.addEventListener('keydown', self._onKeyDown)
  }

  dismiss() {
    if (this._onKeyDown) {
      document.removeEventListener('keydown', this._onKeyDown)
      this._onKeyDown = null
    }

    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }

}

customElements.define('beacons-map-table-dialog', BeaconsMapTableBeaconDialog)
