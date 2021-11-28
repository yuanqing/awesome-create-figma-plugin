import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { fetchDataAsync } from './utilities/fetch-data-async.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main () {
  const type = process.argv.slice(2)[0]
  const dataFilePath = resolve(__dirname, '..', 'data', `${type}s.json`)
  const ids = JSON.parse(fs.readFileSync(dataFilePath, 'utf8')).map(function (
    item
  ) {
    return item.id
  })
  const data = await fetchDataAsync(type)
  let total = 0
  for (const item of data) {
    if (ids.indexOf(item.id) === -1) {
      continue
    }
    total += item.install_count
  }
  console.log(total.toLocaleString())
}
main()
