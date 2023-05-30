// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement, html } from 'lit-element'
import '@polymer/paper-button/paper-button.js'

class BeaconsMapTableErrorOverlay extends LitElement {

  constructor() {
    super()
  }

  render() {
    return html`
      <style>
        :host {
          background: rgba(255, 255, 255, 0.85);
          display: block;
        }

        #contents {
          left: 50%;
          max-width: 480px;
          padding: 16px;
          position: absolute;
          text-align: center;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        #message {
          font-family: 'Helvetica Neue', sans-serif;
          text-align: center;
        }

        #action {
          background-color: #29A8E0;
          color: white;
          margin: 16px auto;
        }
      </style>
      <div id="container">
        <div id="contents">
          <div id="message">${this.message}</div>
          ${!!this.action?
            html`<paper-button id="action" raised>${this.action.label}</paper-button>`:
            html``
          }
        </div>
      </div>
    `
  }

  async firstUpdated() {
    let self = this

    if (!!self.action) {
      self.shadowRoot.getElementById('action').addEventListener('click', self.action.callback)
    }
  }

  show(parent) {
    parent.appendChild(this)
  }

  dismiss() {
    this.parentNode.removeChild(this)
  }

}

customElements.define('beacons-map-table-error-overlay', BeaconsMapTableErrorOverlay)