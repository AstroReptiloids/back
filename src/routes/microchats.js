import Router from 'koa-router'

import db from '../models'
import {v4 as uuidv4} from "uuid";
import {createWhereSequelize} from "./utils";

const microchats = new Router()

microchats.get('/', async (ctx, next) => {
	const query = ctx.request.query
	const where = createWhereSequelize(ctx.request.query, ['parent_id', 'creator_id', 'category_id'])
	const microchats = await db.microchat.findAll(where)

	let parent = null
	if (query.parent_id) {
		parent = await db.message.findByPk(query.parent_id)
	}

	let category = null
	if (query.category_id) {
		category = await db.category.findByPk(query.category_id)
	}

	const creators = {}
	await Promise.all(microchats.map(async m => {
		if (creators[m.user_id]) {
			return
		}
		creators[m.creator_id] = await db.user.findByPk(m.creator_id)
	}))

	ctx.body = {
		data: {
			microchats: microchats.map(m => ({
				...m.toJSON(),
				creator: creators[m.creator_id]
			})),
			parent,
			category
		}
	}
	await next()
})

microchats.get('/:id', async (ctx, next) => {
	const microchat = await db.microchat.findById(ctx.params.id)

	ctx.body = {
		data: microchat
	}
	await next()
})

microchats.post('/', async (ctx, next) => {
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

	const microchat = await db.microchat.create({
		...ctx.request.body,
		id: uuidv4(),
		creator_id: ctx.state.user.id,
		message_count: 0,
		microchats_count: 0,
		people_count: 1,
		hot: 0
	})

	ctx.body = {
		data: microchat
	}
	await next()
})

microchats.patch('/:id', async (ctx, next) => {
	const microchat = await db.microchat.findById(ctx.params.id)
	const updatedMicroChat = await microchat.update(ctx.request.body)

	ctx.body = {
		data: updatedMicroChat
	}
	await next()
})

microchats.delete('/:id', async (ctx, next) => {
	const microchat = await db.microchat.findById(ctx.params.id)
	const deletedMicroChat = await microchat.destroy()

	ctx.body = {
		data: deletedMicroChat
	}
	await next()
})

export default microchats
