export default (sequelize, DataTypes) => {
	const model = sequelize.define('category', {
		id: {
			primaryKey: true,
			type: DataTypes.STRING
		},
		name: {
			type: DataTypes.STRING,
		}
	})

	return model
}
