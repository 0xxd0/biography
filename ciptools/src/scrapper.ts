// from https://nces.ed.gov/ipeds/cipcode/browse.aspx?y=56
let rootId = "tree_ul_section_0"

function scrapMetadataForEN() {
  let objects = Array.prototype.map.call(document.getElementById(rootId)!.getElementsByTagName("li"), (element, _) => {
    let e = element.getElementsByTagName("a")[0]
    let href = e.href
    let text = e.text

    let splited = text.split(") ")
    let code = splited[0]
    let title = splited[1]

    let truncatedTitle = title.slice(0, -1)
    let reg = /cipid=(\d*)/
    let permalink = href.replace(reg, "cip=" + code)

    return {
      "code": code,
      "title": truncatedTitle,
      "permalink": permalink
    }
  })

  var index = {} as any
  Array.prototype.forEach.call(objects, (element, _) => {
    let code = element["code"]
    index[code] = element
  })

  return index
}

// from https://nces.ed.gov/ipeds/cipcode/browse.aspx?y=56
function scrapMetadataForCN() {
  let objects = Array.prototype.map.call(document.getElementById(rootId)!.getElementsByTagName("li"), (element, index) => {
    let e = element.getElementsByTagName("a")[0]

    let href = e.href
    let text = e.text

    let splited = text.split("）")
    let code = splited[0]
    let title = splited[1]

    let truncatedTitle = title.slice(0, -1)
    let reg = /cipid=(\d*)/
    let permalink = href.replace(reg, "cip=" + code)

    return {
      "code": code,
      "title": truncatedTitle,
      "permalink": permalink
    }
  })

  var index = {} as any
  Array.prototype.forEach.call(objects, (element, _) => {
    let code = element["code"]
    index[code] = element
  })

  return index
}

function scrapIndex() {
  let objects = Array.prototype.map.call(document.getElementById(rootId)!.getElementsByTagName("li"), (element, index) => {
    return element.getElementsByTagName("a")[0].text.split(") ")[0]
  })
  return objects
}

function expandAll() {
  Array.prototype.forEach.call(document.getElementById(rootId)!.getElementsByTagName("li"), (element, index) => {
    let img = element.getElementsByTagName("img")[0]
    if (img) { img.click() }
  })
}

// expandAll()
let metaEN = JSON.stringify(scrapMetadataForEN())
let metaCN = JSON.stringify(scrapMetadataForCN())
let index = JSON.stringify(scrapIndex())

console.log(index)