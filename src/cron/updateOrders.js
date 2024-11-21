const idosell = require("@api/idosell");
const dotenv = require("dotenv").config();
const apiKey = dotenv.parsed.IDOSELL_API_KEY;
const domain = dotenv.parsed.ORDERS_SOURCE_URL;
const url = `https://${domain}/api/admin/v3`;
idosell.auth(apiKey);
idosell.server(url);

const sequelize = require("../config/database");
const { OrderModel } = require("../models/order");
const { ProductModel } = require("../models/product");

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

		orderWorth += Math.round(price * quantity * 100) / 100;

		products.push({ orderID, productID, quantity });
	});

	return { orderID, products, orderWorth };
}

async function updateOrders(newOrders) {
	console.log({ newOrders });
	const transaction = await sequelize.transaction();
	try {
		const newProducts = newOrders.flatMap((o) => o.products);

		await OrderModel.bulkCreate(newOrders, {
			fields: ["orderID", "orderWorth"],
			updateOnDuplicate: ["orderID", "orderWorth"],
		});

		await ProductModel.bulkCreate(newProducts, {
			fields: ["productID", "quantity", "orderID"],
			updateOnDuplicate: ["productID", "quantity", "orderID"],
		});

		await transaction.commit();
	} catch (err) {
		await transaction.rollback();
		console.error("Update Orders", { err });
	}
}

exports.setUpOrderUpdate = async () => {
	console.log("set up order update");

	let page = 1;
	let pageLimit = 1;
	const newOrders = [];
	do {
		const pageData = await fetchOrders({ page });
		if (!pageData) {
			continue;
		}
		pageLimit = pageData.resultsNumberPage;

		newOrders.push(...(pageData.Results?.map(mapOrder) || []));
	} while (page++ < pageLimit);

	await updateOrders(newOrders);
};
