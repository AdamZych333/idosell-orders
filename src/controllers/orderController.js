const { Op } = require("sequelize");

const { OrderModel } = require("../models/order");
const { ProductModel } = require("../models/product");

const { mapModelToSummary } = require("../services/orderService");

exports.listOrders = async function (req, res) {
	const minWorth = Number(req.query.minWorth);
	const maxWorth = Number(req.query.maxWorth);

	const where = {
		orderWorth: {
			[Op.and]: {},
		},
	};

	if (!isNaN(minWorth)) {
		where.orderWorth[Op.and][Op.gt] = minWorth;
	}
	if (!isNaN(maxWorth)) {
		where.orderWorth[Op.and][Op.lt] = maxWorth;
	}

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
