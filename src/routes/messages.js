import Router from 'koa-router'

import db from '../models'

const messages = new Router()

messages.get('/', async (ctx, next) => {
	const messages = await db.message.findAll()

	ctx.body = messages
	await next()
})

messages.get('/:id', async (ctx, next) => {
	const message = await db.message.findById(ctx.params.id)

	ctx.body = message
	await next()
})

messages.post('/', async (ctx, next) => {
	const message = await db.message.create(ctx.request.body)

	ctx.body = message
	await next()
})

messages.patch('/:id', async (ctx, next) => {
	const message = await db.message.findById(ctx.params.id)
	const updatedMessage = await message.update(ctx.request.body)

	ctx.body = updatedMessage
	await next()
})

messages.delete('/:id', async (ctx, next) => {
	const message = await db.message.findById(ctx.params.id)
	const deletedMessage = await message.destroy()

	ctx.body = deletedMessage
	await next()
})

export default messages
