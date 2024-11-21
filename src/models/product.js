const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductModel = sequelize.define(
	"Product",
	{
		productID: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		quantity: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	},
	{
		createdAt: false,
		updatedAt: false,
	}
);

const { OrderModel } = require("./order");

OrderModel.hasMany(ProductModel, { foreignKey: "orderID" });

module.exports = {
	ProductModel,
};
