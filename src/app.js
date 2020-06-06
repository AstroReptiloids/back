import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import koaqs from 'koa-qs'
import cors from '@koa/cors'

import router from './routes'
import db from './models'

const app = new Koa()

// Use the qs library instead of querystring to support nested objects.
koaqs(app)

const authMiddleware = async (ctx, next) => {
	const token = ctx.get('Authorization')
	if (token) {
		ctx.state.user = await db.user.findOne({where: { token }})
	}
	await next()
}

app
	.use(logger())
	.use(cors())
	.use(bodyParser())
	.use(authMiddleware)
	.use(router.routes())
	.use(router.allowedMethods())

export default app
