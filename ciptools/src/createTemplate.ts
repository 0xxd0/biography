import * as fs from 'fs'
import * as path from 'path'

var metaIndex = require('../res/zh-cn/index.json')
var metaMap = require('../res/en/metaMap.json')
var localizedMetaMap = require('../res/en/metaMap.json')

var cipTemplate = fs.readFileSync('../../archetypes/cip.md', 'utf8')

let title = "{ %title% }"
let link = "{ %link% }"
let code = "{ %code% }"
let weight = "{ %weight% }"

Array.prototype.forEach.call(metaIndex, (i: string, _) => {
  if (i.length > 5) {
    return
  }

  let meta = metaMap[i]
  let localizedMeta = localizedMetaMap[i]

  let localizedTitle = meta.title

  let result = cipTemplate
    .replaceAll(title, localizedTitle)
    .replaceAll(code, i)
    .replaceAll(link, meta.permalink)
    .replaceAll(weight, (parseFloat(i) * 10000).toString())

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