const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ProductModel = sequelize.define(
	"product",
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
		indexes: [{ unique: true, fields: ["orderID", "productID"] }],
		createdAt: false,
		updatedAt: false,
	}
);

const { OrderModel } = require("./order");

OrderModel.hasMany(ProductModel, { foreignKey: "orderID" });

module.exports = {
	ProductModel,
};
