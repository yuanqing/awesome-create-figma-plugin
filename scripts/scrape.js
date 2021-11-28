import fs from 'fs'
import fetch from 'node-fetch'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const invalidPluginIds = [
  '740272380439725040',
  '744047966581015514',
  '768105866232801306',
  '775671607185029020',
  '776756033372000327',
  '777817104312450242',
  '784879032180068427',
  '791103617505812222',
  '803311677045533625',
  '807925991544813159',
  '811341846366740536',
  '814814551050457760',
  '815841134222084922',
  '835161939850128207',
  '837733390949354788',
  '841201477778898873',
  '865232148477039928',
  '865691094985831837',
  '867577812066716451',
  '875360070957047154',
  '876119978690687541',
  '893426972424060133',
  '893898815372491269',
  '927255248672920500',
  '944265482632468770',
  '946331910305469316',
  '946462257210461125',
  '951438743886938495',
  '953656637827255284',
  '954324466119518433',
  '955147178019033535',
  '966753973971133461',
  '978809605092434948',
  '1000963812142874727',
  '1010864160468009465',
  '1013391800762935476',
  '1036619416000610898'
]
const invalidWidgetIds = []

async function main () {
  await scrape('plugin', invalidPluginIds)
  await scrape('widget', invalidWidgetIds)
}

async function scrape (type, invalidIds) {
  const dataFilePath = resolve(__dirname, '..', 'data', `${type}s.json`)
  const validIds = JSON.parse(fs.readFileSync(dataFilePath, 'utf8')).map(
    function (item) {
      return item.id
    }
  )
  const data = await fetchDataAsync(type)
  for (const item of data) {
    const manifest = Object.values(item.versions)[0].manifest
    if (manifest.main !== 'build/main.js' && manifest.ui !== 'build/ui.js') {
      continue
    }
    if (
      validIds.indexOf(item.id) !== -1 ||
      invalidIds.indexOf(item.id) !== -1
    ) {
      continue
    }
    console.log(`https://figma.com/community/${type}/${item.id}/`)
  }
}
main()

async function fetchDataAsync (type) {
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
