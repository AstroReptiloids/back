export default (sequelize, DataTypes) => {
	const model = sequelize.define('message', {
		id: {
			primaryKey: true,
			type: DataTypes.STRING
		},
		text: {
			type: DataTypes.TEXT,
		},
		microchat_id: {
			type: DataTypes.STRING,
		}
	})

	model.associate = models => {
		model.belongsTo(models.user, {
			foreignKey: 'user_id',
			targetKey: 'id'
		})
		model.belongsTo(models.message, {
			foreignKey: 'reference_id',
			targetKey: 'id'
		})
	}

	return model
}
