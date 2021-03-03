const fs = require('fs')
const path = require("path")
const _ = require('./string')

var metaDataIndex = require('./metaDataIndex.json')
var metaDataEN = require('./metaDataEN.json')
var metaDataCN = require('./metaDataCN.json')

var cipTemplate = fs.readFileSync('../../archetypes/cip.md', 'utf8')

let title = "{ %title% }"
let link = "{ %link% }"
let code = "{ %code% }"
let weight = "{ %weight% }"

Array.prototype.forEach.call(metaDataIndex, (i, _) => {
  if (i.length > 5) {
    return
  }

  let metaEN = metaDataEN[i]
  let metaCN = metaDataCN[i]

  let localizedTitle = metaEN.title

  let result = cipTemplate
    .replaceAll(title, localizedTitle)
    .replaceAll(code, i)
    .replaceAll(link, metaEN.permalink)
    .replaceAll(weight, parseFloat(i) * 10000)

  let name = i + " " + localizedTitle
  let filename = name.substring(0, name.length - 1)
    .replaceAll("/", "-")
    .replaceAll(" ", "-")
    .toLocaleLowerCase()

  let filepath = path.join(__dirname, '../../content/zh/cips/', filename)

  if (fs.existsSync(filepath)) {
    fs.rmdirSync(filepath, { recursive: true })
  } 
  fs.mkdirSync(filepath, { recursive: true })
    
  fs.writeFileSync(path.join(filepath, '_index.md'), result)
})