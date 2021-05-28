window.addEventListener('DOMContentLoaded', () => {
	console.log('/ask form DOM loaded')
	const textareas = document.getElementsByTagName('textarea')
	for (let i = 0; i < textareas.length; i++) {
  		textareas[i].addEventListener('input', OnInput, false)
	}
})

function OnInput() {
  	this.style.height = 'auto'
  	this.style.height = `${this.scrollHeight }px`
}
