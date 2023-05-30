// SPDX-FileCopyrightText: NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export async function getBeacons() {
  let response = await fetch('https://api.beacon.bz.it/v1/infos', {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json'
    })
  })

  let json = await response.json()

  return json.filter(beacon => !!beacon.latitude && !!beacon.longitude)
}