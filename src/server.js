import app from './app'
import db from './models'

process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const config = {
	port: process.env.PORT || 3000,
	env: process.env.NODE_ENV
}

db.sequelize.sync().then(() => {
	app.listen(config.port, config.ip)
})
