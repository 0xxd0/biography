import { traverse } from './utilities'

export class Page {
  public fileURL: string

  constructor(fileURL: string) {
    this.fileURL = fileURL
  }

  public static find(dir: string, callback: (err: Error | null, matches: Page[] | null) => void) {
    traverse(dir, (err, files) => {
      let pages = Array.prototype
        .filter
        .call(Array.prototype.map.call(files, (file, _) => {
          return file.isDirectory() && file.isMarkdwonFile() ? new Page(file) : null
        }), (file, _) => { 
          file != null 
        }) as Page[]

      console.log(pages)
      callback(err, pages)
    })
  }
}