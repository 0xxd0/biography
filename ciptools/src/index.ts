import { cip } from './codeTransform'
import { Page } from './page'

function transform() {
  Page.find('../content/zh', (err, pages) => {
    if (err) {
      console.log('Error:', err)
    }
  
    Array.prototype.forEach.call(pages, (page, _) => {
      (new cip.Code).transform(page.url)
    })
  })
}

transform()