const express = require("express");
const router = express.Router();
const database = require("../../database");
const auth = require("../../middleware/auth");

// GET /api/admin_page_post_offices/post_offices
// Dohvati sve poštanske urede
router.get("/post_offices", auth, (req, res) => {
	database.query(
		"SELECT postanski_ured.post_broj, postanski_ured.naziv_post_ureda, postanski_ured.sif_zupanije, zupanija.naziv_zupanije FROM postanski_ured JOIN zupanija ON postanski_ured.sif_zupanije = zupanija.sif_zupanije;",
		[],
		(results) => {
			for (const item of results) {
				if (item.naziv_zupanije.includes("županija")) {
					let county = item.naziv_zupanije.split(" ");
					county.pop();
					item.naziv_zupanije = county.join(" ");
				}
			}

			res.send(results);
		}
	);
});

// POST /api/admin_page_post_offices/post_office
// Dodaj novi poštanski ured
router.post("/post_office", auth, (req, res) => {
	const { postalCode, postOfficeName, countyId } = req.body;

	database.query(
		"SELECT post_broj, naziv_post_ureda FROM postanski_ured WHERE post_broj = $1 OR naziv_post_ureda = $2;",
		[postalCode, postOfficeName],
		(results) => {
			if (results.length !== 0) {
				res.status(400).json({
					message:
						"Greška! Poštanski ured s tim brojem ili nazivom već postoji",
				});
			} else {
				database.query(
					"INSERT INTO postanski_ured(post_broj, naziv_post_ureda, sif_zupanije) VALUES ($1, $2, $3);",
					[postalCode, postOfficeName, countyId],
					(results) => {
						res.send(results);
					}
				);
			}
		}
	);
});

// PUT /api/admin_page_post_offices/post_office
// Uredi poštanski ured
router.put("/post_office", auth, (req, res) => {
	const {
		oldPostalCode,
		newPostalCode,
		newPostOfficeName,
		newCountyId,
	} = req.body;

	database.query(
		"SELECT post_broj FROM postanski_ured WHERE naziv_post_ureda = $1 OR post_broj = $2;",
		[newPostOfficeName, newPostalCode],
		(results) => {
			if (
				results.length > 1 ||
				(results.length === 1 && results[0].post_broj !== oldPostalCode)
			) {
				res.status(400).json({
					message:
						"Greška! Poštanski ured s tim brojem ili nazivom već postoji",
				});
			} else {
				database.query(
					"UPDATE postanski_ured SET post_broj = $1, naziv_post_ureda = $2, sif_zupanije = $3 WHERE post_broj = $4;",
					[newPostalCode, newPostOfficeName, newCountyId, oldPostalCode],
					(results) => {
						res.send(results);
					}
				);
			}
		}
	);
});

// DELETE /api/admin_page_post_offices/post_office/:id
// Obriši poštanski ured
router.delete("/post_office/:id", auth, (req, res) => {
	database.query(
		"SELECT sif_korisnika FROM korisnik WHERE pbr_mjesta_stanovanja = $1;",
		[req.params.id],
		(results) => {
			if (results.length !== 0) {
				res.status(400).json({
					message:
						"Poštanski ured se ne može obrisati jer postoje korisnici koji o njemu ovise",
				});
			} else {
				database.query(
					"DELETE FROM postanski_ured WHERE post_broj = $1;",
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
