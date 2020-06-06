import Router from 'koa-router'

import db from '../models'

const categories = new Router()

categories.get('/', async (ctx, next) => {
	const categories = await db.category.findAll()

	ctx.body = categories
	await next()
})

categories.get('/:id', async (ctx, next) => {
	const category = await db.category.findById(ctx.params.id)

	ctx.body = category
	await next()
})

export default categories
