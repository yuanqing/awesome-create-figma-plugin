import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function main () {
  const type = process.argv.slice(2)[0]
  const filePath = resolve(__dirname, '..', 'data', `${type}s.json`)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const result = data
    .slice()
    .sort(function (x, y) {
      return x.name.localeCompare(y.name)
    })
    .map(function (plugin) {
      return {
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        githubUrl: plugin.githubUrl,
        authors: plugin.authors.sort(function (x, y) {
          return x.name.localeCompare(y.name)
        })
      }
    })
  fs.writeFileSync(filePath, `${JSON.stringify(result, null, 2)}\n`)
}
main()
