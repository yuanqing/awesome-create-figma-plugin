import fs from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

function main () {
  const type = process.argv.slice(2)[0]
  const filePath = resolve(__dirname, '..', 'data', `${type}s.json`)
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'))
  console.log(
    `*${data.length} ${type}s by ${countAuthors(data)} authors*`
  )
  console.log('')
  console.log('Name | Description | Author')
  console.log(':--|:--|:--')
  for (const { id, name, description, githubUrl, authors } of data) {
    const formattedName = `[**${name}**](https://figma.com/community/${type}/${id})${
      githubUrl === null ? '' : ` [(GitHub)](${githubUrl})`
    }`
    const formattedAuthors = authors
      .map(function ({ name, url }) {
        return `[${name}](${url})`
      })
      .join(', ')
    console.log(`${formattedName} | ${description} | ${formattedAuthors}`)
  }
}
main()

function countAuthors (data) {
  const authorNames = {}
  for (const { authors } of data) {
    for (const { name } of authors) {
      authorNames[name] = true
    }
  }
  return Object.keys(authorNames).length
}
