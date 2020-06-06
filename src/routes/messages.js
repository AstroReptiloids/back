import Router from 'koa-router'
import { v4 as uuidv4 } from 'uuid'

import db from '../models'
import { createWhereSequelize } from "./utils";

const messages = new Router()

messages.get('/', async (ctx, next) => {
	const where = createWhereSequelize(ctx.request.query, ['microchat_id', 'user_id'])
	const messages = await db.user.findAll(where)

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
	if (!ctx.state.user) {
		ctx.body = {
			error: {
				code: 401,
				message: 'Can\'t authorize'
			}
		}
		await next()
		return
	}

	const message = await db.message.create({
		...ctx.request.body,
		id: uuidv4(),
		user_id: ctx.state.user.id
	})

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
