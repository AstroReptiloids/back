import Router from 'koa-router'

import db from '../models'
import {v4 as uuidv4} from "uuid";

const microchats = new Router()

microchats.get('/', async (ctx, next) => {
	const microchats = await db.microchat.findAll()

	ctx.body = {
		data: microchats
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
		creator_id: ctx.state.user.id
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
