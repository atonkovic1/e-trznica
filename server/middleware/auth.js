const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
	const token = req.header("x-auth-token");

	// Postoji li token
	if (!token) {
		res.status(401).json({ message: "Neautoriziran pristup" });
	} else {
		// Je li token valjan
		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			req.user = decoded.user;

			next();
		} catch (err) {
			res.status(400).json({ message: "Token nije valjan" });
		}
	}
};

module.exports = auth;
