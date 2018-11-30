#!/usr/bin/env node

const casex = require('casex')
const fs = require('fs')
const { join } = require('path')

;(async () => {
  try {
    const path = join(__dirname, '../README.md')
    const readme = fs.readFileSync(path).toString('utf8')

    const parser = /^.*?(#{2,})(.*)$/gm

    let match = parser.exec(readme)

    const headings = []

    while (match) {
      let [hashes, title] = match.slice(1)

      title = title.trim()

      if (title !== 'Table of Contents') {
        headings.push({
          title,
          level: hashes.length,
          handle: casex(title, 'ca-se')
        })
      }

      match = parser.exec(readme)
    }

    const outputLines = ['## Table of Contents', '']

    headings.forEach(({ title, handle, level }) => {
      let item = ''
      while (item.length / 2 < level - 2) item += '  '
      item += `* [${title}](#${handle})`
      outputLines.push(item)
    })

    const output = outputLines.join('\n')

    if (process.argv.includes('inline')) {
      const replacer = /<!--\s*toc-head\s*-->([\s\S]*)<!--\s*toc-tail\s*-->/
      const toInsert = `<!-- toc-head -->\n\n${output}\n\n<!-- toc-tail -->`
      const toWrite = readme.replace(replacer, toInsert)
      fs.writeFileSync(path, toWrite)
    } else {
      console.log(`\n${output}\n`)
    }
  } catch (error) {
    console.log(error)
  }
})()
