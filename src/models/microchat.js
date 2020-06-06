export default (sequelize, DataTypes) => {
	const model = sequelize.define('MicroChat', {
		id: {
			primaryKey: true,
			type: DataTypes.STRING
		},
		title: {
			type: DataTypes.STRING,
		},
		description: {
			type: DataTypes.TEXT,
		}
	})

	model.associate = models => {
		model.belongsTo(models.message, {
			foreignKey: 'parent_id',
			targetKey: 'id'
		})
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
