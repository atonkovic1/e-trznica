const express = require("express");
const router = express.Router();
const database = require("../../database");
const auth = require("../../middleware/auth");

// GET /api/admin_page_units/units
// Dohvati sve mjerne jedinice
router.get("/units", auth, (req, res) => {
	database.query(
		"SELECT sif_mjerne_jedinice, oznaka_mjerne_jedinice FROM mjerna_jedinica;",
		[],
		(results) => {
			res.send(results);
		}
	);
});

// POST /api/admin_page_units/unit
// Dodaj novu mjernu jedinicu
router.post("/unit", auth, (req, res) => {
	const { unitName } = req.body;

	database.query(
		"SELECT sif_mjerne_jedinice FROM mjerna_jedinica WHERE oznaka_mjerne_jedinice = $1;",
		[unitName],
		(results) => {
			if (results.length !== 0) {
				res.status(400).json({
					message: "Greška! Ta mjerna jedinica već postoji",
				});
			} else {
				database.query(
					"INSERT INTO mjerna_jedinica(oznaka_mjerne_jedinice) VALUES ($1);",
					[unitName],
					(results) => {
						res.send(results);
					}
				);
			}
		}
	);
});

// PUT /api/admin_page_units/unit
// Uredi mjernu jedinicu
router.put("/unit", auth, (req, res) => {
	const { unitId, newUnitName } = req.body;

	database.query(
		"SELECT sif_mjerne_jedinice FROM mjerna_jedinica WHERE oznaka_mjerne_jedinice = $1;",
		[newUnitName],
		(results) => {
			if (results.length === 1 && results[0].sif_mjerne_jedinice !== unitId) {
				res.status(400).json({
					message: "Greška! Ta mjerna jedinica već postoji",
				});
			} else {
				database.query(
					"UPDATE mjerna_jedinica SET oznaka_mjerne_jedinice = $1 WHERE sif_mjerne_jedinice = $2;",
					[newUnitName, unitId],
					(results) => {
						res.send(results);
					}
				);
			}
		}
	);
});

// DELETE /api/admin_page_units/unit/:id
// Obriši mjernu jedinicu
router.delete("/unit/:id", auth, (req, res) => {
	database.query(
		"SELECT sif_oglasa FROM oglas WHERE sif_mjerne_jedinice = $1;",
		[req.params.id],
		(results) => {
			if (results.length !== 0) {
				res.status(400).json({
					message:
						"Mjerna jedinica se ne može obrisati jer postoje oglasi koji o njoj ovise",
				});
			} else {
				database.query(
					"DELETE FROM mjerna_jedinica WHERE sif_mjerne_jedinice = $1;",
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
