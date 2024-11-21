const { OrderModel } = require("../models/order");
const { ProductModel } = require("../models/product");
const { buildListSearch } = require("../services/orderService");

exports.listOrders = async function (req, res) {
	const where = buildListSearch(req);

	try {
		const orders = await OrderModel.findAll({
			where,
			include: [
				{
					model: ProductModel,
					attributes: ["productID", "quantity"],
				},
			],
		});

		res.send({ orders });
	} catch (err) {
		res.status(500);
		res.send(err);
	}
};

exports.getOrder = async function (req, res) {
	const orderID = req.params.orderId;

	try {
		const order = await OrderModel.findOne({
			where: { orderID },
			include: [
				{
					model: ProductModel,
					attributes: ["productID", "quantity"],
				},
			],
		});

		res.send(order);
	} catch (err) {
		res.status(500);
		res.send(err);
	}
};
