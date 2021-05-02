const express = require("express");
const router = express.Router();
const database = require("../../database");

// GET /api/register_page/post_offices
// Get all post offices
router.get("/post_offices", (req, res) => {
	database.query(
		"SELECT post_broj, naziv_post_ureda FROM postanski_ured;",
		[],
		(results) => {
			res.send(results);
		}
	);
});

module.exports = router;
