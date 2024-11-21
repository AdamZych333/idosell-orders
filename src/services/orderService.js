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

exports.mapModelToSummary = function (order) {
	let orderWorth = 0;

	const products = order.products.map((p) => {
		const price = p.orderProduct?.price || 0;
		const quantity = p.orderProduct?.quantity || 0;

		orderWorth += price * quantity;

		return {
			productID: p.productID,
			quantity,
		};
	});

	return { orderID: order.orderID, orderWorth, products };
};
