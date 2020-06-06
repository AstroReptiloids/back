import Router from 'koa-router'

import db from '../models'

const microchats = new Router()

microchats.get('/', async (ctx, next) => {
	const microchats = await db.microchat.findAll()

	ctx.body = microchats
	await next()
})

microchats.get('/:id', async (ctx, next) => {
	const microchat = await db.microchat.findById(ctx.params.id)

	ctx.body = microchat
	await next()
})

microchats.post('/', async (ctx, next) => {
	const microchat = await db.mesmicrochatsage.create(ctx.request.body)

	ctx.body = microchat
	await next()
})

microchats.patch('/:id', async (ctx, next) => {
	const microchat = await db.microchat.findById(ctx.params.id)
	const updatedMicroChat = await microchat.update(ctx.request.body)

	ctx.body = updatedMicroChat
	await next()
})

microchats.delete('/:id', async (ctx, next) => {
	const microchat = await db.microchat.findById(ctx.params.id)
	const deletedMicroChat = await microchat.destroy()

	ctx.body = deletedMicroChat
	await next()
})

export default microchats
