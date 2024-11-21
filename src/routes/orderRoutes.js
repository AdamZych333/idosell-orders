module.exports = function (options) {
	const app = options.app;
	const orderController = require("../controllers/orderController");

	app.route("/order").get(orderController.listOrders);

	app.route("/order/download").get(orderController.downloadAsCsv);

	app.route("/order/:orderId").get(orderController.getOrder);
};
