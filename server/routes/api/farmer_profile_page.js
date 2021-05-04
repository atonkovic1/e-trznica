const express = require("express");
const router = express.Router();
const database = require("../../database");
const auth = require("../../middleware/auth");
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

const s3 = new AWS.S3();

const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: "e-trznica",
		acl: "public-read",
		contentType: multerS3.AUTO_CONTENT_TYPE,
		key: (req, file, callback) => {
			callback(
				null,
				`farmer-profiles-images/${req.params.id}/${file.originalname}`
			);
		},
	}),
});

// GET /api/farmer_profile_page/farmer_data/:id
// Dohvati podatke o poljoprivredniku/korisniku
router.get("/farmer_data/:id", (req, res) => {
	database.query(
		"SELECT korisnik.sif_korisnika, korisnik.ime, korisnik.prezime, korisnik.pbr_mjesta_stanovanja, korisnik.adresa_stanovanja, postanski_ured.naziv_post_ureda, zupanija.sif_zupanije, zupanija.naziv_zupanije, korisnik.broj_telefona, korisnik.email, poljoprivrednik.sif_poljoprivrednika, poljoprivrednik.ime_gospodarstva, poljoprivrednik.opis_gospodarstva, poljoprivrednik.rok_isporuke_dani FROM korisnik JOIN postanski_ured ON postanski_ured.post_broj = korisnik.pbr_mjesta_stanovanja JOIN zupanija ON zupanija.sif_zupanije = postanski_ured.sif_zupanije JOIN poljoprivrednik ON poljoprivrednik.sif_korisnika = korisnik.sif_korisnika WHERE korisnik.sif_korisnika = $1;",
		[req.params.id],
		(results) => {
			res.send(results[0]);
		}
	);
});

