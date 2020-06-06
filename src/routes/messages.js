import Router from 'koa-router'

import db from '../models'

const messages = new Router()

messages.get('/', async (ctx, next) => {
	const messages = await db.message.findAll()

	ctx.body = {
		data: messages
	}
	await next()
})

messages.get('/:id', async (ctx, next) => {
	const message = await db.message.findById(ctx.params.id)

	ctx.body = {
		data: message
	}
	await next()
})

messages.post('/', async (ctx, next) => {
	const message = await db.message.create(ctx.request.body)

	ctx.body = {
		data: message
	}
	await next()
})

messages.patch('/:id', async (ctx, next) => {
	const message = await db.message.findById(ctx.params.id)
	const updatedMessage = await message.update(ctx.request.body)

	ctx.body = {
		data: updatedMessage
	}
	await next()
})

messages.delete('/:id', async (ctx, next) => {
	const message = await db.message.findById(ctx.params.id)
	const deletedMessage = await message.destroy()

	ctx.body = {
		data: deletedMessage
	}
	await next()
})

export default messages
