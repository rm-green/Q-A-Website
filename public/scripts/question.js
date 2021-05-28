
/* question.js */

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	const solved = document.querySelector('p#status')
	if(solved.textContent === 'Solved') {
		document.querySelectorAll('article#answer input').forEach(input => {
			input.parentElement.removeChild(input)
		})

		document.querySelectorAll('article#answer')[0].classList.add('flagged')

		document.querySelector('div#answerBox').style.display = 'none'

	}
})
