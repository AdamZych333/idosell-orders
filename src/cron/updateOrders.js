const idosell = require("@api/idosell");
const dotenv = require("dotenv").config();
const apiKey = dotenv.parsed.IDOSELL_API_KEY;
const domain = dotenv.parsed.ORDERS_SOURCE_URL;
const url = `https://${domain}/api/admin/v3`;
idosell.auth(apiKey);
idosell.server(url);

async function fetchOrders({ page }) {
	const params = {
		resultsLimit: 100,
		resultsPage: page,
		ordersBy: "adding_time",
	};

	try {
		let response = await idosell.ordersOrdersGetPost({ params }).then((res) => res.data);

		return response;
	} catch (err) {
		console.error(err);
		return null;
	}
}

function mapOrder(order) {
	const orderID = order.orderId;

	let orderWorth = 0;
	const products = [];
	order?.orderDetails?.productsResults?.forEach((product) => {
		const productID = product.productId;
		const quantity = product.productQuantity;
		const price = product.productOrderPrice;

		products.push({ productID, quantity });
		orderWorth += Math.round(price * quantity * 100) / 100;
	});

	return { orderID, orderWorth, products };
}

exports.setUpOrderUpdate = async () => {
	console.log("set up order update");

	let page = 1;
	let pageLimit = 1;
	const orders = [];
	do {
		const pageData = await fetchOrders({ page });
		if (!pageData) {
			continue;
		}
		pageLimit = pageData.resultsNumberPage;

		orders.push(...(pageData.Results?.map(mapOrder) || []));
	} while (page++ < pageLimit);

	console.log({ orders });
};
