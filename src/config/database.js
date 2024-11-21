const { Sequelize } = require("sequelize");
const dotenv = require("dotenv").config();
const host = dotenv.parsed.DB_HOST;
const user = dotenv.parsed.DB_USER;
const password = dotenv.parsed.DB_PASSWORD;
const database = dotenv.parsed.DB_DATABASE;

module.exports = new Sequelize(database, user, password, {
	host: host,
	dialect: "mysql",
});
