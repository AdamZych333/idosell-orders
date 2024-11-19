const VALID_USERNAME = "username";
const VALID_PASSWORD = "password";

function extractUserFromHeader(header) {
	if (!header) {
		return null;
	}

	const buff = Buffer.from(header, "base64").toString("ascii");
	const parts = buff.split(":");
	const username = parts[0];
	const password = parts.slice(1).join(":");

	return { username, password };
}

function isValidUser(user) {
	return user.username === VALID_USERNAME && user.password === VALID_PASSWORD;
}

exports.authMiddleware = function (req, res, next) {
	const authorization = req.get("Authorization");
	const user = extractUserFromHeader(authorization);

	if (!isValidUser(user)) {
		res.status(401);
		res.send("Invalid username or password");
		return;
	}

	next();
};
