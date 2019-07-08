import { LitElement, html } from 'lit-element'
import '@vaadin/vaadin-text-field/vaadin-text-field.js'
import 'geolib/lib/index'

class BeaconsSearchWidget extends LitElement {

  constructor() {
    super()
  }

  render() {
    return html`
      <style>
        #search {
          width: 280px;
        }
      </style>
      <vaadin-text-field id="search" placeholder="Search" clear-button-visible></vaadin-text-field>
    `
  }

  searchBeacons(query) {
    let self = this
    let normalizedQuery = query.trim().toLowerCase()

    if (!!normalizedQuery) {
      var latLngQuery = normalizedQuery.match(/^(?:(\d+(?:\.\d+)?)\s*(?:,|;)\s*(\d+(?:\.\d+)?)\s*(?:,|;)\s*(\d+)|(\d+(?:\,\d+)?)\s*;\s*(\d+(?:\,\d+)?)\s*;\s*(\d+))$/)
      if (!!latLngQuery) {
        let latitude = parseFloat((latLngQuery[1] || latLngQuery[4].replace(',', '.')))
        let longitude = parseFloat((latLngQuery[2] || latLngQuery[5].replace(',', '.')))
        let radius = parseInt(latLngQuery[3] || latLngQuery[6])

        return self.beacons.filter((beacon) => {
          let distance = geolib.getDistance({
            latitude: latitude,
            longitude: longitude
          }, {
            latitude: beacon.latitude,
            longitude: beacon.longitude
          })

          return distance <= (radius * 1000)
        })
      } else if (normalizedQuery.length >= 3) {
        return self.beacons.filter((beacon) => {
          var lookup = []
          lookup.push(beacon.uuid)
          lookup.push(beacon.major)
          lookup.push(beacon.minor)
          lookup.push(beacon.latitude)
          lookup.push(beacon.longitude)
          lookup.push(beacon.address || '')
          lookup.push(beacon.location || '')
          lookup.push(beacon.cap || '')

          return lookup.join(' ').toLowerCase().includes(query)
        })
      }
    }

    return null
  }

  async firstUpdated() {
    let self = this
    let root = this.shadowRoot

    const search = root.getElementById('search')

    self.beacons = []

    search.onchange = () => {
      let results = self.searchBeacons(search.value)

      if (!!self.onsearch) {
        if (!!results) {
          self.onsearch(results)
        } else {
          self.onsearch(self.beacons)
        }
      }
    }
  }

}

customElements.define('beacons-search', BeaconsSearchWidget)