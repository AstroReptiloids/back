import Router from 'koa-router'

import db from '../models'

const users = new Router()

users.get('/', async (ctx, next) => {
	const users = await db.user.findAll()

	ctx.body = {
		data: users.map(u => ({
			id: u.id,
			first_name: u.first_name,
			last_name: u.last_name
		}))
	}
	await next()
})

users.get('/:id', async (ctx, next) => {
	const user = await db.user.findByPk(ctx.params.id)

	ctx.body = {
		data: {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name
		}
	}
	await next()
})

users.post('/', async (ctx, next) => {
	const user = await db.user.create(ctx.request.body)

	ctx.body = {
		data: user
	}
	await next()
})

users.patch('/:id', async (ctx, next) => {
	const user = await db.user.findByPk(ctx.params.id)
	const updatedUser = await user.update(ctx.request.body)

	ctx.body = {
		data: updatedUser
	}
	await next()
})

users.delete('/:id', async (ctx, next) => {
	const user = await db.user.findByPk(ctx.params.id)
	const deleted = await user.destroy()

	ctx.body = {
		data: deleted
	}
	await next()
})

export default users
