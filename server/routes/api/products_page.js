const express = require("express");
const router = express.Router();
const database = require("../../database");

// GET /api/products_page/products
// Dohvati oglase
router.get("/products/:categoryId/:filterType/:filterId", (req, res) => {
	if (req.params.categoryId === "all") {
		if (parseInt(req.params.filterType) === 0) {
			database.query(
				"SELECT oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, oglas.datum_kreiranja, poljoprivrednik.ime_gospodarstva, poljoprivrednik.rok_isporuke_dani, poljoprivrednik.sif_korisnika, zupanija.sif_zupanije FROM oglas JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON oglas.sif_autora = poljoprivrednik.sif_poljoprivrednika JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije;",
				[],
				(results) => {
					results.forEach((item) => {
						item.datum_kreiranja = new Date(
							item.datum_kreiranja
						).toLocaleDateString("hr-HR");
					});

					results["slike"] = [];

					res.send(results);
				}
			);
		} else if (parseInt(req.params.filterType) === 1) {
			database.query(
				"SELECT oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, oglas.datum_kreiranja, poljoprivrednik.ime_gospodarstva, poljoprivrednik.rok_isporuke_dani, poljoprivrednik.sif_korisnika, zupanija.sif_zupanije FROM oglas JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON oglas.sif_autora = poljoprivrednik.sif_poljoprivrednika JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije WHERE zupanija.sif_zupanije = $1;",
				[req.params.filterId],
				(results) => {
					results.forEach((item) => {
						item.datum_kreiranja = new Date(
							item.datum_kreiranja
						).toLocaleDateString("hr-HR");
					});

					results["slike"] = [];

					res.send(results);
				}
			);
		} else {
			database.query(
				"SELECT oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, oglas.datum_kreiranja, poljoprivrednik.ime_gospodarstva, poljoprivrednik.rok_isporuke_dani, poljoprivrednik.sif_korisnika, zupanija.sif_zupanije FROM oglas JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON oglas.sif_autora = poljoprivrednik.sif_poljoprivrednika JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije WHERE poljoprivrednik.sif_korisnika = $1;",
				[req.params.filterId],
				(results) => {
					results.forEach((item) => {
						item.datum_kreiranja = new Date(
							item.datum_kreiranja
						).toLocaleDateString("hr-HR");
					});

					results["slike"] = [];

					res.send(results);
				}
			);
		}
	} else {
		if (parseInt(req.params.filterType) === 0) {
			database.query(
				"SELECT oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, oglas.datum_kreiranja, poljoprivrednik.ime_gospodarstva, poljoprivrednik.rok_isporuke_dani, poljoprivrednik.sif_korisnika, zupanija.sif_zupanije FROM oglas JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON oglas.sif_autora = poljoprivrednik.sif_poljoprivrednika JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije WHERE oglas.sif_proizvoda = $1;",
				[parseInt(req.params.categoryId)],
				(results) => {
					results.forEach((item) => {
						item.datum_kreiranja = new Date(
							item.datum_kreiranja
						).toLocaleDateString("hr-HR");
					});

					results["slike"] = [];

					res.send(results);
				}
			);
		} else if (parseInt(req.params.filterType) === 1) {
			database.query(
				"SELECT oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, oglas.datum_kreiranja, poljoprivrednik.ime_gospodarstva, poljoprivrednik.rok_isporuke_dani, poljoprivrednik.sif_korisnika, zupanija.sif_zupanije FROM oglas JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON oglas.sif_autora = poljoprivrednik.sif_poljoprivrednika JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije WHERE oglas.sif_proizvoda = $1 AND zupanija.sif_zupanije = $2;",
				[parseInt(req.params.categoryId), req.params.filterId],
				(results) => {
					results.forEach((item) => {
						item.datum_kreiranja = new Date(
							item.datum_kreiranja
						).toLocaleDateString("hr-HR");
					});

					results["slike"] = [];

					res.send(results);
				}
			);
		} else {
			database.query(
				"SELECT oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, oglas.datum_kreiranja, poljoprivrednik.ime_gospodarstva, poljoprivrednik.rok_isporuke_dani, poljoprivrednik.sif_korisnika, zupanija.sif_zupanije FROM oglas JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON oglas.sif_autora = poljoprivrednik.sif_poljoprivrednika JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije WHERE oglas.sif_proizvoda = $1 AND poljoprivrednik.sif_korisnika = $2;",
				[parseInt(req.params.categoryId), req.params.filterId],
				(results) => {
					results.forEach((item) => {
						item.datum_kreiranja = new Date(
							item.datum_kreiranja
						).toLocaleDateString("hr-HR");
					});

					results["slike"] = [];

					res.send(results);
				}
			);
		}
	}
});

// GET /api/products_page/product_images/:id
// Dohvati slike oglasa
router.get("/product_images/:id", (req, res) => {
	database.query(
		"SELECT sif_slike, url_slike FROM slika_oglasa WHERE sif_oglasa = $1;",
		[req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

// GET /api/products_page/counties
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

// GET /api/products_page/farmers
// Dohvati sve poljoprivrednike
router.get("/farmers", (req, res) => {
	database.query(
		"SELECT sif_korisnika, sif_poljoprivrednika, ime_gospodarstva FROM poljoprivrednik;",
		[],
		(results) => {
			res.send(results);
		}
	);
});

module.exports = router;
