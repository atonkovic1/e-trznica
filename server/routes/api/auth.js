const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const database = require("../../database");
const auth = require("../../middleware/auth");

// POST /api/auth/register
// Registracija novog korisnika
router.post("/register", (req, res) => {
	const {
		userType,
		firstName,
		lastName,
		postalCode,
		address,
		phoneNumber,
		email,
		farmerName,
		farmDesc,
		deliveryDays,
	} = req.body;
	let { password } = req.body;

	// Dohvati sve korisnike (emailove korisnika) i provjeri postoji li već ovaj koji se želi dodati
	database.query("SELECT email FROM korisnik;", [], (results) => {
		if (results.map((item) => item.email).includes(email)) {
			res
				.status(400)
				.json({ message: "Korisnik s unesenom e-mail adresom već postoji" });
		} else {
			hashPassword();
		}
	});

	// Hashiraj lozinku
	const hashPassword = () => {
		bcrypt.genSalt(10, (error, salt) => {
			bcrypt.hash(password, salt, (error, hash) => {
				if (error) {
					throw error;
				}

				password = hash;
				addNewUser(password);
			});
		});
	};

	// Dodaj novog korisnika
	const addNewUser = (password) => {
		database.query(
			"INSERT INTO korisnik(ime, pbr_mjesta_stanovanja, adresa_stanovanja, broj_telefona, email, lozinka, sif_vrste_korisnika, prezime) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);",
			[
				firstName,
				postalCode,
				address,
				phoneNumber,
				email,
				password,
				userType,
				lastName,
			],
			(results) => {
				getUserId();
			}
		);
	};

	// Dohvati sif_korisnika novog korisnika
	const getUserId = () => {
		database.query(
			"SELECT sif_korisnika FROM korisnik WHERE email = $1;",
			[email],
			(results) => {
				const userId = results[0].sif_korisnika;

				if (userType === 3) {
					addNewFarmer(userId);
					createUserToken(userId, userType, farmerName);
				} else {
					createUserToken(userId, userType, firstName + " " + lastName);
				}
			}
		);
	};

	// Ako je userType === 3 - Dodaj novog poljoprivrednika
	const addNewFarmer = (userId) => {
		database.query(
			"INSERT INTO poljoprivrednik(sif_korisnika, opis_gospodarstva, rok_isporuke_dani, ime_gospodarstva) VALUES ($1, $2, $3, $4);",
			[userId, farmDesc, deliveryDays, farmerName],
			(results) => {}
		);
	};

	// Stvori token za korisnika
	const createUserToken = (userId, userType, name) => {
		// Token vrijedi 1 sat
		jwt.sign(
			{
				user: {
					userId,
					userType,
					name,
				},
			},
			process.env.JWT_SECRET,
			{ expiresIn: 18000 },
			(error, token) => {
				if (error) {
					throw error;
				}

				res.send({
					token,
					user: {
						userId,
						userType,
						name,
					},
				});
			}
		);
	};
});

// POST /api/auth/login
// Prijava korisnika
router.post("/login", (req, res) => {
	const { email, password } = req.body;

	// Dohvati sve korisnike i provjeri je li ovaj korisnik registriran
	database.query(
		"SELECT sif_korisnika, ime, prezime, email, lozinka, sif_vrste_korisnika FROM korisnik WHERE email = $1;",
		[email],
		(results) => {
			if (results.length === 0) {
				res.status(400).json({ message: "Neispravna e-mail adresa" });
			} else {
				if (results[0].sif_vrste_korisnika === 3) {
					database.query(
						"SELECT korisnik.sif_korisnika, korisnik.ime, korisnik.prezime, korisnik.email, korisnik.lozinka, korisnik.sif_vrste_korisnika, poljoprivrednik.ime_gospodarstva FROM korisnik JOIN poljoprivrednik ON poljoprivrednik.sif_korisnika = korisnik.sif_korisnika WHERE korisnik.sif_korisnika = $1;",
						[results[0].sif_korisnika],
						(results) => {
							validatePassword(results[0]);
						}
					);
				} else {
					validatePassword(results[0]);
				}
			}
		}
	);

	// Provjera ispravnosti lozinke
	const validatePassword = (userData) => {
		bcrypt.compare(password, userData.lozinka).then((isEqual) => {
			if (!isEqual) {
				res.status(400).json({ message: "Neispravna lozinka" });
			} else {
				if (userData.sif_vrste_korisnika === 3) {
					createUserToken(
						userData.sif_korisnika,
						userData.sif_vrste_korisnika,
						userData.ime_gospodarstva
					);
				} else if (userData.sif_vrste_korisnika === 2) {
					createUserToken(
						userData.sif_korisnika,
						userData.sif_vrste_korisnika,
						userData.ime + " " + userData.prezime
					);
				} else {
					createUserToken(
						userData.sif_korisnika,
						userData.sif_vrste_korisnika,
						userData.ime
					);
				}
			}
		});
	};

	// Stvori token za korisnika
	const createUserToken = (userId, userType, name) => {
		// Token vrijedi 1 sat
		jwt.sign(
			{
				user: {
					userId,
					userType,
					name,
				},
			},
			process.env.JWT_SECRET,
			{ expiresIn: 18000 },
			(error, token) => {
				if (error) {
					throw error;
				}

				res.send({
					token,
					user: {
						userId,
						userType,
						name,
					},
				});
			}
		);
	};
});

// GET /api/auth/user
// Dohvaćanje podataka o prijavljenom korisniku
router.get("/user", auth, (req, res) => {
	res.send({
		userId: req.user.userId,
		userType: req.user.userType,
		name: req.user.name,
	});
});

module.exports = router;
