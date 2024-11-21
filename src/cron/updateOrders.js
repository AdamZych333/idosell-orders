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

const { mapApiToModel } = require("../services/orderService");

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

		newOrders.push(...(pageData.Results?.map(mapApiToModel) || []));
	} while (page++ < pageLimit);

	await updateOrders(newOrders);
};
