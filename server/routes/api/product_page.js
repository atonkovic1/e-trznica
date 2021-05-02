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
			callback(null, `products-images/${req.params.id}/${file.originalname}`);
		},
	}),
});

// GET /api/product_page/product/:id
// Dohvati oglas
router.get("/product/:id", (req, res) => {
	database.query(
		"SELECT oglas.sif_oglasa, vrsta_proizvoda.naziv_vrste_proizvoda, mjerna_jedinica.sif_mjerne_jedinice, mjerna_jedinica.oznaka_mjerne_jedinice, oglas.cijena, oglas.opis_oglasa, korisnik.sif_korisnika, korisnik.ime, korisnik.prezime, poljoprivrednik.ime_gospodarstva, korisnik.broj_telefona, korisnik.email, oglas.datum_kreiranja FROM oglas JOIN vrsta_proizvoda ON vrsta_proizvoda.sif_vrste_proizvoda = oglas.sif_proizvoda JOIN mjerna_jedinica ON mjerna_jedinica.sif_mjerne_jedinice = oglas.sif_mjerne_jedinice JOIN poljoprivrednik ON poljoprivrednik.sif_poljoprivrednika = oglas.sif_autora JOIN korisnik ON korisnik.sif_korisnika = poljoprivrednik.sif_korisnika WHERE oglas.sif_oglasa = $1;",
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

// GET /api/product_page/product_images/:id
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

// GET /api/product_page/product_ratings/:id
// Dohvati ocjene poljoprivrednika
router.get("/product_ratings/:id", (req, res) => {
	database.query(
		"SELECT ocjena_oglasa.sif_ocjene, ocjena_oglasa.ocjena, ocjena_oglasa.sif_autora, korisnik.ime, korisnik.prezime, ocjena_oglasa.komentar, ocjena_oglasa.datum_kreiranja FROM ocjena_oglasa JOIN korisnik ON ocjena_oglasa.sif_autora = korisnik.sif_korisnika WHERE ocjena_oglasa.sif_oglasa = $1;",
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

// GET /api/product_page/categories
// Dohvati sve vrste proizvoda
router.get("/categories", (req, res) => {
	database.query(
		"SELECT sif_vrste_proizvoda, naziv_vrste_proizvoda FROM vrsta_proizvoda WHERE sif_nadvrste_proizvoda IS NOT NULL;",
		[],
		(results) => {
			res.send(results);
		}
	);
});

// GET /api/product_page/units
// Dohvati sve mjerne jedinice
router.get("/units", (req, res) => {
	database.query(
		"SELECT sif_mjerne_jedinice, oznaka_mjerne_jedinice FROM mjerna_jedinica;",
		[],
		(results) => {
			res.send(results);
		}
	);
});

// POST /api/product_page/product
// Dodaj novi oglas
router.post("/product", auth, (req, res) => {
	const { categoryId, unitId, price, productDesc, authorId } = req.body;

	database.query(
		"INSERT INTO oglas(sif_proizvoda, sif_mjerne_jedinice, cijena, opis_oglasa, sif_autora, datum_kreiranja) VALUES ($1, $2, $3, $4, $5, current_date);",
		[categoryId, unitId, price, productDesc, authorId],
		(results) => {
			database.query(
				"SELECT sif_oglasa FROM oglas WHERE sif_proizvoda = $1 AND sif_mjerne_jedinice = $2 AND cijena = $3 AND opis_oglasa = $4 AND sif_autora = $5 ORDER BY datum_kreiranja DESC;",
				[categoryId, unitId, price, productDesc, authorId],
				(results) => {
					res.send(results[0]);
				}
			);
		}
	);
});

// POST /api/product_page/rating
// Dodaj ocjenu oglasa
router.post("/rating", auth, (req, res) => {
	const { rating, productId, authorId, comment } = req.body;

	database.query(
		"INSERT INTO ocjena_oglasa(ocjena, sif_oglasa, sif_autora, komentar, datum_kreiranja) VALUES ($1, $2, $3, $4, current_date);",
		[rating, productId, authorId, comment],
		(results) => {
			res.send(results);
		}
	);
});

// POST /api/product_page/images/:id
// Dodaj slike oglasa
router.post("/images/:id", auth, upload.array("product-images"), (req, res) => {
	for (const file of req.files) {
		database.query(
			"SELECT url_slike FROM slika_oglasa WHERE sif_oglasa = $1;",
			[req.params.id],
			(results) => {
				if (
					!results
						.map((item) => item.url_slike)
						.includes(
							`https://e-trznica.s3.eu-central-1.amazonaws.com/products-images/${req.params.id}/${file.originalname}`
						)
				) {
					database.query(
						"INSERT INTO slika_oglasa(url_slike, sif_oglasa) VALUES ($1, $2);",
						[
							`https://e-trznica.s3.eu-central-1.amazonaws.com/products-images/${req.params.id}/${file.originalname}`,
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

// PUT /api/product_page/product_info
// Promijeni podatke o oglasu
router.put("/product_info", auth, (req, res) => {
	const { productId, categoryId, unitId, price, productDesc } = req.body;

	database.query(
		"UPDATE oglas SET sif_proizvoda = $1, sif_mjerne_jedinice = $2, cijena = $3, opis_oglasa = $4, datum_kreiranja = current_date WHERE sif_oglasa = $5;",
		[categoryId, unitId, price, productDesc, productId],
		(results) => {
			res.send(results);
		}
	);
});

// DELETE /api/product_page/product/:id
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

// DELETE /api/product_page/image
// Obriši sliku oglasa
router.delete("/image", auth, (req, res) => {
	const { imageId, imageUrl } = req.body;

	const imageUrlSplit = imageUrl.split("/");

	const productId = imageUrlSplit[imageUrlSplit.length - 2];
	const fileName = imageUrlSplit[imageUrlSplit.length - 1];

	s3.deleteObject(
		{
			Bucket: "e-trznica",
			Key: `products-images/${productId}/${fileName}`,
		},
		(err, data) => {
			if (err) {
				return res.status(500).json({
					message: "Greška pri brisanju datoteke sa Amazon S3 bucket-a",
				});
			} else {
				database.query(
					"DELETE FROM slika_oglasa WHERE sif_slike = $1;",
					[parseInt(imageId)],
					(results) => {
						res.send(results);
					}
				);
			}
		}
	);
});

// DELETE /api/product_page/rating/:id
// Obriši ocjenu oglasa
router.delete("/rating/:id", auth, (req, res) => {
	database.query(
		"DELETE FROM ocjena_oglasa WHERE sif_ocjene = $1;",
		[req.params.id],
		(results) => {
			res.send(results);
		}
	);
});

module.exports = router;
