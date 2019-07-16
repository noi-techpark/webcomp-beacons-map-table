export async function searchLocations(query) {
  var url = 'https://nominatim.openstreetmap.org/search?q={{QUERY}}&viewbox=10.3817965,46.2197712,12.4779407,47.0921462&bounded=1&addressdetails=1&format=json'
  url = url.replace('{{QUERY}}', encodeURI(query))

  let response = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json'
    })
  })

  let json = await response.json()

  return json
}