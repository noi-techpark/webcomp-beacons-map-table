// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement, html } from 'lit-element'
import '@polymer/paper-spinner/paper-spinner-lite.js'

class BeaconsMapTableLoadingOverlay extends LitElement {

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
          box-sizing: border-box;
          left: 50%;
          max-width: calc(100% - 32px);
          padding: 16px;
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 480px;
        }

        paper-spinner-lite {
          --paper-spinner-color: #29A8E0;
          display: block;
          margin: 24px auto;
        }

        #message {
          font-family: 'Helvetica Neue', sans-serif;
          line-height: 1.4;
          overflow-wrap: anywhere;
          text-align: center;
        }
      </style>
      <div id="container">
        <div id="contents">
          <paper-spinner-lite id="spinner" active="true"></paper-spinner-lite>
          <div id="message">${this.message}</div>
        </div>
      </div>
    `
  }

  async firstUpdated() {
    let self = this
    let message = self.shadowRoot.getElementById('message')

    if (!!self.fallback) {
      self.fallbackTimeout = setTimeout(() => {
        message.textContent = self.fallback.message
      }, self.fallback.timeout)
    }
  }

  show(parent) {
    parent.appendChild(this)
  }

  dismiss() {
    this.parentNode.removeChild(this)

    if (!!this.fallbackTimeout) {
      clearTimeout(this.fallbackTimeout)
    }
  }

}

customElements.define('beacons-map-table-loading-overlay', BeaconsMapTableLoadingOverlay)