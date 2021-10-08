import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function main () {
  const filePath = resolve(__dirname, '..', 'plugins.json')
  const plugins = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  console.log('Plugin | Description | Author | Installs')
  console.log(':--|:--|:--|:--')
  for (const {
    id,
    name,
    description,
    githubUrl,
    authorName,
    authorUrl
  } of plugins) {
    console.log(
      `[${name}](${githubUrl}) | ${description} | [${authorName}](${authorUrl}) | [![installs](https://img.shields.io/endpoint?cacheSeconds=1800&url=https://yuanqing.github.io/figma-plugins-stats/plugin/${id}/installs.json)](https://figma.com/community/plugin/${id})`
    )
  }
}
main()
