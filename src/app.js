import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import koaqs from 'koa-qs'
import cors from '@koa/cors'

import router from './routes'

const app = new Koa()

// Use the qs library instead of querystring to support nested objects.
koaqs(app)

app
	.use(logger())
	.use(cors())
	.use(bodyParser())
	.use(router.routes())
	.use(router.allowedMethods())

export default app
