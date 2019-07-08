export async function getBeacons() {
  let response = await fetch('https://api.allorigins.win/get?url=' + 'https://api.beacon.bz.it/v1/infos', {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json'
    })
  })

  let proxyResponse = await response.json()
  let json = JSON.parse(proxyResponse.contents)

  return json.filter(beacon => !!beacon.latitude && !!beacon.longitude && (!!beacon.address || !!beacon.location))
}