
import test from 'ava'
import { register, login } from '../services/accountsService.js'
import { connect, close, clearDatabase } from '../unitTests/testDBhandler.js'

test.before(async() => {
	await connect()
})

test.afterEach(async() => {
	await clearDatabase()
})

test.after(async() => {
	await close()
})

test.serial('REGISTER : register and log in with a valid account', async test => {
	test.plan(1)
	try {
		await register('doej', 'password', 'doej@gmail.com')
	  	const isLoggedIn = await login('doej', 'password')
		test.is(isLoggedIn, true, 'unable to log in')
	} catch(err) {
		console.log(err)
		console.log('^^^^^^^ERROR^^^^^^^^^')
		test.fail('error thrown')
	}
})

test.serial('REGISTER : register a duplicate username', async test => {
	test.plan(1)
	try {
		await register('doej', 'password', 'doej@gmail.com')
		await register('doej', 'password', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "doej" already in use', 'incorrect error message')
	}
})

test.serial('REGISTER : error if blank username', async test => {
	test.plan(1)
	try {
		await register('', 'password', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	}
})

test.serial('REGISTER : error if blank password', async test => {
	test.plan(1)
	try {
		await register('doej', '', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	}
})

test.serial('REGISTER : error if blank email', async test => {
	test.plan(1)
	try {
		await register('doej', 'password', '')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'missing field', 'incorrect error message')
	}
})

test.serial('REGISTER : error if duplicate email', async test => {
	test.plan(1)
	try {
		await register('doej', 'password', 'doej@gmail.com')
		await register('bloggsj', 'newpassword', 'doej@gmail.com')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'email "doej@gmail.com" already in use', 'incorrect error message')
	}
})

test.serial('LOGIN    : invalid username', async test => {
	test.plan(1)
	try {
		await register('doej', 'password', 'doej@gmail.com')
		await login('roej', 'password')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'username "roej" not found', 'incorrect error message')
	}
})

test.serial('LOGIN    : invalid password', async test => {
	test.plan(1)
	try {
		await register('doej', 'password', 'doej@gmail.com')
		await login('doej', 'bad')
		test.fail('error not thrown')
	} catch(err) {
		test.is(err.message, 'invalid password for account "doej"', 'incorrect error message')
	}
})
