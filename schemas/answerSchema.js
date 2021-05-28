import mongoose from 'mongoose'

/**
 * Mongoose schema for answers
 */

const answerSchema = new mongoose.Schema({
	text: {
		type: String,
		required: [true, 'Please enter your answer'],
	},
	date: {
		type: Date,
		default: Date.now
	},
	author: {
		type: String,
		required: [true, 'No username was submitted with this question']
	},
	questionId: {
		type: String,
		required: true
	},
	flaggedAsCorrect: {
		type: Boolean,
		default: false
	}
})

export default mongoose.model('Answer', answerSchema)
