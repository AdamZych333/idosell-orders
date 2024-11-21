const express = require("express");
const cron = require("node-cron");
const db = require("./src/config/database");

const app = express();
const port = 3000;

const { setUpOrderUpdate } = require("./src/cron/updateOrders");
setUpOrderUpdate();
cron.schedule("0 0 * * *", setUpOrderUpdate);

const { authMiddleware } = require("./src/middlewares/authMiddleware");
app.use(authMiddleware);

const routeOptions = { app };

require("./src/routes/orderRoutes")(routeOptions);

const { OrderModel } = require("./src/models/order");
const { ProductModel } = require("./src/models/product");

const initApp = async () => {
	try {
		await db.authenticate();

		OrderModel.sync({ alter: true });
		ProductModel.sync({ alter: true });

		app.listen(port, () => {
			console.log(`App listening on port ${port}`);
		});
	} catch (err) {
		console.error("Unable to connect to the database.");
	}
};

initApp();
