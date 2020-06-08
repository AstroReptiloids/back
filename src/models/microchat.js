export default (sequelize, DataTypes) => {
	const model = sequelize.define('microchat', {
		id: {
			primaryKey: true,
			type: DataTypes.STRING
		},
		title: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.TEXT,
		},
		message_count: {
			type: DataTypes.INTEGER,
		},
		microchats_count: {
			type: DataTypes.INTEGER,
		},
		people_count: {
			type: DataTypes.INTEGER,
		},
		hot: {
			type: DataTypes.INTEGER,
		},
		parent_id: {
			type: DataTypes.STRING,
		}
	})

	model.associate = models => {
		model.belongsTo(models.user, {
			foreignKey: 'creator_id',
			targetKey: 'id'
		})
		model.belongsTo(models.category, {
			foreignKey: 'category_id',
			targetKey: 'id'
		})
	}

	return model
}
