const { Op } = require("sequelize");

exports.mapApiToModel = function (order) {
	const orderID = order.orderId;
	let orderWorth = 0;

	const products = [];
	order?.orderDetails?.productsResults?.forEach((product) => {
		const productID = product.productId;
		const quantity = product.productQuantity;
		const price = product.productOrderPrice;

		orderWorth += Math.round(price * quantity * 100) / 100;

		products.push({ orderID, productID, quantity });
	});

	return { orderID, products, orderWorth };
};

exports.buildListSearch = function (req) {
	const minWorth = Number(req.query.minWorth);
	const maxWorth = Number(req.query.maxWorth);

	const where = {
		orderWorth: {
			[Op.and]: {},
		},
	};

	if (!isNaN(minWorth)) {
		where.orderWorth[Op.and][Op.gte] = minWorth;
	}
	if (!isNaN(maxWorth)) {
		where.orderWorth[Op.and][Op.lte] = maxWorth;
	}

	return where;
};
