import { strict as assert } from 'assert'

import db from './models'
import demoData from '../data/demo-data.json'


db.sequelize.sync().then(async () => {
  const users = await db.user.bulkCreate(demoData.users)
  assert(users.length === demoData.users.length)
})
