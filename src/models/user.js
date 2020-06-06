export default (sequelize, DataTypes) => {

	const User = sequelize.define('user', {
		id: {
			primaryKey: true,
			type: DataTypes.STRING
		},
		first_name: {
			type: DataTypes.STRING,
		},
		last_name: {
			type: DataTypes.STRING,
		},
		login: {
			type: DataTypes.STRING,
		},
		password: {
			type: DataTypes.STRING,
		},
		token: {
			type: DataTypes.STRING,
		}
	});

	return User;
}
