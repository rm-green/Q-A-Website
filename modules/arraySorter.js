
/**
 * @module arraySorter Moves the answer marked as correct to the start of the array
 * @param {*} answerArray The array of answers to be sorted
 */
export default function moveSolutionToFront(answerArray) {
	for(let i = 0; i < answerArray.length; i++) {
		if(answerArray[i].flaggedAsCorrect === true) {
			const flaggedAnswer = answerArray.splice(i, 1)
			answerArray.unshift(flaggedAnswer[0])
			break
		}
	}
}
