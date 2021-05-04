const { Pool } = require("pg");

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

pool.on("error", (err) => {
	console.error("Error on idle client", err);
	process.exit(-1);
});

const query = (text, params, callback) => {
	pool.connect((err, client, release) => {
		if (err) {
			console.error("Error acquiring client", err.stack);
			return callback([]);
		}

		client.query(text, params, (err, res) => {
			release();

			if (err) {
				console.error("Error executing query", err.stack);
				return callback([]);
			}

			return callback(res.rows);
		});
	});
};

module.exports = {
	query,
};
