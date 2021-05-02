const express = require("express");
const router = express.Router();
const database = require("../../database");
const auth = require("../../middleware/auth");

// GET /api/customer_profile_page/customer_data/:id
// Dohvati podatke o kupcu/korisniku
router.get("/customer_data/:id", (req, res) => {
	database.query(
		"SELECT korisnik.sif_korisnika, korisnik.ime, korisnik.prezime, korisnik.pbr_mjesta_stanovanja, korisnik.adresa_stanovanja, postanski_ured.naziv_post_ureda, zupanija.sif_zupanije, zupanija.naziv_zupanije, korisnik.broj_telefona, korisnik.email FROM korisnik JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije WHERE korisnik.sif_korisnika = $1;",
		[req.params.id],
		(results) => {
			res.send(results[0]);
		}
	);
});

// GET /api/customer_profile_page/orders/:id
// Dohvati narudžbe kupca
router.get("/orders/:id", auth, (req, res) => {
	database.query(
		"SELECT narudzba.sif_narudzbe, narudzba.kolicina, narudzba.dostavljena, narudzba.datum_dostave, oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, poljoprivrednik.ime_gospodarstva, korisnik.sif_korisnika, korisnik.pbr_mjesta_stanovanja, korisnik.adresa_stanovanja, postanski_ured.naziv_post_ureda, zupanija.naziv_zupanije, korisnik.broj_telefona, korisnik.email, narudzba.datum_narudzbe, poljoprivrednik.rok_isporuke_dani FROM narudzba JOIN oglas ON narudzba.sif_oglasa = oglas.sif_oglasa JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON poljoprivrednik.sif_poljoprivrednika = oglas.sif_autora JOIN korisnik ON poljoprivrednik.sif_korisnika = korisnik.sif_korisnika JOIN postanski_ured ON korisnik.pbr_mjesta_stanovanja = postanski_ured.post_broj JOIN zupanija ON postanski_ured.sif_zupanije = zupanija.sif_zupanije WHERE narudzba.sif_kupca = $1;",
		[req.params.id],
		(results) => {
			results.forEach((item) => {
				item.datum_narudzbe = new Date(item.datum_narudzbe).toLocaleDateString(
					"hr-HR"
				);

				item.datum_dostave = new Date(item.datum_dostave).toLocaleDateString(
					"hr-HR"
				);
			});

			results["slike"] = [];

			res.send(results);
		}
	);
});

// GET /api/customer_profile_page/product_images/:id
// Dohvati slike oglasa
router.get("/product_images/:id", auth, (req, res) => {
	database.query(
		"SELECT url_slike FROM slika_oglasa WHERE sif_oglasa = $1;",
		[req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

// GET /api/customer_profile_page/farmer_ratings/:id
// Dohvati korisnikove ocjene poljoprivrednika
router.get("/farmer_ratings/:id", (req, res) => {
	database.query(
		"SELECT ocjena_poljoprivrednika.sif_ocjene, poljoprivrednik.ime_gospodarstva, ocjena_poljoprivrednika.ocjena, ocjena_poljoprivrednika.komentar, ocjena_poljoprivrednika.datum_kreiranja, korisnik.sif_korisnika FROM ocjena_poljoprivrednika JOIN poljoprivrednik ON ocjena_poljoprivrednika.sif_poljoprivrednika = poljoprivrednik.sif_poljoprivrednika JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika WHERE ocjena_poljoprivrednika.sif_autora = $1;",
		[req.params.id],
		(results) => {
			results.forEach((item) => {
				item.datum_kreiranja = new Date(
					item.datum_kreiranja
				).toLocaleDateString("hr-HR");
			});

			res.send(results);
		}
	);
});

// GET /api/customer_profile_page/product_ratings/:id
// Dohvati korisnikove ocjene oglasa
router.get("/product_ratings/:id", (req, res) => {
	database.query(
		"SELECT ocjena_oglasa.sif_ocjene, vrsta_proizvoda.naziv_vrste_proizvoda, oglas.sif_oglasa, oglas.opis_oglasa, poljoprivrednik.ime_gospodarstva, ocjena_oglasa.ocjena, ocjena_oglasa.komentar, ocjena_oglasa.datum_kreiranja FROM ocjena_oglasa JOIN oglas ON oglas.sif_oglasa = ocjena_oglasa.sif_oglasa JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON poljoprivrednik.sif_poljoprivrednika = oglas.sif_autora JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika WHERE ocjena_oglasa.sif_autora = $1;",
		[req.params.id],
		(results) => {
			results.forEach((item) => {
				item.datum_kreiranja = new Date(
					item.datum_kreiranja
				).toLocaleDateString("hr-HR");
			});

			res.send(results);
		}
	);
});

// PUT /api/customer_profile_page/customer_info/
// Promijeni podatke o korisniku/kupcu
router.put("/customer_info", auth, (req, res) => {
	const {
		userId,
		firstName,
		lastName,
		address,
		postalCode,
		phoneNumber,
		oldEmail,
		email,
	} = req.body;

	// Dohvati sve korisnike (emailove korisnika) i provjeri postoji li već email koji se želi dodati
	database.query(
		"SELECT email FROM korisnik WHERE email != $1;",
		[oldEmail],
		(results) => {
			if (results.map((item) => item.email).includes(email)) {
				res.status(400).json({
					message: "Greška! Korisnik s unesenom e-mail adresom već postoji",
				});
			} else {
				editUser();
			}
		}
	);

	// Promijeni podatke o korisniku
	const editUser = () => {
		database.query(
			"UPDATE korisnik SET ime = $1, pbr_mjesta_stanovanja = $2, adresa_stanovanja = $3, broj_telefona = $4, email = $5, prezime = $6 WHERE sif_korisnika = $7;",
			[firstName, postalCode, address, phoneNumber, email, lastName, userId],
			(results) => {
				res.send(results);
			}
		);
	};
});

// DELETE /api/customer_profile_page/order/:id
// Obriši narudžbu
router.delete("/order/:id", auth, (req, res) => {
	database.query(
		"DELETE FROM narudzba WHERE sif_narudzbe = $1;",
		[req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

// DELETE /api/customer_profile_page/farmer_rating/:id
// Obriši ocjenu poljoprivrednika
router.delete("/farmer_rating/:id", auth, (req, res) => {
	database.query(
		"DELETE FROM ocjena_poljoprivrednika WHERE sif_ocjene = $1;",
		[req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

// DELETE /api/customer_profile_page/product_rating/:id
// Obriši ocjenu oglasa
router.delete("/product_rating/:id", auth, (req, res) => {
	database.query(
		"DELETE FROM ocjena_oglasa WHERE sif_ocjene = $1;",
		[req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

module.exports = router;
