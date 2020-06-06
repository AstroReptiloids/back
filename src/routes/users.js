import Router from 'koa-router'

import db from '../models'

const users = new Router()

users.get('/', async (ctx, next) => {
	const users = await db.user.findAll()

	ctx.body = users
	await next()
})

users.get('/:id', async (ctx, next) => {
	const user = await db.user.findById(ctx.params.id)

	ctx.body = user
	await next()
})

users.post('/', async (ctx, next) => {
	const user = await db.user.create(ctx.request.body)

	ctx.body = user
	await next()
})

users.patch('/:id', async (ctx, next) => {
	const user = await db.user.findById(ctx.params.id)
	const updatedUser = await user.update(ctx.request.body)

	ctx.body = updatedUser
	await next()
})

users.delete('/:id', async (ctx, next) => {
	const user = await db.user.findById(ctx.params.id)
	const deleted = await user.destroy()

	ctx.body = deleted
	await next()
})

export default users
