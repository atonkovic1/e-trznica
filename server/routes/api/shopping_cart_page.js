const express = require("express");
const router = express.Router();
const database = require("../../database");
const auth = require("../../middleware/auth");

// GET /api/shopping_cart_page/product_data/:id
// Dohvati podatke o oglasu
router.get("/product_data/:id", (req, res) => {
	database.query(
		"SELECT oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.sif_mjerne_jedinice, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, korisnik.sif_korisnika, korisnik.ime, korisnik.prezime, poljoprivrednik.ime_gospodarstva, poljoprivrednik.rok_isporuke_dani, korisnik.broj_telefona, korisnik.email, oglas.datum_kreiranja FROM oglas JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON poljoprivrednik.sif_poljoprivrednika = oglas.sif_autora JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika WHERE oglas.sif_oglasa = $1;",
		[req.params.id],
		(results) => {
			results.forEach((item) => {
				item.datum_kreiranja = new Date(
					item.datum_kreiranja
				).toLocaleDateString("hr-HR");
			});

			results["slike"] = [];

			res.send(results[0]);
		}
	);
});

// GET /api/shopping_cart_page/product_images/:id
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

// POST /api/shopping_cart_page/order
// Naruči proizvode
router.post("/order", auth, (req, res) => {
	const { quantity, productId, customerId } = req.body;

	database.query(
		"INSERT INTO narudzba(kolicina, sif_oglasa, sif_kupca, datum_narudzbe, dostavljena) VALUES ($1, $2, $3, current_date, false);",
		[quantity, productId, customerId],
		(results) => {
			res.send(results);
		}
	);
});

module.exports = router;
