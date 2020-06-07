import Router from 'koa-router'
import { v4 as uuidv4 } from 'uuid'

import db from '../models'
import { sessions } from "../subscription"
import { createWhereSequelize } from "./utils";

const messages = new Router()

messages.get('/', async (ctx, next) => {
	const query = ctx.request.query
	const where = createWhereSequelize(ctx.request.query, ['microchat_id', 'user_id'])
	const messages = await db.message.findAll(where)

	let microchat = null
	if (query.microchat_id) {
		microchat = await db.microchat.findByPk(query.microchat_id)
	}

	const users = {}
	await Promise.all(messages.map(async m => {
		if (users[m.user_id]) {
			return
		}
		const user = await db.user.findByPk(m.user_id)
		users[m.user_id] = {
			first_name: user.first_name,
			last_name: user.last_name
		}
	}))

	ctx.body = {
		data: {
			messages: messages.map(m => ({
				...m.toJSON(),
				user: users[m.user_id]
			})),
			microchat
		}
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

	Object.keys(sessions).forEach(session => {
		sessions[session].send(JSON.stringify({
			status: 'ok',
			message
		}))
	})
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
