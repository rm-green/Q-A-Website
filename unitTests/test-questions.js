import test from 'ava'
import {
	insertQuestion,
	deleteQuestion,
	updateQuestion,
	findQuestionById,
	findAllQuestionsByUser } from '../services/questionsService.js'
import { connect, close, clearDatabase } from '../unitTests/testDBhandler.js'
import { titleMaxLength, summaryMaxLength } from '../schemas/questionSchema.js'

test.before(async() => {
	await connect()
})

test.afterEach(async() => {
	await clearDatabase()
})

test.after(async() => {
	await close()
})

test.serial('INSERT AND READ: insert a valid question into the database (no image) and retrieve it', async test => {
	test.plan(1)
	try {
		const inserted = await insertQuestion({
			title: 'Test Question',
			summary: 'Test summary',
			details: 'Test details',
			author: 'Test User'})
		const retrieved = await findQuestionById(inserted._id)
		test.is(inserted.title, retrieved.title, 'inserted and retrieved question titles do not match')
	} catch(err) {
		console.log(err)
		test.fail(`Error thrown: ${err.message}`)
	}
})

test.serial('INSERT AND READ: insert two valid questions into the database (no image) and retrieve it via username',
	async test => {
		test.plan(2)
		try {
			const first = await insertQuestion({
				title: 'Test Question',
				summary: 'Test summary',
				details: 'Test details',
				author: 'Test User'})
			const second = await insertQuestion({
				title: 'Test Question 2',
				summary: 'Test summary 2',
				details: 'Test details 2',
				author: 'Test User'})
			const retrieved = await findAllQuestionsByUser('Test User')
			const firstRetrieved = retrieved[0]
			const secondRetrieved = retrieved[1]
			test.is(first.title, firstRetrieved.title,
				`inserted (${first.title}) and retrieved (${firstRetrieved.title}) question titles do not match`)
			test.is(second.title, secondRetrieved.title,
				`inserted (${first.title}) and retrieved (${firstRetrieved.title}) question titles do not match`)
		} catch (err) {
			console.log(err)
			test.fail(`Error thrown: ${err.message}`)
		}
	})

test.serial('INVALID INSERT: error when insert a question with no title', async test => {
	test.plan(1)
	try {
		await insertQuestion({
			title: '',
			summary: 'Test summary',
			details: 'Test details',
			author: 'Test User'
		})
		test.fail('Invalid insert did not throw')
	} catch (err) {
		test.is(err.errors['title'].message, 'Please enter a title', 'Incorrect error message')
	}
})

test.serial('INVALID INSERT: error when insert a question with no summary', async test => {
	test.plan(1)
	try {
		await insertQuestion({
			title: 'Test Title',
			summary: '',
			details: 'Test details',
			author: 'Test User'
		})
		test.fail('Invalid insert did not throw')
	} catch (err) {
		test.is(err.errors['summary'].message, 'Please enter a short summary', 'Incorrect error message')
	}
})

test.serial('INVALID INSERT: error when insert a question with >128 characters in title', async test => {
	test.plan(1)
	try {
		await insertQuestion({
			title: random300CharString,
			summary: 'Test Summary',
			details: 'Test Details',
			author: 'Test Author'
		})
		test.fail('Invalid insert did not throw')
	} catch (err) {
		test.is(err.errors['title'].message,
		 `Maximum title length (${titleMaxLength}) exceeded`, 'Incorrect error message')
	}
})

test.serial('INVALID INSERT: error when insert a question with >250 characters in summary', async test => {
	test.plan(1)
	try {
		await insertQuestion({
			title: 'Test Title',
			summary: random300CharString,
			details: 'Test Details',
			author: 'Test User',
		})
		test.fail('Invalid insert did not throw')
	} catch (err) {
		test.is(err.errors['summary'].message,
			`Maximum summary length (${summaryMaxLength}) exceeded`, 'Incorrect error message')
	}
})

test.serial('DELETE QUESTION: insert a question, then delete it', async test => {
	test.plan(1)
	let id = 0
	try {
		const inserted = await insertQuestion({
			title: 'Test title',
			summary: 'Test summary',
			details: 'Test details',
			author: 'Test author'
		})
		id = inserted._id
		deleteQuestion(inserted._id)
		await findQuestionById(inserted._id)
		test.fail('No error thrown when trying to find deleted question')
	} catch(err) {
		test.is(err.message, `Question id ${id} not found`, 'Incorrect error message')
	}
})

test.serial('UPDATE QUESTION: insert a question, then update its title', async test => {
	test.plan(1)
	try {
		const inserted = await insertQuestion({
			title: 'Test title',
			summary: 'Test summary',
			details: 'Test details',
			author: 'Test author'
		})
		await updateQuestion(inserted._id, { title: 'Updated title' })
		const found = await findQuestionById(inserted._id)
		test.is(found.title, 'Updated title', 'Document was not updated correctly')
	} catch (err) {
		console.log(err)
		test.fail(`Error thrown: ${err.message}`)
	}
})

const random300CharString = 'AdjxJVm4xQBhK7TJHLwv\
OwkHvig8rJBqbq1fsXpV\
vPi7vcOiOz8cb1ubls5e\
F36y5NGBpcQKaVz3BybV\
Q5UE2R565DuRTl7KD6UI\
J4AchKuOo1EEX5pORMJ2\
H8rgDS0zT77BMSWWrEhb\
9rSAYvF8nG0HFO4Noioa\
FCuJLzrlj7gE2TDWs3My\
RdEhLFUvL1SizsrG5aPw\
Aq3mffuLRwxfhWoaiHvY\
al2GkdOLDEPVKxAJ3eXQ\
SPnebNZQMGQBVMkNWbJS\
TXB30ns0tTFIEm8DIUQ8\
nf6gGk7UXvBZ96QpJvhO'
