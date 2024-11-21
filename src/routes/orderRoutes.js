"use strict";
module.exports = function (options) {
	const app = options.app;
	const orderController = require("../controllers/orderController");

	app.route("/order").get(orderController.listOrders);
};