// GET /api/farmer_profile_page/farmer_images/:id
// Dohvati slike poljoprivrednika
router.get("/farmer_images/:id", (req, res) => {
	database.query(
		"SELECT sif_slike, url_slike FROM slika_gospodarstva WHERE sif_poljoprivrednika = $1;",
		[req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

// GET /api/farmer_profile_page/products/:id
// Dohvati oglase poljoprivrednika
router.get("/products/:id", (req, res) => {
	database.query(
		"SELECT oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, oglas.datum_kreiranja FROM oglas JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice WHERE oglas.sif_autora = $1;",
		[req.params.id],
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
});

// GET /api/farmer_profile_page/product_images/:id
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

// GET /api/farmer_profile_page/orders/:id
// Dohvati narudžbe poljoprivrednika
router.get("/orders/:id", auth, (req, res) => {
	database.query(
		"SELECT narudzba.sif_narudzbe, narudzba.kolicina, narudzba.dostavljena, narudzba.datum_dostave, oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, oglas.datum_kreiranja, korisnik.ime, korisnik.prezime, korisnik.pbr_mjesta_stanovanja, korisnik.adresa_stanovanja, postanski_ured.naziv_post_ureda, zupanija.naziv_zupanije, korisnik.broj_telefona, korisnik.email, narudzba.datum_narudzbe FROM narudzba JOIN oglas ON narudzba.sif_oglasa = oglas.sif_oglasa JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN korisnik ON narudzba.sif_kupca = korisnik.sif_korisnika JOIN postanski_ured ON korisnik.pbr_mjesta_stanovanja = postanski_ured.post_broj JOIN zupanija ON postanski_ured.sif_zupanije = zupanija.sif_zupanije WHERE oglas.sif_autora = $1;",
		[req.params.id],
		(results) => {
			results.forEach((item) => {
				item.datum_kreiranja = new Date(
					item.datum_kreiranja
				).toLocaleDateString("hr-HR");

				item.datum_narudzbe = new Date(
					item.datum_narudzbe
				).toLocaleDateString("hr-HR");

				item.datum_dostave = new Date(
					item.datum_dostave
				).toLocaleDateString("hr-HR");
			});

			results["slike"] = [];

			res.send(results);
		}
	);
});

// GET /api/farmer_profile_page/ratings/:id
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

// GET /api/farmer_profile_page/product_delete_check/:id
// Provjeri može li se oglas obrisati
router.get("/product_delete_check/:id", auth, (req, res) => {
	database.query(
		"SELECT sif_narudzbe FROM narudzba WHERE sif_oglasa = $1;",
		[req.params.id],
		(results) => {
			if (results.length !== 0) {
				res.status(400).json({
					message:
						"Oglas se ne može obrisati jer postoje narudžbe koje o njemu ovise",
				});
			} else {
				res.status(200).json({ message: "Oglas se može obrisati" });
			}
		}
	);
});

// POST /api/farmer_profile_page/rating
// Dodaj ocjenu poljoprivrednika
router.post("/rating", auth, (req, res) => {
	const { rating, farmerId, authorId, comment } = req.body;

	database.query(
		"INSERT INTO ocjena_poljoprivrednika(ocjena, sif_poljoprivrednika, sif_autora, komentar, datum_kreiranja) VALUES ($1, $2, $3, $4, current_date);",
		[rating, farmerId, authorId, comment],
		(results) => {
			res.send(results);
		}
	);
});

// POST /api/farmer_profile_page/images/:id
// Dodaj slike gospodarstva
router.post("/images/:id", auth, upload.array("farmer-images"), (req, res) => {
	for (const file of req.files) {
		database.query(
			"SELECT url_slike FROM slika_gospodarstva WHERE sif_poljoprivrednika = $1;",
			[req.params.id],
			(results) => {
				if (
					!results
						.map((item) => item.url_slike)
						.includes(
							`https://e-trznica.s3.eu-central-1.amazonaws.com/farmer-profiles-images/${req.params.id}/${file.originalname}`
						)
				) {
					database.query(
						"INSERT INTO slika_gospodarstva(url_slike, sif_poljoprivrednika) VALUES ($1, $2);",
						[
							`https://e-trznica.s3.eu-central-1.amazonaws.com/farmer-profiles-images/${req.params.id}/${file.originalname}`,
							req.params.id,
						],
						(results) => {}
					);
				}
			}
		);
	}

	res.json({ message: "Uspješan upload slika" });
});

// PUT /api/farmer_profile_page/farmer_info/
// Promijeni podatke o korisniku/poljoprivredniku
router.put("/farmer_info", auth, (req, res) => {
	const {
		userId,
		firstName,
		lastName,
		address,
		postalCode,
		phoneNumber,
		oldEmail,
		email,
		farmerId,
		farmerName,
		farmDesc,
		deliveryDays,
	} = req.body;

	// Dohvati sve korisnike (emailove korisnika) i provjeri postoji li već email koji se želi dodati
	database.query(
		"SELECT email FROM korisnik WHERE email != $1;",
		[oldEmail],
		(results) => {
			if (results.map((item) => item.email).includes(email)) {
				res.status(400).json({
					message:
						"Greška! Korisnik s unesenom e-mail adresom već postoji",
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
			[
				firstName,
				postalCode,
				address,
				phoneNumber,
				email,
				lastName,
				userId,
			],
			(results) => {
				editFarmer();
			}
		);
	};

	// Promijeni podatke o poljoprivredniku
	const editFarmer = () => {
		database.query(
			"UPDATE poljoprivrednik SET opis_gospodarstva = $1, rok_isporuke_dani = $2, ime_gospodarstva = $3 WHERE sif_poljoprivrednika = $4;",
			[farmDesc, deliveryDays, farmerName, farmerId],
			(results) => {
				res.send(results);
			}
		);
	};
});

// PUT /api/farmer_profile_page/order/:id
// Promijeni stanje narudžbe (je li dostavljena)
router.put("/order/:id", auth, (req, res) => {
	const { isDelivered } = req.body;

	database.query(
		"UPDATE narudzba SET dostavljena = $1, datum_dostave = current_date WHERE sif_narudzbe = $2;",
		[isDelivered, req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

// DELETE /api/farmer_profile_page/image
// Obriši sliku gospodarstva
router.delete("/image", auth, (req, res) => {
	const { imageId, imageUrl } = req.body;

	const imageUrlSplit = imageUrl.split("/");

	const farmerId = imageUrlSplit[imageUrlSplit.length - 2];
	const fileName = imageUrlSplit[imageUrlSplit.length - 1];

	s3.deleteObject(
		{
			Bucket: "e-trznica",
			Key: `farmer-profiles-images/${farmerId}/${fileName}`,
		},
		(err, data) => {
			if (err) {
				return res.status(500).json({
					message:
						"Greška pri brisanju datoteke sa Amazon S3 bucket-a",
				});
			} else {
				database.query(
					"DELETE FROM slika_gospodarstva WHERE sif_slike = $1;",
					[imageId],
					(results) => {
						res.send(results);
					}
				);
			}
		}
	);
});

// DELETE /api/farmer_profile_page/product/:id
// Obriši oglas
router.delete("/product/:id", auth, (req, res) => {
	database.query(
		"DELETE FROM ocjena_oglasa WHERE sif_oglasa = $1;",
		[req.params.id],
		(results) => {
			database.query(
				"DELETE FROM oglas WHERE sif_oglasa = $1;",
				[req.params.id],
				(results) => {
					res.send(results);
				}
			);
		}
	);
});

// DELETE /api/farmer_profile_page/rating/:id
// Obriši ocjenu poljoprivrednika
router.delete("/rating/:id", auth, (req, res) => {
	database.query(
		"DELETE FROM ocjena_poljoprivrednika WHERE sif_ocjene = $1;",
		[req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

module.exports = router;
