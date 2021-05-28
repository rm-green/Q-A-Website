import Router from 'koa-router'

const router = new Router({ prefix: '/answer' })
import { connect, close } from '../handlers/DBHandler.js'
import { insertAnswer, updateAnswer } from '../services/answerService.js'
import { updateQuestion } from '../services/questionsService.js'

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

router.post('/', async ctx => {
	await connect()
	try {
		const body = ctx.request.body
		await insertAnswer({
			text: body.details,
			author: ctx.session.username,
			questionId: body.id
		})
		console.log('Answer inserted')
		await updateQuestion(body.id, { answered: 'Answered' })
		ctx.redirect(`/${body.id}`)
	} catch (err) {
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		close()
	}
})

router.post('/mark', async ctx => {
	await connect()
	try {
		const body = ctx.request.body
		await updateAnswer(body.answerId, { flaggedAsCorrect: true })
		console.log('Answer updated')
		await updateQuestion(body.questionId, { answered: 'Solved' })
		console.log('Question updated')
		ctx.redirect(`/${body.questionId}`)
	} catch(err) {
		ctx.hbs.msg = err.message
		await ctx.render('error', ctx.hbs)
	}
})

export default router
