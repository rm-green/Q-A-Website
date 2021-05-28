
import Router from 'koa-router'

const router = new Router()

import { connect, close } from '../handlers/DBHandler.js'
import { register, login } from '../services/accountsService.js'
import { getAllQuestions, findQuestionById } from '../services/questionsService.js'
import { getAllAnswersForQuestion } from '../services/answerService.js'
import moveSolutionToFront from '../modules/arraySorter.js'


/**
 * The secure home page.
 *
 * @name Home Page
 * @route {GET} /
 */
router.get('/', async ctx => {
	try {
		await connect()
		const questionArray = await getAllQuestions()
		ctx.hbs.questions = questionArray
		await ctx.render('index', ctx.hbs)
	} catch(err) {
		await ctx.render('error', ctx.hbs)
	} finally {
		await close()
	}
})


/**
 * The user registration page.
 *
 * @name Register Page
 * @route {GET} /register
 */
router.get('/register', async ctx => await ctx.render('register'))

/**
 * The script to process new user registrations.
 *
 * @name Register Script
 * @route {POST} /register
 */
router.post('/register', async ctx => {
	await connect()
	try {
		// call the functions in the module
		await register(ctx.request.body.user, ctx.request.body.pass, ctx.request.body.email)
		ctx.redirect(`/login?msg=new user "${ctx.request.body.user}" added, you need to log in`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		ctx.hbs.body = ctx.request.body
		console.log(ctx.hbs)
		await ctx.render('register', ctx.hbs)
	} finally {
		await close()
	}
})

/**
 * The login page
 *
 * @name Login Page
 * @route {GET} /login
 */
router.get('/login', async ctx => {
	console.log(ctx.hbs)
	await ctx.render('login', ctx.hbs)
})

/**
 * The login script
 *
 * @name Login Script
 * @route {POST} /login
 */
router.post('/login', async ctx => {
	await connect()
	ctx.hbs.body = ctx.request.body
	try {
		const body = ctx.request.body
		await login(body.user, body.pass)
		ctx.session.authorised = true
		ctx.session.username = body.user
		const referrer = body.referrer || '/'
		return ctx.redirect(`${referrer}?msg=you are now logged in...`)
	} catch(err) {
		console.log(err)
		ctx.hbs.msg = err.message
		await ctx.render('login', ctx.hbs)
	} finally {
		await close()
	}
})

/**
 * The logout script
 *
 * @name Logout Script
 * @route {GET} /logout
 */
router.get('/logout', async ctx => {
	ctx.session.authorised = null
	ctx.session.username = null
	ctx.redirect('/?msg=you are now logged out')
})

/**
 * The individual question page
 *
 * @name Question Page
 * @route {GET} /:questionID
 */
router.get('/:id([0-9a-zA-Z]{1,})', async ctx => {
	await connect()
	try {
		const question = await findQuestionById(ctx.params.id)
		const answers = await getAllAnswersForQuestion(ctx.params.id)
		moveSolutionToFront(answers)
		ctx.hbs.data = {
			myQuestion: question.author === ctx.session.username,
			question: question,
			answers: answers,
			id: ctx.params.id
		}
		await ctx.render('question', ctx.hbs)
	} catch (err) {
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		close()
	}
})

export default router
