
import Router from 'koa-router'
import { connect, close } from '../handlers/DBHandler.js'
import { insertQuestion } from '../services/questionsService.js'
import uploadImage from '../modules/imageUploader.js'
const router = new Router({ prefix: '/ask' })

async function checkAuth(ctx, next) {
	console.log('secure router middleware')
	console.log(ctx.hbs)
	if(ctx.hbs.authorised !== true) return ctx.redirect('/login?msg=you need to log in&referrer=/secure')
	await next()
}

router.use(checkAuth)

router.get('/', async ctx => {
	try {
		await ctx.render('ask', ctx.hbs)
	} catch(err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	}
})

router.post('/ask', async ctx => {
	await connect()
	ctx.hbs.body = ctx.request.body
	try {
		await uploadImage(ctx)
		await insertQuestion({
			title: ctx.request.body.title,
			summary: ctx.request.body.summary,
			details: ctx.request.body.details,
			author: ctx.session.username,
			image: ctx.request.files.image.name
		})
		ctx.redirect('/?msg=question submitted...')
	} catch (err) {
		ctx.hbs.error = err.message
		await ctx.render('error', ctx.hbs)
	} finally {
		await close()
	}
})

export default router
