import test from 'ava'
import { insertAnswer,
	getAllAnswersForQuestion,
	findAnswerById,
	updateAnswer,
	deleteAnswer } from '../services/answerService.js'
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

test.serial('INSERT AND READ: Insert an answer and retrieve it', async test => {
	test.plan(3)
	try {
		const inserted = await insertAnswer({
			text: 'test answer',
			author: 'test author',
			questionId: '123'
		})
		const retrieved = await findAnswerById(inserted._id)
		test.is(inserted.text, retrieved.text, 'Text contents do not match')
		test.is(inserted.author, retrieved.author, 'Author does not match')
		test.is(inserted.questionId, retrieved.questionId, 'Question ID does not match')
	} catch (err) {
		test.fail(`Error thrown: ${err}`)
	}
})

test.serial('INSERT AND UPDATE: Insert an answer and update its text', async test => {
	test.plan(1)
	try {
		const inserted = await insertAnswer({
			text: 'test answer',
			author: 'test author',
			questionId: '123'
		})
		await updateAnswer(inserted._id, { text: 'updated text' })
		const updated = await findAnswerById(inserted._id)
		test.is(updated.text, 'updated text', 'Object did not update')
	} catch (err) {
		test.fail(`Error thrown: ${err}`)
	}
})

test.serial('INSERT AND UPDATE: Insert an answer and update its status', async test => {
	test.plan(1)
	try {
		const inserted = await insertAnswer({
			text: 'test answer',
			author: 'test author',
			questionId: '123'
		})
		await updateAnswer(inserted._id, { flaggedAsCorrect: true })
		const updated = await findAnswerById(inserted._id)
		test.is(updated.flaggedAsCorrect, true, 'Object did not update')
	} catch (err) {
		test.fail(`Error thrown: ${err}`)
	}
})

test.serial('INVALID INSERT: Insert an answer with no text', async test => {
	test.plan(1)
	try {
		await insertAnswer({
			text: '',
			author: 'test author',
			questionId: '123'
		})
		test.fail('Did not throw exception')
	} catch (err) {
		test.is(err._message, 'Answer validation failed', 'Incorrect error message')
	}
})

test.serial('DELETE: Insert an answer and delete it', async test => {
	test.plan(1)
	const inserted = await insertAnswer({
		text: 'test answer',
		author: 'test author',
		questionId: '123'
	})

	try {
		await deleteAnswer(inserted._id)
		await findAnswerById(inserted._id)
		test.fail('Answer was not deleted')
	} catch (err) {
		test.is(err.message, `Answer id ${inserted._id} not found`, 'Incorrect error message')
	}
})

test.serial('INSERT AND READ: Insert multiple answers, obtain answer list via question ID', async test => {
	test.plan(1)
	try {
		await insertAnswer({
			text: 'test answer',
			author: 'test author',
			questionId: '123'
		})
		await insertAnswer({
			text: 'test answer2',
			author: 'test author2',
			questionId: '123'
		})
		await insertAnswer({
			text: 'test answer3',
			author: 'test author3',
			questionId: '123'
		})
		const answers = await getAllAnswersForQuestion('123')
		test.is(answers.length, 3, 'Did not retrieve all answers')
	} catch (err) {
		test.fail(`Error Thrown: ${err}`)
	}
})

