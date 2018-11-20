#!/usr/bin/env bash

const casex = require('casex')
const fs = require('fs')
const { join } = require('path')

;(async () => {
  try {
    let path = join(__dirname, '../README.md')
    let readme = fs.readFileSync(path).toString('utf8')

    let parser = /^.*?(#{2,})(.*)$/gm

    let match = parser.exec(readme)

    let headings = []

    while (match) {
      let [hashes, title] = match.slice(1)

      title = title.trim()

      headings.push({
        title,
        level: hashes.length,
        handle: casex(title, 'ca-se')
      })

      match = parser.exec(readme)
    }

    let output = ['## Table of Contents']

    headings.forEach(({ title, handle, level }) => {
      let item = ''
      while (item.length / 2 < level - 2) item += '  '
      item += `* [${title}](${handle})`
      output.push(item)
    })

    console.log()
    console.log(output.join('\n'))
    console.log()
  } catch (error) {
    console.log(error)
  }
})()
