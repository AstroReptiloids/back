import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import koaqs from 'koa-qs'
import cors from '@koa/cors'
import Router from 'koa-router'
import websockify from 'koa-websocket'

import router from './routes'
import db from './models'
import { sessions } from './subscription'

const app = new Koa()

// Use the qs library instead of querystring to support nested objects.
koaqs(app)

websockify(app)

const authMiddleware = async (ctx, next) => {
	const token = ctx.get('Authorization')
	if (token) {
		ctx.state.user = await db.user.findOne({where: { token }})
	}
	await next()
}

const websocketMiddleware = async (ctx, next) => {
	ctx.websocket.on('message', async (message) => {
		const obj = JSON.parse(message)
		if (obj.token) {
			ctx.state.user = await db.user.findOne({where: { token: obj.token }})
			sessions[ctx.state.user.id] = ctx.websocket
			ctx.websocket.send(JSON.stringify({
				status: 'ok',
				user_id: ctx.state.user.id
			}))
		}
	})
	await next()
}

app
	.use(logger())
	.use(cors())
	.use(bodyParser())
	.use(authMiddleware)
	.use(router.routes())
	.use(router.allowedMethods())

app.ws.use(websocketMiddleware)

export default app
