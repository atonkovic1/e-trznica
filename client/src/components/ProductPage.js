import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import store from "../store";
import { connect } from "react-redux";
import { tokenConfig } from "../actions/authActions";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
	Toolbar,
	Backdrop,
	CircularProgress,
	Container,
	Box,
	Paper,
	Typography,
	Button,
	Divider,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Hidden,
	IconButton,
	Tooltip,
	Snackbar,
} from "@material-ui/core";
import { Rating, Autocomplete, Alert, Pagination } from "@material-ui/lab";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import NavBar from "./shared/NavBar";
import Footer from "./shared/Footer";

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: "none",
		color: theme.palette.text.primary,
	},

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},

	button: {
		color: theme.palette.background.paper,
	},

	horizontalScroll: {
		display: "flex",
		overflowX: "auto",
		maxHeight: "50vh",
		maxWidth: "100%",
		justifyItems: "space-around",
	},

	pageWrapper: {
		minHeight: "89.25vh",
		height: "auto",
		display: "flex",
		flexDirection: "column",
	},

	pageWrapperNewProduct: {
		backgroundColor: theme.palette.background.paper,
		minHeight: "89.25vh",
		height: "auto",
		display: "flex",
		flexDirection: "column",
	},

	sectionPaper: {
		padding: theme.spacing(2),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(5),
		backgroundColor: theme.palette.background.paper,
	},

	section: {
		padding: theme.spacing(2),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(5),
	},

	sectionTitle: {
		marginBottom: theme.spacing(3),
	},

	titleInfo: {
		width: "40vw",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "start",
	},

	titleInfoSm: {
		width: "60vw",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "start",
	},

	sectionTitleFlex: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: theme.spacing(3),
	},

	subSection: {
		marginBottom: theme.spacing(3),
	},

	subSectionTitle: {
		marginBottom: theme.spacing(1),
	},

	editButtons: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},

	icon: {
		color: theme.palette.primary.main,
	},

	imagePaper: {
		marginRight: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
	},

	image: {
		maxHeight: "35vh",
		width: "auto",
	},

	hiddenInput: {
		display: "none",
	},

	productInfo: {
		width: "20%",
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	productInfoSm: {
		width: "50%",
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	productInfoRow: {
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "start",
	},

	farmerInfo: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "start",
		justifyContent: "start",
	},

	orderBox: {
		width: "40%",
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	orderBoxSm: {
		width: "80%",
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	orderInfoRow: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "start",
	},

	addImagesBox: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "start",
	},

	ratingNameBtnBox: {
		marginTop: theme.spacing(2),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	rating: {
		marginBottom: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "center",
	},

	addRating: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "center",
	},

	columnItem: {
		marginRight: theme.spacing(1),
	},

	rowItem: {
		marginBottom: theme.spacing(1),
	},

	formColumn: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-around",
	},

	buttonMarginTop: {
		marginTop: theme.spacing(2),
	},

	loadingOverlay: {
		filter: "brightness(50%)",
	},

	addToCartButtonBox: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},

	cartIcon: {
		marginRight: theme.spacing(1),
		color: theme.palette.background.paper,
	},

	pagination: {
		marginTop: theme.spacing(5),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
}));

