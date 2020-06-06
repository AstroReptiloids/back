export const createWhereArray = (args, fields) => {
  const where = Object.keys(args)
    .filter(key => fields.includes(key))
    .map(key => ({ [key]: args[key] }))
  if (!where.length) {
    return null
  }
  return where
}
