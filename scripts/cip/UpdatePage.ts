import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import * as glob from 'glob'

var metaIndex = require('../res/en/index.json')
var metaMap = require('../res/zh-cn/metaMap.json')
var localizedMetaMap = require('../res/en/metaMap.json')

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
      let regex: string = '---\n([^]*?)---'
      let replacable = fileData.match(regex)![1]
      var yamlObject = yaml.load(replacable) as any
      
      let code = yamlObject['cip_code']
      
      if (code && code.length == 7) {
        var level3 = metaMap[code]
        var level2 = metaMap[code.substring(0, code.length - 2)]
        var level1 = metaMap[code.substring(0, code.length - 5)]
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