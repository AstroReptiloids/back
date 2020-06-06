import { strict as assert } from 'assert'

import db from './models'
import demoData from '../data/demo-data.json'


db.sequelize.sync().then(async () => {
  const users = await db.user.bulkCreate(demoData.users)
  assert(users.length === demoData.users.length)

  const categories = await db.category.bulkCreate(demoData.categories)
  assert(categories.length === demoData.categories.length)

  const microchats = await db.microchat.bulkCreate(demoData.microchats)
  assert(microchats.length === demoData.microchats.length)

  const messages = await db.message.bulkCreate(demoData.messages)
  assert(messages.length === demoData.messages.length)
})
