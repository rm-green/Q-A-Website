import accountSchema from '../schemas/accountsSchema.js'
import bcrypt from 'bcrypt-promise'

const saltRounds = 10

/**accountsService
 * Handles CRUD operations around user accounts.
 */

/**
 * Checks whether a username or email is already in the database
 * @param {Object} account account object to be checked against the database
 * @throws {Error} if duplicate is found (dynamically generated)
 * @returns {null} if no duplicate is found
 */

async function checkForDuplicate(account) {
	const existing = await accountSchema.findOne( {
		$or: [
			{user: account.user},
			{email: account.email}
		]
	}).lean().exec()

	if(existing) {
		const keysToIgnore = [' id']

		Object.keys(existing)
			.filter( prop => keysToIgnore.includes(prop) ? false : true)
			.forEach( key => {
				if(existing[key] === account[key]) {
					throw new Error(`${key} "${account[key]}" already in use`)
				}
			})
	}
}

/**
 * Registers a new user to the database
 * @param {String} user the username to be registered
 * @param {String} pass the password to be registered
 * @param {String} email the email to be registered
 * @throws {Error} 'missing field' error if a required field is missing
 * @throws {Error} if insertion into database fails
 * @returns {null} if insertion completes normally
 */
export async function register(user, pass, email) {
	const account = {username: user, pass: pass, email: email}
	Object.values(account).forEach(val => {
		if (val.length === 0) throw new Error('missing field')
	})

	await checkForDuplicate(account)

	const hashedPass = await bcrypt.hash(account.pass, saltRounds)
	account.pass = hashedPass

	try {
		await accountSchema.create(account)
	} catch(err) {
		throw err
	}
}

/**
 * Checks the given username and password against the database
 * @param {String} user the account to be logged in
 * @param {String} pass the corresponding password
 * @returns {boolean} true if logged in, otherwise false
 */
export async function login(user, pass) {
	const account = {username: user, pass: pass}
	const result = await accountSchema.findOne({ username: account.username }).exec()
	if(!result) throw new Error(`username "${account.username}" not found`)
	const valid = await bcrypt.compare(account.pass, result.pass)
	if(!valid) throw new Error(`invalid password for account "${account.username}"`)
	return valid
	 }
