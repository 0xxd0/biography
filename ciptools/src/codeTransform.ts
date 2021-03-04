import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'
import { traverse } from './fsExtension'

let metaIndex = require('../res/zh-cn/index.json')
let metaMap = require('../res/en/metaMap.json')
let localizedMetaMap = require('../res/en/metaMap.json')

export namespace cip {

  export class Code {

    transformFor(file: string) {
      if (file.isDirectory() && file.isMarkdwonFile()) {
        var fileData = fs.readFileSync(file, 'utf8')
        let regex: string = '---\n([^]*?)---'
        console.log(file)
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
    }
  }
}