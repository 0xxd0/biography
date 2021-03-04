import { Page } from './page'

function transform() {
  Page.find('../content/zh', (err, pages) => {
    if (err) {
      console.log('Error:', err)
    }
    pages?.forEach(page => page.open().adjustFrontMatter().save())
  })
}

transform()