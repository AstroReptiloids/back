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
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			createdAt: user.createdAt
		}
	}))

	const microchats = await db.microchat.findAll()
	const microchatsParents = {}
	const messageCounts = {}
	const microchatsCounts = {}
	const peopleCounts = {}
	const hots = {}
	microchats.forEach(m => {
		if (!m.parent_id) {
			return
		}

		if (microchatsParents[m.parent_id] && microchatsParents[m.parent_id].length) {
			microchatsParents[m.parent_id].push(m)
		} else {
			microchatsParents[m.parent_id] = [m]
		}

		if (messageCounts[m.parent_id]) {
			messageCounts[m.parent_id] += m.message_count
		} else {
			messageCounts[m.parent_id] = m.message_count
		}

		if (microchatsCounts[m.parent_id]) {
			microchatsCounts[m.parent_id] += m.microchats_count
		} else {
			microchatsCounts[m.parent_id] = m.microchats_count
		}

		if (peopleCounts[m.parent_id]) {
			peopleCounts[m.parent_id] += m.people_count
		} else {
			peopleCounts[m.parent_id] = m.people_count
		}

		if (hots[m.parent_id]) {
			hots[m.parent_id] += m.hot
		} else {
			hots[m.parent_id] = m.hot
		}
	})

	await Promise.all(messages.map(async m => {
		if (users[m.user_id]) {
			return
		}
		const user = await db.user.findByPk(m.user_id)
		users[m.user_id] = {
			id: user.id,
			first_name: user.first_name,
			last_name: user.last_name,
			createdAt: user.createdAt
		}
	}))

	ctx.body = {
		data: {
			messages: messages.map(m => ({
				...m.toJSON(),
				user: users[m.user_id],
				is_parent: !!microchatsParents[m.id],
				message_count: messageCounts[m.id],
				microchats_count: microchatsCounts[m.id],
				people_count: peopleCounts[m.id],
				hot: hots[m.id]
			})),
			microchat
		}
	}
	await next()
})

messages.get('/:id', async (ctx, next) => {
	const message = await db.message.findByPk(ctx.params.id)

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

	const messageUser = await db.user.findByPk(message.user_id)

	Object.keys(sessions).forEach(session => {
		sessions[session].send(JSON.stringify({
			status: 'ok',
			message,
			user: {
				id: messageUser.id,
				first_name: messageUser.first_name,
				last_name: messageUser.last_name,
				createdAt: messageUser.createdAt
			}
		}))
	})

	await next()
})

messages.patch('/:id', async (ctx, next) => {
	const message = await db.message.findByPk(ctx.params.id)
	const updatedMessage = await message.update(ctx.request.body)

	ctx.body = {
		data: updatedMessage
	}
	await next()
})

messages.delete('/:id', async (ctx, next) => {
	const message = await db.message.findByPk(ctx.params.id)
	const deletedMessage = await message.destroy()

	ctx.body = {
		data: deletedMessage
	}
	await next()
})

export default messages
