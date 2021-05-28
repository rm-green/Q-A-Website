import mongoose from 'mongoose'

/**
 * Mongoose schema for questions
 */
const titleMaxLength = 128
const summaryMaxLength = 250

const questionSchema = new mongoose.Schema({
	title: {
		type: String,
		required: [true, 'Please enter a title'],
		maxlength: [titleMaxLength, `Maximum title length (${titleMaxLength}) exceeded`]
	},
	summary: {
		type: String,
		required: [true, 'Please enter a short summary'],
		maxlength: [summaryMaxLength, `Maximum summary length (${summaryMaxLength}) exceeded`]
	},
	details: {
		type: String,
		required: [true, 'Please enter some details about the question']
	},
	date: {
		type: Date,
		default: Date.now()
	},
	author: {
		type: String,
		required: [true, 'No username was submitted with this question']
	},
	image: {
		type: String
	},
	answered: {
		type: String,
		enum: ['Unanswered', 'Answered', 'Solved'],
		default: 'Unanswered'
	}
})

export default mongoose.model('Question', questionSchema)

export { titleMaxLength, summaryMaxLength }
