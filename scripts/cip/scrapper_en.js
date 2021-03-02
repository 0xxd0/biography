// from https://nces.ed.gov/ipeds/cipcode/browse.aspx?y=56
function scrap_cip_metadata() {
    let rootId = "tree_ul_section_0"

	let objects = Array.prototype.map.call(document.getElementById(rootId).getElementsByTagName("li"), (element, index) => {
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
			"title": title,
			"permalink": permalink
		}
	})

	var index = {}
	Array.prototype.forEach.call(objects, (element, _) => {
		let code = element["code"]
		index[code] = element
	})

	let json = JSON.stringify(index)
	console.log(json)
}

scrap_cip_metadata()