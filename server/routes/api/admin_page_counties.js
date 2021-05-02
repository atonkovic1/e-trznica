const express = require("express");
const router = express.Router();
const database = require("../../database");
const auth = require("../../middleware/auth");

// GET /api/admin_page_counties/counties
// Dohvati sve županije
router.get("/counties", auth, (req, res) => {
	database.query(
		"SELECT sif_zupanije, naziv_zupanije FROM zupanija;",
		[],
		(results) => {
			res.send(results);
		}
	);
});

// POST /api/admin_page_counties/county
// Dodaj novu županiju
router.post("/county", auth, (req, res) => {
	const { countyId, countyName } = req.body;

	database.query(
		"SELECT sif_zupanije FROM zupanija WHERE naziv_zupanije = $1 OR sif_zupanije = $2;",
		[countyName, countyId],
		(results) => {
			if (results.length !== 0) {
				res.status(400).json({
					message: "Greška! Županija s tim imenom ili šifrom već postoji",
				});
			} else {
				database.query(
					"INSERT INTO zupanija(sif_zupanije, naziv_zupanije) VALUES ($1, $2);",
					[countyId, countyName],
					(results) => {
						res.send(results);
					}
				);
			}
		}
	);
});

// PUT /api/admin_page_counties/county
// Uredi županiju
router.put("/county", auth, (req, res) => {
	const { oldCountyId, newCountyId, newCountyName } = req.body;

	database.query(
		"SELECT sif_zupanije FROM zupanija WHERE naziv_zupanije = $1 OR sif_zupanije = $2;",
		[newCountyName, newCountyId],
		(results) => {
			if (
				results.length > 1 ||
				(results.length === 1 && results[0].sif_zupanije !== oldCountyId)
			) {
				res.status(400).json({
					message: "Greška! Županija s tim imenom ili šifrom već postoji",
				});
			} else {
				database.query(
					"UPDATE zupanija SET sif_zupanije = $1, naziv_zupanije = $2 WHERE sif_zupanije = $3;",
					[newCountyId, newCountyName, oldCountyId],
					(results) => {
						res.send(results);
					}
				);
			}
		}
	);
});

// DELETE /api/admin_page_counties/county/:id
// Obriši županiju
router.delete("/county/:id", auth, (req, res) => {
	database.query(
		"SELECT post_broj FROM postanski_ured WHERE sif_zupanije = $1;",
		[req.params.id],
		(results) => {
			if (results.length !== 0) {
				res.status(400).json({
					message:
						"Županija se ne može obrisati jer postoje poštanski uredi koji o njoj ovise",
				});
			} else {
				database.query(
					"DELETE FROM zupanija WHERE sif_zupanije = $1;",
					[req.params.id],
					(results) => {
						res.send(results);
					}
				);
			}
		}
	);
});

module.exports = router;
