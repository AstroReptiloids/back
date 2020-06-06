import Router from 'koa-router'

import db from '../models'
import { createWhereArray } from './utils'

const auth = new Router()

auth.get('/login', async (ctx, next) => {
	const where = createWhereArray(ctx.request.query, ['owner_id', 'feeder_id'])
	const user = await db.user.findOne({ where: db.Sequelize.and(...where) })

	ctx.body = user
	await next()
})

export default auth
