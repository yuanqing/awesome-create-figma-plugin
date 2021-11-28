import fetch from 'node-fetch'

export async function fetchDataAsync (type) {
  let result = []
  let url = `https://www.figma.com/api/${type}s/browse?sort_by=popular&sort_order=desc&resource_type=${type}s&page_size=50`
  while (typeof url !== 'undefined') {
    const response = await fetch(url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    })
    const json = await response.json()
    result = result.concat(json.meta[`${type}s`])
    url = json.pagination.next_page
  }
  return deduplicateArray(result)
}

function deduplicateArray (data) {
  const result = []
  const ids = {}
  for (const item of data) {
    const id = item.id
    if (ids[id] !== true) {
      result.push(item)
      ids[id] = true
    }
  }
  return result
}
