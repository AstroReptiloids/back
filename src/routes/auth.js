import Router from 'koa-router'

import db from '../models'
import { createWhereSequelize } from './utils'

const auth = new Router()

auth.post('/login', async (ctx, next) => {
	if (!ctx.request.body.login || !ctx.request.body.password) {
		ctx.body = {
			error: {
				code: 400,
				message: 'Can\'t find login or password'
			}
		}
		await next()
		return
	}

	const where = createWhereSequelize(ctx.request.body, ['login'])
	const user = await db.user.findOne(where)

	if (user && user.password === ctx.request.body.password) {
		ctx.body = {
			data: {
				user_id: user.id,
				token: user.token
			}
		}
	} else {
		ctx.body = {
			error: {
				code: 401,
				message: 'Can\'t authorize'
			}
		}
	}
	await next()
})

export default auth
