import app from './app'
import db from './models'

db.sequelize.sync().then(() => {
	app.listen(3000)
})
