import { Page } from "./page";
import * as yaml from 'js-yaml'

let metaIndex = require('../res/en/index.json')
let metaMap = require('../res/en/metaMap.json')
let localizedMetaMap = require('../res/zh-cn/metaMap.json')

export class FrontMatter {
  public static regex = '---\n([^]*?)---'
  public pairs: { [index: string]: any } | null = null
  public rawValue: string | null = null

  constructor(pageData: string) {
    let matched = pageData.match(FrontMatter.regex)

    if (!matched) { return }

    let replacable = pageData.match(FrontMatter.regex)![1]
    var object = yaml.load(replacable)
    
    this.rawValue = replacable
    this.pairs = object as { [index: string]: any }
  }

  /**
   * formatCIP
   */
  public formatCIP() {
    let code = this.pairs!['cip_code']
      
    if (code && code.length == 7) {
      var level3 = metaMap[code]
      var level2 = metaMap[code.substring(0, code.length - 2)]
      var level1 = metaMap[code.substring(0, code.length - 5)]
      let cips = [level2.code + ') ' + level2.title, level3.code + ') ' + level3.title]
      this.pairs!['cips'] = cips
    }
  }

  /**
   * dump
   */
  public dump(): string {
    return yaml.dump(this.pairs, { noArrayIndent: true })
  }
}