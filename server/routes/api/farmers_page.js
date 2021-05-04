const express = require("express");
const router = express.Router();
const database = require("../../database");

// GET /api/farmers_page/farmers
// Dohvati poljoprivrednike
router.get("/farmers/:filterType/:filterId", (req, res) => {
	if (parseInt(req.params.filterType) === 0) {
		database.query(
			"SELECT korisnik.sif_korisnika, korisnik.ime, korisnik.prezime, korisnik.pbr_mjesta_stanovanja, korisnik.adresa_stanovanja, postanski_ured.post_broj, zupanija.sif_zupanije, zupanija.naziv_zupanije, korisnik.broj_telefona, korisnik.email, poljoprivrednik.sif_poljoprivrednika, poljoprivrednik.opis_gospodarstva, poljoprivrednik.rok_isporuke_dani, poljoprivrednik.ime_gospodarstva FROM korisnik JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije JOIN poljoprivrednik ON poljoprivrednik.sif_korisnika = korisnik.sif_korisnika;",
			[],
			(results) => {
				res.send(results);
			}
		);
	} else {
		database.query(
			"SELECT korisnik.sif_korisnika, korisnik.ime, korisnik.prezime, korisnik.pbr_mjesta_stanovanja, korisnik.adresa_stanovanja, postanski_ured.post_broj, zupanija.sif_zupanije, zupanija.naziv_zupanije, korisnik.broj_telefona, korisnik.email, poljoprivrednik.sif_poljoprivrednika, poljoprivrednik.opis_gospodarstva, poljoprivrednik.rok_isporuke_dani, poljoprivrednik.ime_gospodarstva FROM korisnik JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije JOIN poljoprivrednik ON poljoprivrednik.sif_korisnika = korisnik.sif_korisnika WHERE zupanija.sif_zupanije = $1;",
			[req.params.filterId],
			(results) => {
				res.send(results);
			}
		);
	}
});

// GET /api/farmers_page/ratings/:id
// Dohvati ocjene poljoprivrednika
router.get("/ratings/:id", (req, res) => {
	database.query(
		"SELECT ocjena_poljoprivrednika.sif_ocjene, ocjena_poljoprivrednika.ocjena, ocjena_poljoprivrednika.sif_autora, korisnik.ime, korisnik.prezime, ocjena_poljoprivrednika.komentar, ocjena_poljoprivrednika.datum_kreiranja FROM ocjena_poljoprivrednika JOIN korisnik ON ocjena_poljoprivrednika.sif_autora = korisnik.sif_korisnika WHERE ocjena_poljoprivrednika.sif_poljoprivrednika = $1;",
		[req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

// GET /api/farmers_page/counties
// Dohvati sve županije
router.get("/counties", (req, res) => {
	database.query(
		"SELECT sif_zupanije, naziv_zupanije FROM zupanija;",
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

module.exports = router;
