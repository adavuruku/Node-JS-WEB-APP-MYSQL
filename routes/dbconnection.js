const Sequelize = require('sequelize');
const sequelize = new Sequelize('addressbook', 'root', 'root', {
  host: '127.0.0.1', //dont use localhost 
  dialect: 'mysql',
  pool: {max: 5,min: 0,idle: 10}
});
module.exports = sequelize;