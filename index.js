const express = require("express");
const cron = require("node-cron");
const app = express();
const port = 3000;

const { setUpOrderUpdate } = require("./src/cron/updateOrders");
cron.schedule("0 0 * * *", setUpOrderUpdate);
setUpOrderUpdate();

const { authMiddleware } = require("./src/middlewares/authMiddleware");
app.use(authMiddleware);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`App listening on port ${port}`);
});
