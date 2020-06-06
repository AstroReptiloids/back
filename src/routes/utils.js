import db from '../models'

export const createWhereArray = (args, fields) => {
  const where = Object.keys(args)
    .filter(key => fields.includes(key))
    .map(key => ({ [key]: args[key] }))
  if (!where.length) {
    return null
  }
  return where
}

export const createWhereSequelize = (args, fields) => {
  const where = createWhereArray(args, fields)
  if (where) {
    return {
      where: db.Sequelize.and(...where)
    }
  }
  return {}
}
