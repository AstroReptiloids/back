import path from 'path'
import Sequelize from 'sequelize'
// import env from '../../env.yaml'

const sequelize = new Sequelize({
	dialect: 'sqlite', // TODO: process.env.APP_ENV === 'test' ? 'sqlite' : 'pgsql',
	storage: './out/db.sqlite', // TODO: process.env.APP_ENV
})

const db = {
	__modelNames: [
		'user',
		'category',
		'microchat',
		'message'
	]
}

db.__modelNames.forEach(name => {
	const model = sequelize['import'](path.join(__dirname, name))
	db[name] = model
})

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db)
	}
})

db.sequelize = sequelize
db.Sequelize = Sequelize

export default db
