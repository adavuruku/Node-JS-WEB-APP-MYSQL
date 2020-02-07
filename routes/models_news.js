var connection = require('./dbconnection');
const Sequelize = require('sequelize');
const postVal = connection.define('postrecord', {
	id: {type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true},
	author: {type: Sequelize.STRING},
	postId: {type: Sequelize.STRING},
	postTitle: {type: Sequelize.STRING},
	postBody: {type: Sequelize.TEXT},
	postType: {type: Sequelize.STRING},
	postDate: {type: Sequelize.DATE, defaultValue: Sequelize.NOW },
	del_status: {type: Sequelize.STRING},
	//createdAt: {type: Sequelize.STRING,defaultValue: ""},
	//updatedAt: {type: Sequelize.STRING,defaultValue: ""}
});
module.exports = postVal;