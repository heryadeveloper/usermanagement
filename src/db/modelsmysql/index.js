const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const config = require(`${__dirname}/../../config/configmysql`);

const basename = path.basename(module.filename);

const db = {};

const sequelize = new Sequelize(
    config.sqlDB.databasemysql,
    config.sqlDB.usermysql,
    config.sqlDB.passwordmysql,
    {
        ...config.sqlDB,
        logging: false,
    }
);

fs.readdirSync(__dirname)
	.filter(
		(file) =>
			file.indexOf('.') !== 0 &&
			file !== basename &&
			file.slice(-9) === '.model.js'
	)
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(
			sequelize,
			Sequelize.DataTypes
		);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

// Menambahkan fungsi untuk menjalankan kueri mentah
db.query = async (query, options = {}) => {
    try {
        const result = await sequelize.query(query, options);
        return result;
    } catch (error) {
        console.error('Error executing raw query:', error);
        throw error;
    }
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;