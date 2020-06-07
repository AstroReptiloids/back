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

  for (let i = 0; i < demoData.messages.length; i += 1) {
    await db.message.create(demoData.messages[i])
  }
  // await Promise.all(demoData.messages.map(m => db.message.create(m)))
  // const messages = await db.message.bulkCreate(demoData.messages)
  // assert(messages.length === demoData.messages.length)
})