function ProductPage(props) {
	const classes = useStyles();

	const [selectData, setSelectData] = useState(null);

	const [product, setProduct] = useState(null);

	const [newProductInfo, setNewProductInfo] = useState(null);
	const [imageInputData, setImageInputData] = useState(null);
	const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);

	const [imagesLoading, setImagesLoading] = useState(false);
	const [newProductLoading, setNewProductLoading] = useState(false);

	const [newRating, setNewRating] = useState(null);
	const [addRatingMenuIsOpen, setAddRatingMenuIsOpen] = useState(false);

	const [order, setOrder] = useState({
		quantity: "",
	});

	const [pageNumRatings, setPageNumRatings] = useState(1);

	const [alert, setAlert] = useState({
		message: "",
		isOpen: false,
		severity: "error",
	});

	useEffect(() => {
		getSelectData();

		if (
			props.match.params.id !== null &&
			props.match.params.id !== "novi_oglas"
		) {
			setEditMenuIsOpen(false);

			getProductData();
		} else {
			setEditMenuIsOpen(true);

			setProduct(null);
			setNewProductInfo({
				productId: null,
				category: "",
				unit: 1,
				price: "",
				productDesc: "",
			});

			setImagesLoading(false);
		}
	}, [props.match.params.id]);

	useEffect(() => {
		if (product !== undefined && product !== null) {
			if (pageNumRatings > Math.ceil(product.ratings.length / 3)) {
				const newPageNumRatings = Math.ceil(product.ratings.length / 3);
				setPageNumRatings(newPageNumRatings);
			}
		}
	}, [product]);

	useEffect(() => {
		document.querySelectorAll(".horizontalScroll").forEach((element) => {
			element.addEventListener(
				"mousewheel",
				function (e) {
					this.scrollLeft -= e.wheelDelta;
					e.preventDefault();
				},
				false
			);
		});
	}, [product]);

	useEffect(() => {
		if (
			props.match.params.id !== "novi_oglas" &&
			imageInputData !== null &&
			imageInputData.length !== 0
		) {
			document.querySelector("#productImagesFormSubmitBtn").click();
		}
	}, [imageInputData]);

	const getProductImages = async (productId) => {
		return axios
			.get(`/api/product_page/product_images/${productId}`)
			.then((res) => {
				return res.data;
			});
	};

	const getProductRatings = async (productId) => {
		return axios
			.get(`/api/product_page/product_ratings/${productId}`)
			.then((res) => {
				let totalRating = 0;
				res.data.forEach((rating) => {
					let date = new Date(rating.datum_kreiranja);
					date.setDate(date.getDate());
					rating.datum_kreiranja = date.toLocaleDateString("hr-HR");

					totalRating += rating.ocjena;
				});
				totalRating = totalRating / res.data.length;
				totalRating = isNaN(totalRating) ? 0 : totalRating;

				return {
					ratings: res.data,
					totalRating: totalRating,
				};

				return res.data;
			});
	};

	const getProductInfo = async (productId) => {
		return axios.get(`/api/product_page/product/${productId}`).then((res) => {
			let date = new Date(res.data.datum_kreiranja);
			date.setDate(date.getDate());

			res.data.datum_kreiranja = date.toLocaleDateString("hr-HR");

			return res.data;
		});
	};

	// Dohvaćanje podataka o oglasu
	const getProductData = async () => {
		Promise.all([
			getProductInfo(parseInt(props.match.params.id)),
			getProductImages(parseInt(props.match.params.id)),
			getProductRatings(parseInt(props.match.params.id)),
		]).then((results) => {
			setProduct({
				productId: parseInt(props.match.params.id),
				category: results[0].naziv_vrste_proizvoda,
				unit: results[0].sif_mjerne_jedinice,
				price: results[0].cijena,
				productDesc: results[0].opis_oglasa,
				authorId: results[0].sif_korisnika,
				authorName: results[0].ime_gospodarstva,
				authorPhoneNumber: results[0].broj_telefona,
				authorEmail: results[0].email,
				images: results[1],
				ratings: results[2].ratings,
				totalRating: results[2].totalRating,
			});

			setNewProductInfo({
				productId: parseInt(props.match.params.id),
				category: results[0].naziv_vrste_proizvoda,
				unit: results[0].sif_mjerne_jedinice,
				price: results[0].cijena,
				productDesc: results[0].opis_oglasa,
			});

			setImagesLoading(false);
		});
	};

	// Dohvaćanje svih vrsta proizvoda
	const getCategories = async () => {
		return axios.get("/api/product_page/categories").then((res) => {
			return res.data;
		});
	};

	// Dohvaćanje svih mjernih jedinica
	const getUnits = async () => {
		return axios.get("/api/product_page/units").then((res) => {
			return res.data;
		});
	};

	const getFarmers = async () => {
		return axios.get("/api/products_page/farmers").then((res) => {
			return res.data;
		});
	};

	// Dohvaćanje svih vrsta proizvoda i mjernih jedinica
	const getSelectData = async () => {
		Promise.all([getCategories(), getUnits(), getFarmers()]).then((results) => {
			setSelectData({
				categories: results[0],
				units: results[1],
				farmers: results[2],
			});
		});
	};

	const editProductInfo = async (event) => {
		event.preventDefault();

		await axios.put(
			"/api/product_page/product_info",
			{
				productId: parseInt(newProductInfo.productId),
				categoryId: parseInt(
					selectData.categories.find(
						(item) => item.naziv_vrste_proizvoda === newProductInfo.category
					).sif_vrste_proizvoda
				),
				unitId: parseInt(newProductInfo.unit),
				price: parseFloat(newProductInfo.price),
				productDesc: newProductInfo.productDesc,
			},
			tokenConfig(store.getState)
		);

		setEditMenuIsOpen(false);

		getProductData();
	};

	const addImages = async (event, productId) => {
		if (event !== null) {
			event.preventDefault();
		}

		if (props.match.params.id !== "novi_oglas") {
			setImagesLoading(true);
		}

		const setConfig = async () => {
			let formData = new FormData();
			for (let i = 0; i < imageInputData.length; i++) {
				formData.append("product-images", imageInputData[i]);
			}

			let config = tokenConfig(store.getState);
			config.headers["Content-type"] = "multipart/form-data";

			return [formData, config];
		};

		const [formData, config] = await setConfig();

		await axios.post(`/api/product_page/images/${productId}`, formData, config);

		if (props.match.params.id !== "novi_oglas") {
			getProductData();

			document.querySelector("#productImagesForm").reset();
		}

		setImageInputData(null);
	};

	const deleteImage = (imageId, imageUrl) => {
		setImagesLoading(true);

		let config = tokenConfig(store.getState);
		config.data = {
			imageId: imageId,
			imageUrl: imageUrl,
		};

		return axios.delete("/api/product_page/image", config);
	};

	const addNewProduct = async (event) => {
		event.preventDefault();

		setNewProductLoading(true);

		const newProductId = await axios
			.post(
				"/api/product_page/product",
				{
					categoryId: parseInt(
						selectData.categories.find(
							(item) => item.naziv_vrste_proizvoda === newProductInfo.category
						).sif_vrste_proizvoda
					),
					unitId: parseInt(newProductInfo.unit),
					price: parseFloat(newProductInfo.price),
					productDesc: newProductInfo.productDesc,
					authorId: parseInt(
						selectData.farmers.find(
							(item) => item.sif_korisnika === parseInt(props.auth.user.userId)
						).sif_poljoprivrednika
					),
				},
				tokenConfig(store.getState)
			)
			.then((res) => {
				return res.data.sif_oglasa;
			});

		if (imageInputData !== null && imageInputData.length !== 0) {
			await addImages(null, parseInt(newProductId));
		}

		props.history.push(`/oglas/${parseInt(newProductId)}`);

		setEditMenuIsOpen(false);

		setNewProductLoading(false);
	};

	const deleteProduct = async (productData = product) => {
		const canDelete = await axios
			.get(
				`/api/farmer_profile_page/product_delete_check/${parseInt(
					props.match.params.id
				)}`,
				tokenConfig(store.getState)
			)
			.catch((err) => {
				setAlert({
					message: err.response.data.message,
					isOpen: true,
					severity: "error",
				});
				return { data: { message: err.response.data.message } };
			})
			.then((res) => {
				return res.data.message;
			});

		if (canDelete === "Oglas se može obrisati") {
			let promises = [];
			for (const image of productData.images) {
				promises.push(deleteImage(image.sif_slike, image.url_slike));
			}

			Promise.all(promises).then(() => {
				axios
					.delete(
						`/api/product_page/product/${parseInt(props.match.params.id)}`,
						tokenConfig(store.getState)
					)
					.then(() => props.history.goBack());
			});
		}
	};

	const addToShoppingCart = async (event) => {
		event.preventDefault();

		let shoppingCartData = JSON.parse(
			localStorage.getItem("shoppingCartData") || "[]"
		);

		const orderData = {
			orderId: Date.now(),
			customerId: parseInt(props.auth.user.userId),
			productId: parseInt(props.match.params.id),
			quantity: parseInt(order.quantity),
		};

		shoppingCartData.push(orderData);

		localStorage.setItem("shoppingCartData", JSON.stringify(shoppingCartData));

		setOrder({
			quantity: "",
		});

		setAlert({
			message: "Proizvod je dodan u košaricu",
			isOpen: true,
			severity: "success",
		});
	};

	const addRating = async (event) => {
		event.preventDefault();

		await axios.post(
			"/api/product_page/rating",
			newRating,
			tokenConfig(store.getState)
		);

		setAddRatingMenuIsOpen(false);
		setNewRating({
			...newRating,
			rating: 5,
			comment: "",
		});

		getProductData();
	};

	const deleteRating = async (ratingId) => {
		await axios.delete(
			`/api/product_page/rating/${ratingId}`,
			tokenConfig(store.getState)
		);

		getProductData();
	};

	if (
		(props.match.params.id !== "novi_oglas" &&
			(product === null || selectData === null)) ||
		(props.match.params.id === "novi_oglas" &&
			(newProductInfo === null || selectData === null)) ||
		(props.match.params.id === "novi_oglas" && newProductLoading)
	) {
		return (
			<div className="ProductPage">
				<NavBar />

				<Toolbar />

				<Box className={classes.pageWrapper} />

				<Footer />

				<Backdrop className={classes.backdrop} open={true}>
					<CircularProgress color="inherit" />
				</Backdrop>
			</div>
		);
	} else {
		return (
			<div className="ProductPage">
				<NavBar storage={localStorage.getItem("shoppingCartData")} />

				<Toolbar />

				<Box
					className={
						props.match.params.id !== "novi_oglas"
							? `${classes.pageWrapper}`
							: `${classes.pageWrapperNewProduct}`
					}
				>
					<form
						id="productInfoForm"
						onSubmit={(event) => {
							if (props.match.params.id !== "novi_oglas") {
								editProductInfo(event);
							} else {
								addNewProduct(event);
							}
						}}
					></form>
					<form
						id="productImagesForm"
						onSubmit={(event) =>
							addImages(event, parseInt(props.match.params.id))
						}
					></form>

					<Box className={classes.sectionPaper}>
						<Container maxWidth="lg">
							{props.match.params.id === "novi_oglas" ? (
								<Typography variant="h3" className={classes.sectionTitle}>
									Novi oglas
								</Typography>
							) : (
								<React.Fragment />
							)}

							<Box
								className={
									!editMenuIsOpen
										? `${classes.sectionTitleFlex}`
										: `${classes.sectionTitleFlex} ${classes.rowItem}`
								}
							>
								{!editMenuIsOpen ? (
									<Typography variant="h3">{product.category}</Typography>
								) : (
									<React.Fragment>
										<Hidden smDown>
											<Box className={classes.titleInfo}>
												<Autocomplete
													id="category"
													fullWidth
													autoSelect
													renderInput={(params) => (
														<TextField
															{...params}
															variant="filled"
															label="Vrsta proizvoda"
															required
															inputProps={{
																...params.inputProps,
																form: "productInfoForm",
															}}
														/>
													)}
													options={selectData.categories
														.map((category) => category.naziv_vrste_proizvoda)
														.sort(new Intl.Collator("hr").compare)}
													getOptionLabel={(option) => option}
													value={newProductInfo.category}
													onChange={(event, value) => {
														setNewProductInfo({
															...newProductInfo,
															category: value,
														});
													}}
												/>
											</Box>
										</Hidden>

										<Hidden mdUp>
											<Box className={classes.titleInfoSm}>
												<Autocomplete
													id="category"
													fullWidth
													autoSelect
													renderInput={(params) => (
														<TextField
															{...params}
															variant="filled"
															label="Vrsta proizvoda"
															required
															inputProps={{
																...params.inputProps,
																form: "productInfoForm",
															}}
														/>
													)}
													options={selectData.categories
														.map((category) => category.naziv_vrste_proizvoda)
														.sort(new Intl.Collator("hr").compare)}
													getOptionLabel={(option) => option}
													value={newProductInfo.category}
													onChange={(event, value) => {
														setNewProductInfo({
															...newProductInfo,
															category: value,
														});
													}}
												/>
											</Box>
										</Hidden>
									</React.Fragment>
								)}

								{props.match.params.id === "novi_oglas" ||
								props.auth.user === null ||
								!(props.auth.user.userId === parseInt(product.authorId)) ? (
									<React.Fragment />
								) : !editMenuIsOpen ? (
									<Box className={classes.editButtons}>
										<Button
											variant="outlined"
											size="medium"
											color="inherit"
											className={classes.columnItem}
											onClick={() => setEditMenuIsOpen(true)}
										>
											Uredi
										</Button>

										<Button
											variant="outlined"
											size="medium"
											color="inherit"
											onClick={() => deleteProduct()}
										>
											Obriši
										</Button>
									</Box>
								) : (
									<Box className={classes.editButtons}>
										<Hidden xsDown>
											<Button
												type="submit"
												form="productInfoForm"
												size="medium"
												color="inherit"
												className={classes.columnItem}
											>
												Spremi
											</Button>

											<Button
												size="medium"
												color="inherit"
												onClick={() => {
													setEditMenuIsOpen(false);

													setNewProductInfo({
														productId: product.productId,
														category: product.category,
														unit: product.unit,
														price: product.price,
														productDesc: product.productDesc,
													});

													setImagesLoading(false);
												}}
											>
												Odustani
											</Button>
										</Hidden>

										<Hidden smUp>
											<Tooltip title="Spremi">
												<IconButton
													type="submit"
													form="productInfoForm"
													size="medium"
													color="inherit"
												>
													<SaveIcon
														fontSize="inherit"
														className={classes.icon}
													/>
												</IconButton>
											</Tooltip>

											<Tooltip title="Odustani">
												<IconButton
													size="medium"
													color="inherit"
													onClick={() => {
														setEditMenuIsOpen(false);

														setNewProductInfo({
															productId: product.productId,
															category: product.category,
															unit: product.unit,
															price: product.price,
															productDesc: product.productDesc,
														});

														setImagesLoading(false);
													}}
												>
													<HighlightOffIcon
														fontSize="inherit"
														color="secondary"
													/>
												</IconButton>
											</Tooltip>
										</Hidden>
									</Box>
								)}
							</Box>

							<Box className={classes.subSection}>
								{!editMenuIsOpen ? (
									<Typography variant="body1">{product.productDesc}</Typography>
								) : (
									<TextField
										variant="filled"
										fullWidth
										multiline
										rows={3}
										id="productDesc"
										label="Opis proizvoda"
										required
										inputProps={{ form: "productInfoForm" }}
										value={newProductInfo.productDesc}
										onChange={(event) => {
											setNewProductInfo({
												...newProductInfo,
												productDesc: event.target.value,
											});
										}}
									/>
								)}
							</Box>

							<Box className={classes.subSection}>
								<Typography variant="h5" className={classes.subSectionTitle}>
									Slike proizvoda
								</Typography>

								{props.match.params.id !== "novi_oglas" &&
								product.images !== null &&
								product.images.length !== 0 ? (
									<Box
										className={`horizontalScroll ${classes.horizontalScroll} ${classes.rowItem}`}
									>
										{product.images.map((image) => (
											<Paper
												key={image.sif_slike}
												variant="outlined"
												className={classes.imagePaper}
											>
												<a
													href={image.url_slike + "?content-disposition=inline"}
													target="_blank"
													rel="noopener noreferrer"
												>
													<img
														src={image.url_slike}
														alt="Slika proizvoda"
														className={
															imagesLoading
																? `${classes.image} ${classes.loadingOverlay}`
																: `${classes.image}`
														}
													/>
												</a>

												{props.auth.user !== null &&
												props.auth.user.userId === parseInt(product.authorId) &&
												image !== undefined &&
												image !== null ? (
													<Button
														size="small"
														color="inherit"
														disabled={imagesLoading}
														onClick={async () => {
															await deleteImage(
																image.sif_slike,
																image.url_slike
															);
															getProductData();
														}}
													>
														Obriši
													</Button>
												) : (
													<React.Fragment />
												)}
											</Paper>
										))}
									</Box>
								) : props.match.params.id === "novi_oglas" &&
								  imageInputData !== null ? (
									Array.from(imageInputData).map((file, index) => (
										<Typography variant="body1" key={index}>
											{file.name}
										</Typography>
									))
								) : (
									<Typography variant="body1">Nema slika</Typography>
								)}

								{props.match.params.id === "novi_oglas" ||
								(props.auth.user !== null &&
									props.auth.user.userId === parseInt(product.authorId)) ? (
									<Box className={classes.subSection}>
										<input
											id="add-files-button"
											name="product-images"
											type="file"
											form="productImagesForm"
											multiple
											accept="image/*"
											onChange={(event) =>
												setImageInputData(event.target.files)
											}
											className={classes.hiddenInput}
										/>
										<label htmlFor="add-files-button">
											<Box className={classes.addImagesBox}>
												<Button
													component="span"
													variant="outlined"
													size="medium"
													color="inherit"
													style={{ marginRight: "16px" }}
													disabled={imagesLoading}
												>
													Dodaj slike
												</Button>

												{imagesLoading ? (
													<CircularProgress color="inherit" size={25} />
												) : (
													<React.Fragment />
												)}
											</Box>
										</label>

										<Button
											id="productImagesFormSubmitBtn"
											type="submit"
											form="productImagesForm"
											size="medium"
											color="inherit"
											className={classes.hiddenInput}
										>
											Spremi
										</Button>
									</Box>
								) : (
									<React.Fragment />
								)}
							</Box>

							<Box className={classes.subSection}>
								<Typography variant="h5" className={classes.subSectionTitle}>
									Cijena
								</Typography>

								{!editMenuIsOpen ? (
									<Box className={classes.productInfoRow}>
										<Typography variant="h5" className={classes.columnItem}>
											{product.price}
										</Typography>

										<Typography variant="body1">
											kn/
											{
												selectData.units.find(
													(item) =>
														item.sif_mjerne_jedinice === parseInt(product.unit)
												).oznaka_mjerne_jedinice
											}
										</Typography>
									</Box>
								) : (
									<React.Fragment>
										<Hidden smDown>
											<Box className={classes.productInfo}>
												<Box className={classes.productInfoRow}>
													<TextField
														type="number"
														fullWidth
														variant="filled"
														id="price"
														label="Cijena"
														required
														inputProps={{ form: "productInfoForm" }}
														value={newProductInfo.price}
														onChange={(event) => {
															setNewProductInfo({
																...newProductInfo,
																price: event.target.value,
															});
														}}
														className={classes.columnItem}
													/>

													<Typography variant="body1">kn</Typography>
												</Box>

												<FormControl variant="filled" fullWidth required>
													<InputLabel id="unit">Mjerna jedinica</InputLabel>
													<Select
														labelId="unit"
														id="unit"
														inputProps={{ form: "productInfoForm" }}
														value={newProductInfo.unit}
														onChange={(event) => {
															setNewProductInfo({
																...newProductInfo,
																unit: event.target.value,
															});
														}}
													>
														{selectData.units.map((unit) => (
															<MenuItem
																value={unit.sif_mjerne_jedinice}
																key={unit.sif_mjerne_jedinice}
															>
																{unit.oznaka_mjerne_jedinice}
															</MenuItem>
														))}
													</Select>
												</FormControl>
											</Box>
										</Hidden>

										<Hidden mdUp>
											<Box className={classes.productInfoSm}>
												<Box className={classes.productInfoRow}>
													<TextField
														type="number"
														fullWidth
														variant="filled"
														id="price"
														label="Cijena"
														required
														inputProps={{ form: "productInfoForm" }}
														value={newProductInfo.price}
														onChange={(event) => {
															setNewProductInfo({
																...newProductInfo,
																price: event.target.value,
															});
														}}
														className={classes.columnItem}
													/>

													<Typography variant="body1">kn</Typography>
												</Box>

												<FormControl variant="filled" fullWidth required>
													<InputLabel id="unit">Mjerna jedinica</InputLabel>
													<Select
														labelId="unit"
														id="unit"
														inputProps={{ form: "productInfoForm" }}
														value={newProductInfo.unit}
														onChange={(event) => {
															setNewProductInfo({
																...newProductInfo,
																unit: event.target.value,
															});
														}}
													>
														{selectData.units.map((unit) => (
															<MenuItem
																value={unit.sif_mjerne_jedinice}
																key={unit.sif_mjerne_jedinice}
															>
																{unit.oznaka_mjerne_jedinice}
															</MenuItem>
														))}
													</Select>
												</FormControl>
											</Box>
										</Hidden>
									</React.Fragment>
								)}
							</Box>

							{props.match.params.id !== "novi_oglas" ? (
								<React.Fragment />
							) : (
								<Button
									type="submit"
									form="productInfoForm"
									size="large"
									variant="contained"
									color="primary"
									className={`${classes.button} ${classes.buttonMarginTop}`}
								>
									Kreiraj oglas
								</Button>
							)}

							{props.auth.user !== null &&
							parseInt(props.auth.user.userType) === 2 ? (
								<Box>
									<Typography variant="h5" className={classes.subSectionTitle}>
										Naruči proizvod
									</Typography>

									<form onSubmit={(event) => addToShoppingCart(event)}>
										<Hidden smDown>
											<Box className={classes.orderBox}>
												<Box className={classes.orderInfoRow}>
													<TextField
														type="number"
														fullWidth
														variant="filled"
														id="quantity"
														label="Količina"
														required
														value={order.quantity}
														onChange={(event) => {
															setOrder({
																quantity: event.target.value,
															});
														}}
														className={classes.columnItem}
													/>

													<Typography variant="body1">
														{
															selectData.units.find(
																(item) =>
																	item.sif_mjerne_jedinice ===
																	parseInt(product.unit)
															).oznaka_mjerne_jedinice
														}
													</Typography>
												</Box>

												<Box className={classes.addToCartButtonBox}>
													<Button
														type="submit"
														variant="contained"
														size="medium"
														color="primary"
														className={`${classes.button} ${classes.buttonMarginTop}`}
													>
														<ShoppingCartIcon
															fontSize="small"
															className={classes.cartIcon}
														/>
														Dodaj u košaricu
													</Button>
												</Box>
											</Box>
										</Hidden>

										<Hidden mdUp>
											<Box className={classes.orderBoxSm}>
												<Box className={classes.orderInfoRow}>
													<TextField
														type="number"
														fullWidth
														variant="filled"
														id="quantity"
														label="Količina"
														required
														value={order.quantity}
														onChange={(event) => {
															setOrder({
																quantity: event.target.value,
															});
														}}
														className={classes.columnItem}
													/>

													<Typography variant="body1">
														{
															selectData.units.find(
																(item) =>
																	item.sif_mjerne_jedinice ===
																	parseInt(product.unit)
															).oznaka_mjerne_jedinice
														}
													</Typography>
												</Box>

												<Box className={classes.addToCartButtonBox}>
													<Button
														type="submit"
														variant="contained"
														size="medium"
														color="primary"
														className={`${classes.button} ${classes.buttonMarginTop}`}
													>
														<ShoppingCartIcon
															fontSize="small"
															className={classes.cartIcon}
														/>
														Dodaj u košaricu
													</Button>
												</Box>
											</Box>
										</Hidden>
									</form>
								</Box>
							) : (
								<React.Fragment />
							)}
						</Container>
					</Box>

					{props.match.params.id !== "novi_oglas" ? (
						<Box className={classes.section}>
							<Container maxWidth="lg">
								<Box className={classes.sectionTitle}>
									<Typography variant="h4">Proizvođač</Typography>
								</Box>

								<Box>
									<Typography variant="h5" className={classes.subSectionTitle}>
										{product.authorName}
									</Typography>

									<Box className={classes.farmerInfo}>
										<Typography
											variant="subtitle2"
											color="textSecondary"
											className={classes.columnItem}
										>
											Broj telefona:
										</Typography>

										<Typography variant="body1">
											{product.authorPhoneNumber}
										</Typography>
									</Box>

									<Box className={classes.farmerInfo}>
										<Typography
											variant="subtitle2"
											color="textSecondary"
											className={classes.columnItem}
										>
											E-mail adresa:
										</Typography>

										<Typography variant="body1">
											{product.authorEmail}
										</Typography>
									</Box>

									<Link
										to={`/profil_poljoprivrednik/${product.authorId}`}
										className={classes.link}
									>
										<Button
											variant="outlined"
											size="medium"
											color="inherit"
											className={classes.buttonMarginTop}
										>
											Više
										</Button>
									</Link>
								</Box>
							</Container>
						</Box>
					) : (
						<React.Fragment />
					)}

					{props.match.params.id !== "novi_oglas" ? (
						<Box className={classes.sectionPaper}>
							<Container maxWidth="lg">
								<Box className={classes.sectionTitleFlex}>
									<Typography variant="h4">Ocjena</Typography>

									<Rating
										value={product.totalRating}
										size="large"
										precision={0.5}
										readOnly
									/>
								</Box>

								{product.ratings !== null && product.ratings.length !== 0 ? (
									<React.Fragment>
										{product.ratings
											.sort((rating1, rating2) => {
												const dateString1 = rating1.datum_kreiranja.split(". ");
												const dateString2 = rating2.datum_kreiranja.split(". ");

												let date1 = new Date(
													dateString1[2],
													dateString1[1] - 1,
													dateString1[0]
												);
												let date2 = new Date(
													dateString2[2],
													dateString2[1] - 1,
													dateString2[0]
												);

												date1.setDate(date1.getDate());
												date2.setDate(date2.getDate());

												if (date1 < date2) {
													return 1;
												} else if (date1 > date2) {
													return -1;
												} else {
													return 0;
												}
											})
											.slice(
												(pageNumRatings - 1) * 3,
												(pageNumRatings - 1) * 3 + 3
											)
											.map((rating, index) => (
												<Box key={rating.sif_ocjene}>
													<Box className={classes.ratingNameBtnBox}>
														<Rating
															value={rating.ocjena}
															precision={0.5}
															readOnly
															className={classes.rowItem}
														/>

														{props.auth.user === null ||
														!(props.auth.user.userId === rating.sif_autora) ? (
															<React.Fragment />
														) : (
															<Button
																size="medium"
																color="inherit"
																onClick={() => deleteRating(rating.sif_ocjene)}
															>
																Obriši
															</Button>
														)}
													</Box>

													<Box className={classes.rating}>
														<Typography
															variant="body1"
															className={classes.rowItem}
														>
															{rating.komentar}
														</Typography>

														<Typography
															variant="subtitle2"
															color="textSecondary"
															className={classes.rowItem}
														>
															{rating.ime} {rating.prezime}
														</Typography>

														<Typography variant="caption" color="textSecondary">
															{rating.datum_kreiranja}
														</Typography>
													</Box>

													{rating.sif_ocjene !==
														product.ratings[product.ratings.length - 1]
															.sif_ocjene &&
													index !== pageNumRatings * 3 - 1 ? (
														<Divider />
													) : (
														<React.Fragment />
													)}
												</Box>
											))}

										{product.ratings.length <= 3 ? (
											<React.Fragment />
										) : (
											<Box className={classes.pagination}>
												<Pagination
													count={Math.ceil(product.ratings.length / 3)}
													defaultPage={1}
													page={pageNumRatings}
													onChange={(event, page) => setPageNumRatings(page)}
												/>
											</Box>
										)}
									</React.Fragment>
								) : !addRatingMenuIsOpen ? (
									<Typography variant="body1">Nema ocjena</Typography>
								) : (
									<React.Fragment />
								)}

								{addRatingMenuIsOpen ? (
									<Box className={classes.rowItem}>
										<form onSubmit={(event) => addRating(event)}>
											{product.ratings !== null &&
											product.ratings.length !== 0 ? (
												<Divider />
											) : (
												<React.Fragment />
											)}

											<Box className={classes.addRating}>
												<Rating
													size="large"
													name="rating"
													value={newRating.rating}
													onChange={(event, newValue) => {
														setNewRating({
															...newRating,
															rating: newValue,
														});
													}}
													required
													className={classes.rowItem}
												/>

												<TextField
													variant="filled"
													fullWidth
													multiline
													rows={3}
													id="comment"
													label="Komentar"
													value={newRating.comment}
													onChange={(event) => {
														setNewRating({
															...newRating,
															comment: event.target.value,
														});
													}}
													required
												/>
											</Box>

											<Box
												className={`${classes.editButtons} ${classes.rowItem}`}
											>
												<Button
													type="submit"
													size="medium"
													color="inherit"
													className={classes.columnItem}
												>
													Spremi
												</Button>

												<Button
													size="medium"
													color="inherit"
													onClick={() => {
														setNewRating({
															...newRating,
															rating: 5,
															comment: "",
														});
														setAddRatingMenuIsOpen(false);
													}}
												>
													Odustani
												</Button>
											</Box>
										</form>
									</Box>
								) : (
									<React.Fragment />
								)}

								{props.auth.user !== null &&
								props.auth.user.userType === 2 &&
								!addRatingMenuIsOpen ? (
									<Button
										variant="contained"
										size="medium"
										color="primary"
										onClick={() => {
											if (newRating === null) {
												setNewRating({
													rating: 5,
													productId: props.match.params.id,
													authorId: props.auth.user.userId,
													comment: "",
												});
											}

											setAddRatingMenuIsOpen(true);
										}}
										className={`${classes.button} ${classes.buttonMarginTop} ${classes.rowItem}`}
									>
										Dodaj ocjenu
									</Button>
								) : (
									<React.Fragment />
								)}
							</Container>
						</Box>
					) : (
						<React.Fragment />
					)}
				</Box>

				<Snackbar
					open={alert.isOpen}
					autoHideDuration={4000}
					onClose={(event, reason) => {
						if (reason === "clickaway") {
							return;
						}

						setAlert({
							message: "",
							isOpen: false,
							severity: "error",
						});
					}}
				>
					<Alert severity={alert.severity}>{alert.message}</Alert>
				</Snackbar>

				<Footer />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { tokenConfig })(ProductPage);
