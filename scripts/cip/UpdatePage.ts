import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import * as glob from 'glob'

var metaDataIndex = require('../res/metaDataIndex.json')
var metaDataEN = require('../res/metaDataEN.json')
var metaDataCN = require('../res/metaDataCN.json')

function traverse(path: string, callback: (err: Error | null, matches: string[]) => void) {
  glob.glob(path + '/**/*', callback)
}

traverse('../../content/zh', (err, files) => {
  if (err) {
    console.log('Error', err)
  }

  Array.prototype.forEach.call(files, (file, _) => {
    if (!fs.statSync(file).isDirectory() && path.extname(file) == '.md') {
      var fileData = fs.readFileSync(file, 'utf8')
      let regex: string = '---([^]*?)---'
      let replacable = fileData.match(regex)![1]
      var yamlObject = yaml.load(replacable) as any
      
      let code = yamlObject['cip_code']
      if (code && code.length == 7) {
        var level3 = metaDataEN[code]
        var level2 = metaDataEN[code.substring(0, code.length - 2)]
        var level1 = metaDataEN[code.substring(0, code.length - 5)]
        let cips = [level2.code + ') ' + level2.title, level3.code + ') ' + level3.title]
        yamlObject['cips'] = cips

        let dumped = yaml.dump(yamlObject, { 
          noArrayIndent: true
        })

        let modifiedData = fileData.replace(replacable, dumped)
        fs.writeFileSync(file, modifiedData)
      }
    }
  })
})

// Array.prototype.forEach.call(metaDataIndex, (i, _) => {
//   if (i.length > 5) {
//     return
//   }

//   let metaEN = metaDataEN[i]
//   let metaCN = metaDataCN[i]

//   let localizedTitle = metaEN.title

//   let result = cipTemplate
//     .replaceAll(title, localizedTitle)
//     .replaceAll(code, i)
//     .replaceAll(link, metaEN.permalink)
//     .replaceAll(weight, parseFloat(i) * 10000)

//   let name = i + " " + localizedTitle
//   let filename = name.substring(0, name.length - 1)
//     .replaceAll("/", "-")
//     .replaceAll(" ", "-")
//     .toLocaleLowerCase()

//   let filepath = path.join(__dirname, '../../content/zh/cips/', filename)

//   if (fs.existsSync(filepath)) {
//     fs.rmdirSync(filepath, { recursive: true })
//   } 
//   fs.mkdirSync(filepath, { recursive: true })
    
//   fs.writeFileSync(path.join(filepath, '_index.md'), result)
// })