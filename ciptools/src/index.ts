import { cip } from './codeTransform'
import { traverse } from './fsExtension'

function transform() {
  traverse('../../content/zh', (err, files) => {
    if (err) {
      console.log('Error:', err)
    }
  
    Array.prototype.forEach.call(files, (file, _) => {
      (new cip.Code).transformFor(file)
    })
  })
}

transform()