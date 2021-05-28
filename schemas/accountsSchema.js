import mongoose from 'mongoose'

/**
 * Mongoose Schema for user accounts
 */

const accountSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	pass: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	}
})

export default mongoose.model('Account', accountSchema)
