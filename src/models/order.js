const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrderModel = sequelize.define(
	"Order",
	{
		orderID: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		orderWorth: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
	},
	{
		indexes: [{ unique: true, fields: ["orderID"] }],
		createdAt: false,
		updatedAt: false,
	}
);

module.exports = {
	OrderModel,
};
