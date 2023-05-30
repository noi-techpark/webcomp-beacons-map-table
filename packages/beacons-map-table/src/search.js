// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { LitElement, html } from 'lit-element'
import '@polymer/iron-icons/iron-icons.js'
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js'
import '@polymer/paper-icon-button/paper-icon-button.js'
import '@polymer/paper-input/paper-input.js'
import '@polymer/paper-item/paper-item.js'
import '@polymer/paper-listbox/paper-listbox.js'
import '@vaadin/vaadin-text-field/vaadin-text-field.js'
import * as geolib from 'geolib'
import 'paper-autocomplete/paper-autocomplete-suggestions.js'
import { searchLocations } from 'beacons-api'

class BeaconsSearchWidget extends LitElement {

  constructor() {
    super()
  }

  render() {
    return html`
      <style>
        #search {
          --primary-color: #29A8E0;

          display: inline-block;
          width: 280px;
        }

        #clear {
          visibility: hidden;
        }

        #radius {
          --paper-dropdown-menu-focus-color: #29A8E0;
          --paper-input-container-shared-input-style_-_padding: 4px 0;

          display: inline-block;
          margin: 0 0 0 16px;
          visibility: hidden;
          width: 80px;
        }

        #suggestions {
          --paper-item-min-height: 48px;

          left: 0;
          position: absolute;
          top: 50px;
          width: 280px;
        }
      </style>
      <paper-input id="search" label="Search beacons" no-label-float>
        <paper-icon-button id="clear" slot="suffix" icon="clear"></paper-icon-button>
      </paper-input>
      <paper-dropdown-menu id="radius" label="Search radius" no-label-float>
        <paper-listbox id="radius-values" slot="dropdown-content" selected="1">
          <paper-item>1 km</paper-item>
          <paper-item>2 km</paper-item>
          <paper-item>5 km</paper-item>
          <paper-item>10 km</paper-item>
          <paper-item>20 km</paper-item>
        </paper-listbox>
      </paper-dropdown-menu>
      <paper-autocomplete-suggestions id="suggestions" for="search" remote-source="true" text-property="text" value-property="value">
        <slot id="templates" name="autocomplete-custom-template"></slot>
      </paper-autocomplete-suggestions>
    `
  }

  createFilter() {
    let self = this
    let query = self.search.value

    if (!query || query.length < 3) {
      return null
    }

    let coordinate = null

    if (!!self.selectedLocation) {
      coordinate = {
        latitude: self.selectedLocation.lat,
        longitude: self.selectedLocation.lon
      }
    }

    if (!!coordinate) {
      let radius = 1000

      if (self.radiusValues.selected === 0) {
        radius = 1000
      }

      if (self.radiusValues.selected === 1) {
        radius = 2000
      }

      if (self.radiusValues.selected === 2) {
        radius = 5000
      }

      if (self.radiusValues.selected === 3) {
        radius = 10000
      }

      if (self.radiusValues.selected === 4) {
        radius = 20000
      }

      return {
        center: [ coordinate.latitude, coordinate.longitude ],
        radius: radius,
        fn: (beacon) => {
          return geolib.getDistance(coordinate, {
            latitude: beacon.latitude,
            longitude: beacon.longitude
          }) <= radius
        }
      }
    }

    return {
      fn: (beacon) => {
        let lookup = []
        lookup.push(beacon.uuid)
        lookup.push(beacon.major)
        lookup.push(beacon.minor)
        lookup.push(beacon.latitude)
        lookup.push(beacon.longitude)
        lookup.push(beacon.address || '')
        lookup.push(beacon.location || '')
        lookup.push(beacon.cap || '')

        return lookup.join(' ').toLowerCase().includes(query)
      }
    }
  }

  async firstUpdated() {
    let self = this
    let root = this.shadowRoot

    self.search = root.getElementById('search')
    self.radius = root.getElementById('radius')
    self.radiusValues = root.getElementById('radius-values')

    let clearButton = root.getElementById('clear')
    let suggestions = root.getElementById('suggestions')

    let mostRecentSearchAttempt = null

    self.search.addEventListener('value-changed', async () => {
      if (!!self.search.value && self.search.value.length >= 3) {
        let timestamp = (new Date()).getTime()

        mostRecentSearchAttempt = timestamp

        clearButton.style.visibility = 'visible'

        let items = await searchLocations(self.search.value)
        items = items.filter((result) => result.class === 'boundary' || result.class === 'place' || result.class === 'landuse')

        if (timestamp === mostRecentSearchAttempt) {
          if (!self.search.readonly) {
            suggestions.suggestions(items.map((item) => {
              var parts = []
              parts.push(item.address.industrial || '')
              parts.push(item.address.path || '')
              parts.push(item.address.road || '')
              parts.push(item.address.house_number || '')
              parts.push(item.address.village || '')
              parts.push(item.address.city || '')

              parts = parts.filter((part) => !!part)

              if (parts.length === 0) {
                parts.push(item.address.county || '')
                parts.push(item.address.state || '')
              }

              parts = parts.filter((part) => !!part)

              return {
                value: item,
                text: parts.join(', ')
              }
            }))
          } else {
            suggestions.hideSuggestions()
          }
        }
      } else {
        clearButton.style.visibility = 'hidden'

        suggestions.hideSuggestions()

        self.selectedLocation = null

        if (!!self.onfilter) {
          self.onfilter(null)
        }
      }
    })

    self.search.addEventListener('change', () => {
      if (!self.selectedLocation) {
        self.search.readonly = true

        suggestions.hideSuggestions()

        let coordinateMatch = self.search.value.match(/^\s*(?:(\d+(?:\.\d+)?)\s*(?:,|;)\s*(\d+(?:\.\d+)?)|(\d+(?:\,\d+)?)\s*;\s*(\d+(?:\,\d+)?))\s*$/)

        if (!!coordinateMatch) {
          let lat = parseFloat((coordinateMatch[1] || coordinateMatch[3].replace(',', '.')))
          let lng = parseFloat((coordinateMatch[2] || coordinateMatch[4].replace(',', '.')))

          self.selectedLocation = {
            lat: lat,
            lon: lng
          }

          self.search.value = lat + ', ' + lng

          self.radius.style.visibility = 'visible'

          self.search.blur()
        }

        if (!!self.onfilter) {
          self.onfilter(self.createFilter())
        }
      }
    })

    suggestions.addEventListener('autocomplete-selected', (e) => {
      let item = e.detail.value

      self.search.readonly = true
      self.search.value = item.value.display_name

      suggestions.hideSuggestions()

      self.selectedLocation = item.value

      self.radius.style.visibility = 'visible'

      if (!!self.onfilter) {
        self.onfilter(self.createFilter())
      }

      self.search.blur()
    })

    clearButton.addEventListener('click', () => {
      self.search.readonly = false
      self.search.value = ''

      self.radius.style.visibility = 'hidden'

      clearButton.style.visibility = 'hidden'

      suggestions.hideSuggestions()

      self.selectedLocation = null

      if (!!self.onfilter) {
        self.onfilter(null)
      }
    })

    self.radius.addEventListener('value-changed', () => {
      if (!!self.onfilter) {
        self.onfilter(self.createFilter())
      }
    })
  }

}

customElements.define('beacons-search', BeaconsSearchWidget)