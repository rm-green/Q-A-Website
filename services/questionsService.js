import questionSchema from '../schemas/questionSchema.js'
import dateFormatter from '../modules/dateFormatter.js'

/*questionService
 * Handles CRUD operations around questions.
 */

/**
  * @param {Object} question question object to be inserted into the database
  * @throws {Error} if question is missing a title, summary, details or author
  * @returns {Promise<Document>} Promise containing the inserted mongoose document
  */
export async function insertQuestion(question) {
	return await questionSchema.create(question)
}

/**
 * @returns {Promise<Object[]>} Promise containing an array of all question documents
 */
export async function getAllQuestions() {
	const res = await questionSchema.find().lean()
	if(res) {
		res.sort( (a, b) => b.date - a.date )

		res.forEach(question => {
			dateFormatter(question)
		})
	}
	return res
}

/**
 *
 * @param {Number} id the _id of the document to search for
 * @returns {Promise<Document>} Promise containing the requested mongoose document
 * @returns {Promise<null>} Empty promise if no document found
 */
export async function findQuestionById(id) {
	const res = await questionSchema.findById(id).lean()
	if (!res) throw new Error(`Question id ${id} not found`)
	dateFormatter(res)
	return res
}


/**
 *
 * @param {String} user the username of the question author
 * @returns {Promise<Document[]>} Promise containing an array of the requested mongoose documents
 * @returns {Promise<Document[]>} Empty promise if no documents are found
 */
export async function findAllQuestionsByUser(user) {
	return await questionSchema.find({ author: user }).lean()
}

/**
 *
 * @param {Number} id the _id of the question to be updated
 * @param {Object} update the values to be updated (e.g { answered: true })
 * @returns {Promise<Document>} Promise containing the updated mongoose document
 * @returns {Promise<null>} Empty promise if no docment is found
 */
export async function updateQuestion(id, update) {
	return await questionSchema.findByIdAndUpdate(id, update, { runValidators: true, useFindAndModify: false })
		.lean()
}

/**
 *
 * @param {Number} id the _id of the question to be updated
 * @returns {Promise<Document>} Promise containing the deleted mongoose document
 */
export async function deleteQuestion(id) {
	return await questionSchema.findByIdAndRemove(id, { useFindAndModify: false }).lean()
}
