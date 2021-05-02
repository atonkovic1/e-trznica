const express = require("express");
const router = express.Router();
const database = require("../../database");
const auth = require("../../middleware/auth");

// GET /api/admin_page_categories/categories
// Dohvati sve vrste proizvoda
router.get("/categories", auth, (req, res) => {
	database.query(
		"SELECT a.sif_vrste_proizvoda, a.naziv_vrste_proizvoda, a.sif_nadvrste_proizvoda, b.naziv_vrste_proizvoda AS naziv_nadvrste_proizvoda FROM vrsta_proizvoda AS a LEFT JOIN vrsta_proizvoda AS b ON a.sif_nadvrste_proizvoda = b.sif_vrste_proizvoda;",
		[],
		(results) => {
			res.send(results);
		}
	);
});

// POST /api/admin_page_categories/category
// Dodaj novu vrstu proizvoda
router.post("/category", auth, (req, res) => {
	const { categoryName, masterCategoryId } = req.body;

	database.query(
		"SELECT sif_vrste_proizvoda FROM vrsta_proizvoda WHERE naziv_vrste_proizvoda = $1;",
		[categoryName],
		(results) => {
			if (results.length !== 0) {
				res.status(400).json({
					message: "Greška! Vrsta proizvoda s tim imenom već postoji",
				});
			} else {
				if (masterCategoryId !== "NULL") {
					database.query(
						"INSERT INTO vrsta_proizvoda(naziv_vrste_proizvoda, sif_nadvrste_proizvoda) VALUES ($1, $2);",
						[categoryName, masterCategoryId],
						(results) => {
							res.send(results);
						}
					);
				} else {
					database.query(
						"INSERT INTO vrsta_proizvoda(naziv_vrste_proizvoda, sif_nadvrste_proizvoda) VALUES ($1, NULL);",
						[categoryName],
						(results) => {
							res.send(results);
						}
					);
				}
			}
		}
	);
});

// PUT /api/admin_page_categories/category
// Uredi vrstu proizvoda
router.put("/category", auth, (req, res) => {
	const { categoryId, newCategoryName, newMasterCategoryId } = req.body;

	database.query(
		"SELECT sif_vrste_proizvoda FROM vrsta_proizvoda WHERE naziv_vrste_proizvoda = $1;",
		[newCategoryName],
		(results) => {
			if (
				results.length === 1 &&
				results[0].sif_vrste_proizvoda !== categoryId
			) {
				res.status(400).json({
					message: "Greška! Vrsta proizvoda s tim imenom već postoji",
				});
			} else {
				if (newMasterCategoryId !== "NULL") {
					database.query(
						"UPDATE vrsta_proizvoda SET naziv_vrste_proizvoda = $1, sif_nadvrste_proizvoda = $2 WHERE sif_vrste_proizvoda = $3;",
						[newCategoryName, newMasterCategoryId, categoryId],
						(results) => {
							res.send(results);
						}
					);
				} else {
					database.query(
						"UPDATE vrsta_proizvoda SET naziv_vrste_proizvoda = $1, sif_nadvrste_proizvoda = NULL WHERE sif_vrste_proizvoda = $3;",
						[newCategoryName, categoryId],
						(results) => {
							res.send(results);
						}
					);
				}
			}
		}
	);
});

// DELETE /api/admin_page_categories/category/:id
// Obriši vrstu proizvoda
router.delete("/category/:id", auth, (req, res) => {
	database.query(
		"SELECT sif_oglasa FROM oglas WHERE sif_proizvoda = $1;",
		[req.params.id],
		(results) => {
			if (results.length !== 0) {
				res.status(400).json({
					message:
						"Vrsta proizvoda se ne može obrisati jer postoje oglasi koji o njoj ovise",
				});
			} else {
				database.query(
					"DELETE FROM vrsta_proizvoda WHERE sif_vrste_proizvoda = $1;",
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
