import Router from 'koa-router'

import users from './users'
import auth from './auth'
import categories from './categories'
import microchats from './microchats'
import messages from './messages'

const router = new Router()

router.use('/users', users.routes())
router.use('/auth', auth.routes())
router.use('/categories', categories.routes())
router.use('/microchats', microchats.routes())
router.use('/messages', messages.routes())

export default router
