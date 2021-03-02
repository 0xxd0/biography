// from https://nces.ed.gov/ipeds/cipcode/browse.aspx?y=56
function scrap_cip() {
    let rootId = "tree_ul_section_0"
    var element = document.getElementById(rootId)
    console.log(element.getElementsByTagName("li"))
	// var elementClassNames = [
	// ]
	
	// var elementIDs = [
	// ]
	
	// var elementNames = [
	// ]
	
	// elementClassNames.forEach( (name, index) => {
	//   Array.prototype.forEach.call(document.getElementsByClassName(name), (element, index) => {
	// 	element.parentNode.removeChild(element) 
	//   })
	// })
	
	// elementIDs.forEach( (id, index) => {
	//   var element = document.getElementById(id)
	//   if (element != null && element.parentNode != null) {
	// 	element.parentNode.removeChild(element)
	//   }
	// })
	
	// elementNames.forEach( (name, index) => {
	//   document.getElementsByName(name).forEach( (element, index) => {
	// 	  element.parentNode.removeChild(element) 
	//   })
	// })
}

scrap_cip()