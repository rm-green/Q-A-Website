
/* main.js */

window.addEventListener('DOMContentLoaded', () => {
	console.log('DOMContentLoaded')
	document.querySelectorAll('.question').forEach(box => {
		const answered = box.querySelector('h4')
		if(answered.textContent === 'Status: Unanswered') box.classList.add('unanswered')
		else if (answered.textContent === 'Status: Answered') box.classList.add('answered')
		else if (answered.textContent === 'Status: Solved') box.classList.add('solved')
	})
})
