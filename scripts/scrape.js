import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { fetchDataAsync } from './utilities/fetch-data-async.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main () {
  const type = process.argv.slice(2)[0]
  const filePath = resolve(__dirname, '..', 'data', `${type}s.json`)
  const validIds = JSON.parse(fs.readFileSync(filePath, 'utf8')).map(function (
    item
  ) {
    return item.id
  })
  const invalidIdsFilePath = resolve(
    __dirname,
    '..',
    'data',
    'invalid-ids',
    `${type}s.json`
  )
  const invalidIds = JSON.parse(fs.readFileSync(invalidIdsFilePath, 'utf8'))
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
    console.log(`https://figma.com/community/${type}/${item.id}`)
  }
}
main()
