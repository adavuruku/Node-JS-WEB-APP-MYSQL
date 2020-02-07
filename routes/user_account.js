var connection = require('./dbconnection');
const Sequelize = require('sequelize');
const postUser = connection.define('userrecord', {
	id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	FullName: {type: Sequelize.STRING},
	userID: {type: Sequelize.STRING},
	userPassword: {type: Sequelize.STRING},
	//createdAt: {type: Sequelize.STRING,defaultValue: ""},
	//updatedAt: {type: Sequelize.STRING,defaultValue: ""}
});
module.exports = postUser;