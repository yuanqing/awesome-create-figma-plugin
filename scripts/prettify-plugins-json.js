import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function main () {
  const filePath = resolve(__dirname, '..', 'plugins.json')
  const plugins = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  const result = plugins.slice().sort(function (x, y) {
    return x.name.localeCompare(y.name)
  }).map(function (plugin) {
    return {
      id: plugin.id,
      name: plugin.name,
      description: plugin.description,
      githubUrl: plugin.githubUrl,
      authorName: plugin.authorName,
      authorUrl: plugin.authorUrl
    }
  })
  fs.writeFileSync(filePath, `${JSON.stringify(result, null, 2)}\n`)
}
main()
