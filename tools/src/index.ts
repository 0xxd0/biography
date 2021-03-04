import { Page } from './page'

function format() {
  Page.find('../content/zh', (err, pages) => {
    if (err) {
      console.log('Error:', err)
    }
    pages?.forEach(page => page.open().format().save())
  })
}

format()