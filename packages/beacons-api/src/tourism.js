export async function getNearestTourismPOI(latitude, longitude) {
  var url = 'https://tourism.opendatahub.bz.it/api/ODHActivityPoi?latitude={{LAT}}&longitude={{LNG}}&radius={{RDS}}'
  url = url.replace('{{LAT}}', latitude)
  url = url.replace('{{LNG}}', longitude)
  url = url.replace('{{RDS}}', 50000)

  let response = await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json'
    })
  })

  let json = await response.json()

  if (!!json.Items && json.Items.length >= 1) {
    return json.Items[0]
  }

  return null
}