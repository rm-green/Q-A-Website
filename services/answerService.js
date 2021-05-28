import answerSchema from '../schemas/answerSchema.js'
import dateFormatter from '../modules/dateFormatter.js'

/*questionService
 * Handles CRUD operations around questions.
 */

/**
  * @param {Object} answer answer object to be inserted into the database
  * @throws {Error} if answer is missing its text
  * @returns {Promise<Document>} Promise containing the inserted mongoose document
  */
export async function insertAnswer(answer) {
	return await answerSchema.create(answer)
}

/**
 * @returns {Promise<Object[]>} Promise containing an array of all answer documents
 */
export async function getAllAnswersForQuestion(id) {
	const res = await answerSchema.find({ questionId: id }).lean()
	if (!res) throw new Error(`Question id ${id} not found`)
	res.forEach(answer => {
		dateFormatter(answer)
	})
	return res
}

/**
 *
 * @param {Number} id the _id of the document to search for
 * @returns {Promise<Document>} Promise containing the requested mongoose document
 * @returns {Promise<null>} Empty promise if no document found
 */
export async function findAnswerById(id) {
	const res = await answerSchema.findById(id).lean()
	if (!res) throw new Error(`Answer id ${id} not found`)
	dateFormatter(res)
	return res
}

/**
 *
 * @param {Number} id the _id of the answer to be updated
 * @param {Object} update the values to be updated (e.g { flaggedAsCorrect: true })
 * @returns {Promise<Document>} Promise containing the updated mongoose document
 * @returns {Promise<null>} Empty promise if no docment is found
 */
export async function updateAnswer(id, update) {
	return await answerSchema.findByIdAndUpdate(id, update, { runValidators: true, useFindAndModify: false })
		.lean()
}

/**
 *
 * @param {Number} id the _id of the answer to be updated
 * @returns {Promise<Document>} Promise containing the deleted mongoose document
 */
export async function deleteAnswer(id) {
	return await answerSchema.findByIdAndRemove(id, { useFindAndModify: false }).lean()
}
