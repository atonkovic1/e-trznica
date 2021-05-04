import React, { useState, useEffect } from "react";
import store from "../../../store";
import { connect } from "react-redux";
import { tokenConfig } from "../../../actions/authActions";
import { Link } from "react-router-dom";
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
	Grid,
	Button,
	Divider,
	TextField,
	Hidden,
	IconButton,
	Tooltip,
	Snackbar,
} from "@material-ui/core";
import { Rating, Autocomplete, Alert, Pagination } from "@material-ui/lab";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import NavBar from "../../shared/NavBar";
import Footer from "../../shared/Footer";
import ProductCardFarmer from "./ProductCardFarmer";
import OrderCardFarmer from "./OrderCardFarmer";

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: "none",
		color: theme.palette.background.paper,
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

	sectionTitleFlex: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: theme.spacing(3),
	},

	sectionTitleFlexStart: {
		display: "flex",
		flexDirection: "row",
		alignItems: "start",
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

	farmerInfo: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "start",
		justifyContent: "start",
	},

	farmerInfoSm: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	farmerAddress: {
		display: "flex",
		flexDirection: "column",
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

	addRatingButton: {
		marginTop: theme.spacing(2),
	},

	loadingOverlay: {
		filter: "brightness(50%)",
	},

	nameEditBox: {
		width: "49.40%",
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	nameEditBoxSm: {
		width: "70%",
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	addressEditBox: {
		width: "100%",
		display: "flex",
		flexDirection: "row",
		alignItems: "start",
		justifyContent: "space-between",
	},

	addressEditBoxSm: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	contactsEditBox: {
		width: "49.40%",
	},

	contactsEditBoxSm: {
		width: "100%",
	},

	pagination: {
		marginTop: theme.spacing(5),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
}));

function FarmerProfilePage(props) {
	const classes = useStyles();

	const [postOffices, setPostOffices] = useState([]);

	const [farmerData, setFarmerData] = useState(null);

	const [newFarmerInfo, setNewFarmerInfo] = useState(null);
	const [imageInputData, setImageInputData] = useState(null);
	const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);

	const [imagesLoading, setImagesLoading] = useState(false);

	const [categories, setCategories] = useState(null);
	const [units, setUnits] = useState(null);

	const [orderHistoryIsOpen, setOrderHistoryIsOpen] = useState(false);

	const [newRating, setNewRating] = useState(null);
	const [addRatingMenuIsOpen, setAddRatingMenuIsOpen] = useState(false);

	const [pageNumOrders, setPageNumOrders] = useState(1);
	const [pageNumProducts, setPageNumProducts] = useState(1);
	const [pageNumRatings, setPageNumRatings] = useState(1);

	const [error, setError] = useState({
		message: "",
		isOpen: false,
	});

	useEffect(() => {
		getFarmerData();

		getFormData();
	}, [props.match.params.id]);

	useEffect(() => {
		if (farmerData !== undefined && farmerData !== null) {
			if (
				pageNumOrders >
				Math.ceil(
					farmerData.orders.filter(
						(order) => order.dostavljena === orderHistoryIsOpen
					).length / 4
				)
			) {
				const newPageNumOrders = Math.ceil(
					farmerData.orders.filter(
						(order) => order.dostavljena === orderHistoryIsOpen
					).length / 4
				);
				setPageNumOrders(newPageNumOrders);
			}

			if (pageNumProducts > Math.ceil(farmerData.products.length / 4)) {
				const newPageNumProducts = Math.ceil(
					farmerData.products.length / 4
				);
				setPageNumProducts(newPageNumProducts);
			}
		}
	}, [farmerData]);

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
	}, [farmerData]);

	useEffect(() => {
		if (imageInputData !== null && imageInputData.length !== 0) {
			document.querySelector("#farmerImagesFormSubmitBtn").click();
		}
	}, [imageInputData]);

	const getFarmerImages = async (farmerId) => {
		return axios
			.get(`/api/farmer_profile_page/farmer_images/${farmerId}`)
			.then((res) => {
				return res.data;
			});
	};

	const getProductImages = async (productId) => {
		return axios
			.get(`/api/farmer_profile_page/product_images/${productId}`)
			.then((res) => {
				return res.data;
			});
	};

	const getProductRating = async (productId) => {
		return axios
			.get(`/api/product_page/product_ratings/${productId}`)
			.then((res) => {
				let totalRating = 0;
				res.data.forEach((rating) => (totalRating += rating.ocjena));
				totalRating = totalRating / res.data.length;
				totalRating = isNaN(totalRating) ? 0 : totalRating;

				return totalRating;
			});
	};

	const getProductInfo = async (product) => {
		let newProduct = product;

		return Promise.all([
			getProductImages(product.sif_oglasa),
			getProductRating(product.sif_oglasa),
		]).then((results) => {
			newProduct.slike = results[0];
			newProduct.rating = results[1];

			let date = new Date(newProduct.datum_kreiranja);
			date.setDate(date.getDate());

			newProduct.datum_kreiranja = date.toLocaleDateString("hr-HR");

			return newProduct;
		});
	};

	const getFarmerProducts = async (farmerId) => {
		const farmerProducts = await axios
			.get(`/api/farmer_profile_page/products/${farmerId}`)
			.then((res) => {
				return res.data;
			});

		let promises = [];
		for (const product of farmerProducts) {
			promises.push(getProductInfo(product));
		}

		return Promise.all(promises).then((results) => {
			return results;
		});
	};

	const getOrderInfo = async (order) => {
		let newOrder = order;

		return Promise.all([getProductImages(newOrder.sif_oglasa)]).then(
			(results) => {
				newOrder.slike = results[0];

				let date1 = new Date(newOrder.datum_kreiranja);
				let date2 = new Date(newOrder.datum_narudzbe);
				let date3 = new Date(newOrder.datum_dostave);

				date1.setDate(date1.getDate());
				date2.setDate(date2.getDate());
				date3.setDate(date3.getDate());

				newOrder.datum_kreiranja = date1.toLocaleDateString("hr-HR");
				newOrder.datum_narudzbe = date2.toLocaleDateString("hr-HR");
				newOrder.datum_dostave = date3.toLocaleDateString("hr-HR");

				return newOrder;
			}
		);
	};

	const getFarmerOrders = async (farmerId) => {
		const farmerOrders = await axios
			.get(
				`/api/farmer_profile_page/orders/${farmerId}`,
				tokenConfig(store.getState)
			)
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return [];
			});

		let promises = [];
		for (const order of farmerOrders) {
			promises.push(getOrderInfo(order));
		}

		return Promise.all(promises).then((results) => {
			return results;
		});
	};

	const getFarmerRatings = async (farmerId) => {
		return axios
			.get(`/api/farmer_profile_page/ratings/${farmerId}`)
			.then((res) => {
				let totalRating = 0;
				res.data.forEach((rating) => {
					let date = new Date(rating.datum_kreiranja);
					date.setDate(date.getDate());
					rating.datum_kreiranja = date.toLocaleDateString("hr-HR");

					// TEST
					console.log(rating.datum_kreiranja);

					totalRating += rating.ocjena;
				});
				totalRating = totalRating / res.data.length;
				totalRating = isNaN(totalRating) ? 0 : totalRating;

				return {
					ratings: res.data,
					totalRating: totalRating,
				};
			});
	};

	// Dohvaćanje podataka o poljoprivredniku, oglasa, narudžbi, ocjena i komentara
	const getFarmerData = async () => {
		const userData = await axios
			.get(
				`/api/farmer_profile_page/farmer_data/${parseInt(
					props.match.params.id
				)}`
			)
			.then((res) => {
				return res.data;
			});

		Promise.all([
			getFarmerImages(userData.sif_poljoprivrednika),
			getFarmerProducts(userData.sif_poljoprivrednika),
			getFarmerOrders(userData.sif_poljoprivrednika),
			getFarmerRatings(userData.sif_poljoprivrednika),
		]).then((results) => {
			setFarmerData({
				userId: userData.sif_korisnika,
				firstName: userData.ime,
				lastName: userData.prezime,
				address: userData.adresa_stanovanja,
				postalCodeLong:
					userData.pbr_mjesta_stanovanja +
					" " +
					userData.naziv_post_ureda,
				county: userData.naziv_zupanije,
				phoneNumber: userData.broj_telefona,
				email: userData.email,
				farmerId: userData.sif_poljoprivrednika,
				farmerName: userData.ime_gospodarstva,
				farmDesc: userData.opis_gospodarstva,
				deliveryDays: userData.rok_isporuke_dani,
				images: results[0],
				products: results[1],
				orders: results[2],
				ratings: results[3].ratings,
				totalRating: results[3].totalRating,
			});

			setNewFarmerInfo({
				userId: userData.sif_korisnika,
				firstName: userData.ime,
				lastName: userData.prezime,
				address: userData.adresa_stanovanja,
				postalCodeLong:
					userData.pbr_mjesta_stanovanja +
					" " +
					userData.naziv_post_ureda,
				phoneNumber: userData.broj_telefona,
				oldEmail: userData.email,
				email: userData.email,
				farmerId: userData.sif_poljoprivrednika,
				farmerName: userData.ime_gospodarstva,
				farmDesc: userData.opis_gospodarstva,
				deliveryDays: userData.rok_isporuke_dani,
			});

			setImagesLoading(false);
		});
	};

	// Dohvaćanje svih poštanskih ureda
	const getPostOffices = async () => {
		return axios.get("/api/register_page/post_offices").then((res) => {
			return res.data;
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

	const getFormData = async () => {
		Promise.all([getPostOffices(), getCategories(), getUnits()]).then(
			(results) => {
				setPostOffices(results[0]);
				setCategories(results[1]);
				setUnits(results[2]);
			}
		);
	};

	const editFarmerInfo = (event) => {
		event.preventDefault();

		axios
			.put(
				"/api/farmer_profile_page/farmer_info",
				{
					userId: parseInt(newFarmerInfo.userId),
					firstName: newFarmerInfo.firstName,
					lastName: newFarmerInfo.lastName,
					address: newFarmerInfo.address,
					postalCode: parseInt(
						newFarmerInfo.postalCodeLong.split()[0]
					),
					phoneNumber: newFarmerInfo.phoneNumber,
					oldEmail: newFarmerInfo.email,
					email: newFarmerInfo.email,
					farmerId: parseInt(newFarmerInfo.farmerId),
					farmerName: newFarmerInfo.farmerName,
					farmDesc: newFarmerInfo.farmDesc,
					deliveryDays: parseInt(newFarmerInfo.deliveryDays),
				},
				tokenConfig(store.getState)
			)
			.catch((err) => {
				setError({
					message: err.response.data.message,
					isOpen: true,
				});
			})
			.then(() => {
				if (error.message === "") {
					setEditMenuIsOpen(false);

					getFarmerData();
				}
			});
	};

	const addImages = async (event) => {
		event.preventDefault();

		setImagesLoading(true);

		const setConfig = async () => {
			let formData = new FormData();
			for (let i = 0; i < imageInputData.length; i++) {
				formData.append("farmer-images", imageInputData[i]);
			}

			let config = tokenConfig(store.getState);
			config.headers["Content-type"] = "multipart/form-data";

			return [formData, config];
		};

		const [formData, config] = await setConfig();

		await axios.post(
			`/api/farmer_profile_page/images/${farmerData.farmerId}`,
			formData,
			config
		);

		getFarmerData();

		document.querySelector("#farmerImagesForm").reset();
		setImageInputData(null);
	};

	const deleteFarmerImage = async (imageId, imageUrl) => {
		setImagesLoading(true);

		let config = tokenConfig(store.getState);
		config.data = {
			imageId: imageId,
			imageUrl: imageUrl,
		};

		await axios.delete("/api/farmer_profile_page/image", config);

		getFarmerData();
	};

	const setOrderIsDelivered = async (orderId, isDelivered) => {
		await axios.put(
			`/api/farmer_profile_page/order/${orderId}`,
			{ isDelivered: isDelivered },
			tokenConfig(store.getState)
		);

		getFarmerData();
	};

	const deleteProductImage = (imageId, imageUrl) => {
		let config = tokenConfig(store.getState);
		config.data = {
			imageId: imageId,
			imageUrl: imageUrl,
		};

		return axios.delete("/api/product_page/image", config);
	};

	const deleteProduct = async (productId, products = farmerData.products) => {
		const canDelete = await axios
			.get(
				`/api/farmer_profile_page/product_delete_check/${parseInt(
					productId
				)}`,
				tokenConfig(store.getState)
			)
			.catch((err) => {
				setError({
					message: err.response.data.message,
					isOpen: true,
				});
				return { data: { message: err.response.data.message } };
			})
			.then((res) => {
				return res.data.message;
			});

		if (canDelete === "Oglas se može obrisati") {
			const images = products.find(
				(item) => parseInt(item.sif_oglasa) === parseInt(productId)
			).slike;

			let promises = [];
			for (const image of images) {
				promises.push(
					deleteProductImage(image.sif_slike, image.url_slike)
				);
			}

			Promise.all(promises).then(() => {
				axios
					.delete(
						`/api/farmer_profile_page/product/${parseInt(
							productId
						)}`,
						tokenConfig(store.getState)
					)
					.then(() => getFarmerData());
			});
		}
	};

	const addRating = async (event) => {
		event.preventDefault();

		await axios.post(
			"/api/farmer_profile_page/rating",
			newRating,
			tokenConfig(store.getState)
		);

		setAddRatingMenuIsOpen(false);
		setNewRating({
			...newRating,
			rating: 5,
			comment: "",
		});

		getFarmerData();
	};

	const deleteRating = async (ratingId) => {
		await axios.delete(
			`/api/farmer_profile_page/rating/${ratingId}`,
			tokenConfig(store.getState)
		);

		getFarmerData();
	};

	if (
		farmerData === null ||
		farmerData.orders === null ||
		farmerData.products === null ||
		postOffices.length === 0 ||
		categories === null ||
		units === null
	) {
		return (
			<div className="FarmerProfilePage">
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
			<div className="FarmerProfilePage">
				<NavBar />

				<Toolbar />

				<Box className={classes.pageWrapper}>
					<form
						id="farmerInfoForm"
						onSubmit={(event) => editFarmerInfo(event)}
					></form>
					<form
						id="farmerImagesForm"
						onSubmit={(event) => addImages(event)}
					></form>

					<Box className={classes.sectionPaper}>
						<Container maxWidth="lg">
							<Box
								className={
									!editMenuIsOpen
										? `${classes.sectionTitleFlexStart}`
										: `${classes.sectionTitleFlexStart} ${classes.rowItem}`
								}
							>
								{!editMenuIsOpen ? (
									<Typography variant="h3">
										{farmerData.farmerName}
									</Typography>
								) : (
									<React.Fragment>
										<Hidden smDown>
											<Box
												className={classes.nameEditBox}
											>
												<TextField
													variant="filled"
													fullWidth
													id="farmerName"
													label="Ime gospodarstva"
													required
													inputProps={{
														form: "farmerInfoForm",
													}}
													value={
														newFarmerInfo.farmerName
													}
													onChange={(event) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															farmerName:
																event.target
																	.value,
														});
													}}
												/>
											</Box>
										</Hidden>

										<Hidden mdUp>
											<Box
												className={
													classes.nameEditBoxSm
												}
											>
												<TextField
													variant="filled"
													fullWidth
													id="farmerName"
													label="Ime gospodarstva"
													required
													inputProps={{
														form: "farmerInfoForm",
													}}
													value={
														newFarmerInfo.farmerName
													}
													onChange={(event) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															farmerName:
																event.target
																	.value,
														});
													}}
												/>
											</Box>
										</Hidden>
									</React.Fragment>
								)}

								{props.auth.user === null ||
								!(
									props.auth.user.userId ===
									parseInt(props.match.params.id)
								) ? (
									<React.Fragment />
								) : !editMenuIsOpen ? (
									<Button
										variant="outlined"
										size="medium"
										color="inherit"
										onClick={() => setEditMenuIsOpen(true)}
									>
										Uredi
									</Button>
								) : (
									<Box className={classes.editButtons}>
										<Hidden xsDown>
											<Button
												type="submit"
												form="farmerInfoForm"
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
													setNewFarmerInfo({
														userId:
															farmerData.userId,
														firstName:
															farmerData.firstName,
														lastName:
															farmerData.lastName,
														address:
															farmerData.address,
														postalCodeLong:
															farmerData.postalCodeLong,
														phoneNumber:
															farmerData.phoneNumber,
														oldEmail:
															farmerData.email,
														email: farmerData.email,
														farmerId:
															farmerData.farmerId,
														farmerName:
															farmerData.farmerName,
														farmDesc:
															farmerData.farmDesc,
														deliveryDays:
															farmerData.deliveryDays,
													});

													setEditMenuIsOpen(false);
												}}
											>
												Odustani
											</Button>
										</Hidden>

										<Hidden smUp>
											<Tooltip title="Spremi">
												<IconButton
													type="submit"
													form="farmerInfoForm"
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
														setNewFarmerInfo({
															userId:
																farmerData.userId,
															firstName:
																farmerData.firstName,
															lastName:
																farmerData.lastName,
															address:
																farmerData.address,
															postalCodeLong:
																farmerData.postalCodeLong,
															phoneNumber:
																farmerData.phoneNumber,
															oldEmail:
																farmerData.email,
															email:
																farmerData.email,
															farmerId:
																farmerData.farmerId,
															farmerName:
																farmerData.farmerName,
															farmDesc:
																farmerData.farmDesc,
															deliveryDays:
																farmerData.deliveryDays,
														});

														setEditMenuIsOpen(
															false
														);
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
									<Typography variant="body1">
										{farmerData.farmDesc}
									</Typography>
								) : (
									<TextField
										variant="filled"
										fullWidth
										multiline
										rows={4}
										id="farmDesc"
										label="Opis gospodarstva"
										helperText="Opis čime se gospodarstvo bavi, što proizvodi te dodatni podaci"
										required
										inputProps={{ form: "farmerInfoForm" }}
										value={newFarmerInfo.farmDesc}
										onChange={(event) => {
											setNewFarmerInfo({
												...newFarmerInfo,
												farmDesc: event.target.value,
											});
										}}
									/>
								)}
							</Box>

							<Box className={classes.subSection}>
								<Typography
									variant="h5"
									className={classes.subSectionTitle}
								>
									Slike gospodarstva
								</Typography>

								{farmerData.images !== null &&
								farmerData.images.length !== 0 ? (
									<Box
										className={`horizontalScroll ${classes.horizontalScroll} ${classes.rowItem}`}
									>
										{farmerData.images.map((image) => (
											<Paper
												variant="outlined"
												key={image.sif_slike}
												className={classes.imagePaper}
											>
												<a
													href={
														image.url_slike +
														"?content-disposition=inline"
													}
													target="_blank"
													rel="noopener noreferrer"
												>
													<img
														src={image.url_slike}
														alt="Slika gospodarstva"
														className={
															imagesLoading
																? `${classes.image} ${classes.loadingOverlay}`
																: `${classes.image}`
														}
													/>
												</a>

												{props.auth.user !== null &&
												props.auth.user.userId ===
													parseInt(
														props.match.params.id
													) &&
												image !== undefined &&
												image !== null ? (
													<Button
														size="small"
														color="inherit"
														disabled={imagesLoading}
														onClick={() =>
															deleteFarmerImage(
																image.sif_slike,
																image.url_slike
															)
														}
													>
														Obriši
													</Button>
												) : (
													<React.Fragment />
												)}
											</Paper>
										))}
									</Box>
								) : (
									<Typography variant="body1">
										Nema slika
									</Typography>
								)}

								{props.auth.user !== null &&
								props.auth.user.userId ===
									parseInt(props.match.params.id) ? (
									<Box className={classes.subSection}>
										<input
											id="add-files-button"
											name="farmer-images"
											type="file"
											form="farmerImagesForm"
											multiple
											accept="image/*"
											onChange={(event) =>
												setImageInputData(
													event.target.files
												)
											}
											className={classes.hiddenInput}
										/>
										<label htmlFor="add-files-button">
											<Box
												className={classes.addImagesBox}
											>
												<Button
													component="span"
													variant="outlined"
													size="medium"
													color="inherit"
													style={{
														marginRight: "16px",
													}}
													disabled={imagesLoading}
												>
													Dodaj slike
												</Button>

												{imagesLoading ? (
													<CircularProgress
														color="inherit"
														size={25}
													/>
												) : (
													<React.Fragment />
												)}
											</Box>
										</label>

										<Button
											id="farmerImagesFormSubmitBtn"
											type="submit"
											form="farmerImagesForm"
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
								<Typography
									variant="h5"
									className={classes.subSectionTitle}
								>
									Kontakt podaci
								</Typography>

								{!editMenuIsOpen ? (
									<Box className={classes.farmerInfo}>
										<Typography
											variant="subtitle2"
											color="textSecondary"
											className={classes.columnItem}
										>
											Adresa:
										</Typography>

										<Box className={classes.farmerAddress}>
											<Typography variant="body1">
												{farmerData.address}
											</Typography>

											<Typography variant="body1">
												{farmerData.postalCodeLong}
											</Typography>

											<Typography variant="body1">
												{farmerData.county}
											</Typography>
										</Box>
									</Box>
								) : (
									<React.Fragment>
										<Hidden smDown>
											<Box
												className={
													classes.addressEditBox
												}
											>
												<Box
													style={{ width: "49.40%" }}
												>
													<TextField
														variant="filled"
														fullWidth
														id="address"
														label="Adresa stanovanja"
														helperText="npr. Unska ulica 3, Zagreb"
														required
														inputProps={{
															form:
																"farmerInfoForm",
														}}
														value={
															newFarmerInfo.address
														}
														onChange={(event) => {
															setNewFarmerInfo({
																...newFarmerInfo,
																address:
																	event.target
																		.value,
															});
														}}
													/>
												</Box>

												<Box
													style={{ width: "49.40%" }}
												>
													<Autocomplete
														id="postalCodeLong"
														fullWidth
														autoSelect
														renderInput={(
															params
														) => (
															<TextField
																{...params}
																variant="filled"
																label="Poštanski broj"
																required
																inputProps={{
																	...params.inputProps,
																	form:
																		"farmerInfoForm",
																}}
															/>
														)}
														options={postOffices
															.map(
																(
																	postOffice
																) => {
																	return (
																		postOffice.post_broj +
																		" " +
																		postOffice.naziv_post_ureda
																	);
																}
															)
															.sort(
																new Intl.Collator(
																	"hr"
																).compare
															)}
														getOptionLabel={(
															option
														) => option}
														value={
															newFarmerInfo.postalCodeLong
														}
														onChange={(
															event,
															value
														) => {
															setNewFarmerInfo({
																...newFarmerInfo,
																postalCodeLong: value,
															});
														}}
													/>
												</Box>
											</Box>
										</Hidden>

										<Hidden mdUp>
											<Box
												className={
													classes.addressEditBoxSm
												}
											>
												<TextField
													variant="filled"
													fullWidth
													id="address"
													label="Adresa stanovanja"
													helperText="npr. Unska ulica 3, Zagreb"
													required
													inputProps={{
														form: "farmerInfoForm",
													}}
													value={
														newFarmerInfo.address
													}
													onChange={(event) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															address:
																event.target
																	.value,
														});
													}}
													className={classes.rowItem}
												/>

												<Autocomplete
													id="postalCodeLong"
													fullWidth
													autoSelect
													renderInput={(params) => (
														<TextField
															{...params}
															variant="filled"
															label="Poštanski broj"
															required
															inputProps={{
																...params.inputProps,
																form:
																	"farmerInfoForm",
															}}
															className={
																classes.rowItem
															}
														/>
													)}
													options={postOffices
														.map((postOffice) => {
															return (
																postOffice.post_broj +
																" " +
																postOffice.naziv_post_ureda
															);
														})
														.sort(
															new Intl.Collator(
																"hr"
															).compare
														)}
													getOptionLabel={(option) =>
														option
													}
													value={
														newFarmerInfo.postalCodeLong
													}
													onChange={(
														event,
														value
													) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															postalCodeLong: value,
														});
													}}
												/>
											</Box>
										</Hidden>
									</React.Fragment>
								)}

								{!editMenuIsOpen ? (
									<Box className={classes.farmerInfo}>
										<Typography
											variant="subtitle2"
											color="textSecondary"
											className={classes.columnItem}
										>
											Broj telefona:
										</Typography>

										<Typography variant="body1">
											{farmerData.phoneNumber}
										</Typography>
									</Box>
								) : (
									<React.Fragment>
										<Hidden smDown>
											<Box
												className={
													classes.contactsEditBox
												}
											>
												<TextField
													variant="filled"
													fullWidth
													id="phoneNumber"
													label="Broj telefona"
													required
													inputProps={{
														form: "farmerInfoForm",
													}}
													value={
														newFarmerInfo.phoneNumber
													}
													onChange={(event) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															phoneNumber:
																event.target
																	.value,
														});
													}}
													className={classes.rowItem}
												/>
											</Box>
										</Hidden>

										<Hidden mdUp>
											<Box
												className={
													classes.contactsEditBoxSm
												}
											>
												<TextField
													variant="filled"
													fullWidth
													id="phoneNumber"
													label="Broj telefona"
													required
													inputProps={{
														form: "farmerInfoForm",
													}}
													value={
														newFarmerInfo.phoneNumber
													}
													onChange={(event) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															phoneNumber:
																event.target
																	.value,
														});
													}}
													className={classes.rowItem}
												/>
											</Box>
										</Hidden>
									</React.Fragment>
								)}

								{!editMenuIsOpen ? (
									<Box className={classes.farmerInfo}>
										<Typography
											variant="subtitle2"
											color="textSecondary"
											className={classes.columnItem}
										>
											E-mail adresa:
										</Typography>

										<Typography variant="body1">
											{farmerData.email}
										</Typography>
									</Box>
								) : (
									<React.Fragment>
										<Hidden smDown>
											<Box
												className={
													classes.contactsEditBox
												}
											>
												<TextField
													variant="filled"
													fullWidth
													type="email"
													id="email"
													label="E-mail adresa"
													required
													inputProps={{
														form: "farmerInfoForm",
													}}
													value={newFarmerInfo.email}
													onChange={(event) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															email:
																event.target
																	.value,
														});
													}}
												/>
											</Box>
										</Hidden>

										<Hidden mdUp>
											<Box
												className={
													classes.contactsEditBoxSm
												}
											>
												<TextField
													variant="filled"
													fullWidth
													type="email"
													id="email"
													label="E-mail adresa"
													required
													inputProps={{
														form: "farmerInfoForm",
													}}
													value={newFarmerInfo.email}
													onChange={(event) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															email:
																event.target
																	.value,
														});
													}}
												/>
											</Box>
										</Hidden>
									</React.Fragment>
								)}
							</Box>

							<Box>
								<Typography
									variant="h5"
									className={classes.subSectionTitle}
								>
									Dostava
								</Typography>

								{!editMenuIsOpen ? (
									<Typography variant="body1">
										Dostava u roku od{" "}
										{farmerData.deliveryDays} dana.
									</Typography>
								) : (
									<React.Fragment>
										<Hidden smDown>
											<Box
												className={
													classes.contactsEditBox
												}
											>
												<TextField
													variant="filled"
													fullWidth
													type="number"
													id="deliveryDays"
													label="Rok dostave u danima"
													required
													inputProps={{
														form: "farmerInfoForm",
													}}
													value={
														newFarmerInfo.deliveryDays
													}
													onChange={(event) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															deliveryDays:
																event.target
																	.value,
														});
													}}
												/>
											</Box>
										</Hidden>

										<Hidden mdUp>
											<Box
												className={
													classes.contactsEditBoxSm
												}
											>
												<TextField
													variant="filled"
													fullWidth
													type="number"
													id="deliveryDays"
													label="Rok dostave u danima"
													required
													inputProps={{
														form: "farmerInfoForm",
													}}
													value={
														newFarmerInfo.deliveryDays
													}
													onChange={(event) => {
														setNewFarmerInfo({
															...newFarmerInfo,
															deliveryDays:
																event.target
																	.value,
														});
													}}
												/>
											</Box>
										</Hidden>
									</React.Fragment>
								)}
							</Box>
						</Container>
					</Box>

					{props.auth.user === null ||
					!(
						props.auth.user.userId ===
						parseInt(props.match.params.id)
					) ? (
						<React.Fragment />
					) : (
						<Box className={classes.section}>
							<Container maxWidth="lg">
								<Box className={classes.sectionTitleFlex}>
									<Typography variant="h4">
										{!orderHistoryIsOpen
											? "Narudžbe"
											: "Povijest narudžbi"}
									</Typography>

									<Button
										variant="outlined"
										size="medium"
										color="inherit"
										onClick={() => {
											setOrderHistoryIsOpen(
												!orderHistoryIsOpen
											);
											setPageNumOrders(1);
										}}
									>
										{!orderHistoryIsOpen
											? "Povijest narudžbi"
											: "Trenutne narudžbe"}
									</Button>
								</Box>

								{farmerData.orders !== null &&
								farmerData.orders.length !== 0 ? (
									<React.Fragment>
										<Grid
											container
											spacing={4}
											direction="row"
											justify="flex-start"
										>
											{farmerData.orders
												.filter(
													(order) =>
														order.dostavljena ===
														orderHistoryIsOpen
												)
												.sort((order1, order2) => {
													const dateString1 = order1.datum_narudzbe.split(
														". "
													);
													const dateString2 = order2.datum_narudzbe.split(
														". "
													);

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

													date1.setDate(
														date1.getDate()
													);
													date2.setDate(
														date2.getDate()
													);

													if (date1 < date2) {
														return 1;
													} else if (date1 > date2) {
														return -1;
													} else {
														return 0;
													}
												})
												.slice(
													(pageNumOrders - 1) * 4,
													(pageNumOrders - 1) * 4 + 4
												)
												.map((order) => (
													<Grid
														item
														xs={12}
														sm={6}
														md={4}
														lg={3}
														key={order.sif_narudzbe}
													>
														<OrderCardFarmer
															order={order}
															deliveryDays={
																farmerData.deliveryDays
															}
															setOrderIsDelivered={
																setOrderIsDelivered
															}
														/>
													</Grid>
												))}
										</Grid>

										{farmerData.orders.length <= 4 ? (
											<React.Fragment />
										) : (
											<Box className={classes.pagination}>
												<Pagination
													count={Math.ceil(
														farmerData.orders.filter(
															(order) =>
																order.dostavljena ===
																orderHistoryIsOpen
														).length / 4
													)}
													defaultPage={1}
													page={pageNumOrders}
													onChange={(event, page) =>
														setPageNumOrders(page)
													}
												/>
											</Box>
										)}
									</React.Fragment>
								) : (
									<Typography variant="body1">
										Nema narudžbi
									</Typography>
								)}
							</Container>
						</Box>
					)}

					<Box
						className={
							props.auth.user !== null &&
							props.auth.user.userId ===
								parseInt(props.match.params.id)
								? `${classes.sectionPaper}`
								: `${classes.section}`
						}
					>
						<Container maxWidth="lg">
							<Box className={classes.sectionTitleFlex}>
								<Typography variant="h4">Oglasi</Typography>

								{props.auth.user === null ||
								!(
									props.auth.user.userId ===
									parseInt(props.match.params.id)
								) ? (
									<React.Fragment />
								) : (
									<Link
										to={`/oglas/novi_oglas`}
										className={classes.link}
									>
										<Button
											variant="contained"
											size="medium"
											color="primary"
											className={classes.button}
										>
											Novi oglas
										</Button>
									</Link>
								)}
							</Box>

							{farmerData.products !== null &&
							farmerData.products.length !== 0 ? (
								<React.Fragment>
									<Grid
										container
										spacing={4}
										direction="row"
										justify="flex-start"
									>
										{farmerData.products
											.sort((product1, product2) => {
												const dateString1 = product1.datum_kreiranja.split(
													". "
												);
												const dateString2 = product2.datum_kreiranja.split(
													". "
												);

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
												(pageNumProducts - 1) * 4,
												(pageNumProducts - 1) * 4 + 4
											)
											.map((product) => (
												<Grid
													item
													xs={12}
													sm={6}
													md={4}
													lg={3}
													key={product.sif_oglasa}
												>
													<ProductCardFarmer
														product={product}
														farmerId={parseInt(
															props.match.params
																.id
														)}
														deleteProduct={
															deleteProduct
														}
													/>
												</Grid>
											))}
									</Grid>

									{farmerData.products.length <= 4 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil(
													farmerData.products.length /
														4
												)}
												defaultPage={1}
												page={pageNumProducts}
												onChange={(event, page) =>
													setPageNumProducts(page)
												}
											/>
										</Box>
									)}
								</React.Fragment>
							) : (
								<Typography variant="body1">
									Nema oglasa
								</Typography>
							)}
						</Container>
					</Box>

					<Box
						className={
							props.auth.user !== null &&
							props.auth.user.userId ===
								parseInt(props.match.params.id)
								? `${classes.section}`
								: `${classes.sectionPaper}`
						}
					>
						<Container maxWidth="lg">
							<Box className={classes.sectionTitleFlex}>
								<Typography variant="h4">Ocjena</Typography>

								<Rating
									value={farmerData.totalRating}
									size="large"
									precision={0.5}
									readOnly
								/>
							</Box>

							{farmerData.ratings !== null &&
							farmerData.ratings.length !== 0 ? (
								<React.Fragment>
									{farmerData.ratings
										.sort((rating1, rating2) => {
											const dateString1 = rating1.datum_kreiranja.split(
												". "
											);
											const dateString2 = rating2.datum_kreiranja.split(
												". "
											);

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
												<Box
													className={
														classes.ratingNameBtnBox
													}
												>
													<Rating
														value={rating.ocjena}
														precision={0.5}
														readOnly
														className={
															classes.rowItem
														}
													/>

													{props.auth.user === null ||
													!(
														props.auth.user
															.userId ===
														rating.sif_autora
													) ? (
														<React.Fragment />
													) : (
														<Button
															size="medium"
															color="inherit"
															onClick={() =>
																deleteRating(
																	rating.sif_ocjene
																)
															}
														>
															Obriši
														</Button>
													)}
												</Box>

												<Box className={classes.rating}>
													<Typography
														variant="body1"
														className={
															classes.rowItem
														}
													>
														{rating.komentar}
													</Typography>

													<Typography
														variant="subtitle2"
														color="textSecondary"
														className={
															classes.rowItem
														}
													>
														{rating.ime}{" "}
														{rating.prezime}
													</Typography>

													<Typography
														variant="caption"
														color="textSecondary"
													>
														{rating.datum_kreiranja}
													</Typography>
												</Box>

												{rating.sif_ocjene !==
													farmerData.ratings[
														farmerData.ratings
															.length - 1
													].sif_ocjene &&
												index !==
													pageNumRatings * 3 - 1 ? (
													<Divider />
												) : (
													<React.Fragment />
												)}
											</Box>
										))}

									{farmerData.ratings.length <= 3 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil(
													farmerData.ratings.length /
														3
												)}
												defaultPage={1}
												page={pageNumRatings}
												onChange={(event, page) =>
													setPageNumRatings(page)
												}
											/>
										</Box>
									)}
								</React.Fragment>
							) : !addRatingMenuIsOpen ? (
								<Typography variant="body1">
									Nema ocjena
								</Typography>
							) : (
								<React.Fragment />
							)}

							{addRatingMenuIsOpen ? (
								<Box className={classes.rowItem}>
									<form
										onSubmit={(event) => addRating(event)}
									>
										{farmerData.ratings !== null &&
										farmerData.ratings.length !== 0 ? (
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
														comment:
															event.target.value,
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
													setAddRatingMenuIsOpen(
														false
													);
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
												farmerId: farmerData.farmerId,
												authorId:
													props.auth.user.userId,
												comment: "",
											});
										}

										setAddRatingMenuIsOpen(true);
									}}
									className={`${classes.button} ${classes.addRatingButton} ${classes.rowItem}`}
								>
									Dodaj ocjenu
								</Button>
							) : (
								<React.Fragment />
							)}
						</Container>
					</Box>
				</Box>

				<Snackbar
					open={error.isOpen}
					autoHideDuration={4000}
					onClose={(event, reason) => {
						if (reason === "clickaway") {
							return;
						}

						setError({
							message: "",
							isOpen: false,
						});
					}}
				>
					<Alert severity="error">{error.message}</Alert>
				</Snackbar>

				<Footer />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { tokenConfig })(FarmerProfilePage);
