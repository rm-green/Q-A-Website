
import Router from 'koa-router'
import bodyParser from 'koa-body'

import publicRouter from './public.js'
import secureAskRouter from './ask.js'
import secureAnswerRouter from './answer.js'

const mainRouter = new Router()
mainRouter.use(bodyParser({multipart: true}))

const nestedRoutes = [secureAskRouter, secureAnswerRouter, publicRouter]
for (const router of nestedRoutes) {
	mainRouter.use(router.routes())
	mainRouter.use(router.allowedMethods())
}

export default mainRouter
