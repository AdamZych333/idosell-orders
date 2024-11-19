const express = require("express");
const app = express();
const port = 3000;

const { authMiddleware } = require("./src/middlewares/authMiddleware");
app.use(authMiddleware);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
