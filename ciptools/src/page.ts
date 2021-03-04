import * as fs from 'fs'
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent'
import { FrontMatter } from './frontMatter'
import { traverse } from './utilities'

export class Page {
  public fileURL: string
  private rawValue: string | null = null
  private modifiedData: string | null = null

  constructor(fileURL: string) {
    this.fileURL = fileURL
  }

  public static find(dir: string, callback: (err: Error | null, matches: Page[] | null) => void) {
    traverse(dir, (err, files) => {
      let pages = files
        .filter(file => file.isDirectory() && file.isMarkdwonFile())
        .map(file => new Page(file)) as Page[]
        
      callback(err, pages)
    })
  }

  public format(): Page {
    let fm = new FrontMatter(this.modifiedData!)
    fm.formatCIP()
    let dumped = fm.dump()
    this.modifiedData = this.rawValue!.replace(fm.rawValue!, dumped)
    return this
  }

  /**
   * open
   */
  public open(): Page {
    this.rawValue = fs.readFileSync(this.fileURL, 'utf8')
    this.modifiedData = this.rawValue
    return this
  }

  /**
   * save
   */
  public save(): Page {
    if (this.modifiedData !== null) {
      fs.writeFileSync(this.fileURL, this.modifiedData!)
    }
    return this
  }

  /**
   * close
   */
  public close(): Page {
    this.rawValue = null
    this.modifiedData = null
    return this
  }
}