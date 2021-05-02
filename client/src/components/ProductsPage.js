import React, { useState, useEffect } from "react";
import store from "../store";
import { connect } from "react-redux";
import { tokenConfig } from "../actions/authActions";
import { Link } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
	Box,
	Container,
	Typography,
	Toolbar,
	Backdrop,
	CircularProgress,
	Grid,
	TextField,
	Button,
	IconButton,
	Hidden,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Menu,
	MenuItem,
	Snackbar,
} from "@material-ui/core";
import { Autocomplete, Alert, Pagination } from "@material-ui/lab";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";
import SortIcon from "@material-ui/icons/Sort";
import productsImage from "../assets/images/productsImage.jpg";
import NavBar from "./shared/NavBar";
import Footer from "./shared/Footer";
import ProductCardMoreInfo from "./ProductCardMoreInfo";
import ProductCard from "./ProductCard";

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: "none",
		color: theme.palette.text.primary,
	},

	buttonLink: {
		textDecoration: "none",
		color: theme.palette.background.paper,
	},

	menuLink: {
		textDecoration: "none",
		color: theme.palette.text.primary,
	},

	button: {
		color: theme.palette.background.paper,
	},

	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},

	pageWrapper: {
		minHeight: "89.25vh",
		height: "auto",
		display: "flex",
		flexDirection: "column",
	},

	image: {
		height: "15vh",
		backgroundImage: `url(${productsImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
		marginBottom: theme.spacing(1),
	},

	imageOverlay: {
		height: "15vh",
		backgroundColor: "#0000006E",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},

	title: {
		color: theme.palette.background.default,
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
		backgroundColor: theme.palette.background.default,
	},

	sectionTitle: {
		marginBottom: theme.spacing(3),
	},

	item: {
		marginBottom: theme.spacing(1),
	},

	flexRow: {
		display: "flex",
		flexDirection: "row",
		alignItems: "start",
		justifyContent: "space-between",
	},

	flexColumn: {
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	formItemBox: {
		width: "49.49%",
	},

	formItemBoxSm: {
		width: "100%",
	},

	expPanel: {
		paddingTop: theme.spacing(1),
		backgroundColor: theme.palette.background.default,
	},

	expPanelDetails: {
		display: "flex",
		flexDirection: "column",
	},

	expPanelNote: {
		marginTop: theme.spacing(3),
	},

	filterIcon: {
		marginRight: theme.spacing(1),
	},

	searchButtonBox: {
		marginTop: theme.spacing(4),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},

	searchButton: {
		color: theme.palette.background.paper,
		width: "25%",
	},

	searchButtonSm: {
		color: theme.palette.background.paper,
		width: "50%",
	},

	searchIcon: {
		marginLeft: theme.spacing(1),
		color: theme.palette.background.paper,
	},

	sortBox: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
		marginBottom: theme.spacing(2),
	},

	resultsMenuBox: {
		display: "flex",
		flexDirection: "row",
		alignItems: "start",
		justifyContent: "space-between",
		marginBottom: theme.spacing(5),
	},

	farmerButtonsBox: {
		paddingTop: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "start",
	},

	farmerButtonsBoxSm: {
		paddingTop: theme.spacing(1),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	farmerButtonMarginRow: {
		marginRight: theme.spacing(2),
	},

	farmerButtonMarginColumn: {
		marginBottom: theme.spacing(2),
	},

	sortSubBox: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "flex-end",
	},

	pagination: {
		marginTop: theme.spacing(5),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
}));

function ProductsPage(props) {
	const classes = useStyles();

	const [formData, setFormData] = useState(null);

	const [category, setCategory] = useState(null);
	const [filter, setFilter] = useState({
		type: 0,
		id: 0,
	});
	const [sort, setSort] = useState({
		type: 0,
		asc: 0,
	});

	const [pageNum, setPageNum] = useState(1);

	const [anchorElement, setAnchorElement] = useState(null);

	const [products, setProducts] = useState({
		isLoading: false,
		data: null,
	});

	const [error, setError] = useState({
		message: "",
		isOpen: false,
	});

	useEffect(() => {
		const url = new URL(window.location.href);
		const searchParams = url.searchParams;

		const filterType = parseInt(searchParams.get("filterType"));
		const filterId = parseInt(searchParams.get("filterId"));

		const sortType = parseInt(searchParams.get("sortType"));
		const sortAsc = parseInt(searchParams.get("sortAsc"));

		if (props.match.params.categoryId === "all") {
			setCategory(props.match.params.categoryId);
		} else {
			setCategory(parseInt(props.match.params.categoryId));
		}

		setFilter({
			type: filterType,
			id: filterId,
		});

		setSort({
			type: sortType,
			asc: sortAsc,
		});

		if (
			props.match.params.categoryId !== null &&
			parseInt(props.match.params.categoryId) !== 0
		) {
			getProductsData(filterType, filterId);
		} else {
			setProducts({
				isLoading: false,
				data: null,
			});
		}

		getFormData();
	}, [props.match.params]);

	useEffect(() => {
		setPageNum(1);
	}, [products.data]);

	const getCategories = async () => {
		return axios.get("/api/product_page/categories");
	};

	const getUnits = async () => {
		return axios.get("/api/product_page/units");
	};

	const getCounties = async () => {
		return axios.get("/api/products_page/counties");
	};

	const getFarmers = async () => {
		return axios.get("/api/products_page/farmers");
	};

	// Dohvaćanje svih vrsta proizvoda i mjernih jedinica
	const getFormData = async () => {
		Promise.all([
			getCategories(),
			getUnits(),
			getCounties(),
			getFarmers(),
		]).then((results) =>
			setFormData({
				categories: results[0].data,
				units: results[1].data,
				counties: results[2].data,
				farmers: results[3].data,
			})
		);
	};

	const getProductImages = async (productId) => {
		return axios
			.get(`/api/products_page/product_images/${productId}`)
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

		return new Promise((resolve) => {
			resolve(
				Promise.all([
					getProductImages(product.sif_oglasa),
					getProductRating(product.sif_oglasa),
				]).then((results) => {
					newProduct.slike = results[0];
					newProduct.rating = results[1];

					let date = new Date(newProduct.datum_kreiranja);
					date.setDate(date.getDate());

					newProduct.datum_kreiranja = date.toLocaleDateString("hr-HR");

					return newProduct;
				})
			);
		});
	};

	// Dohvaćanje podataka o oglasima
	const getProductsData = async (filterType, filterId) => {
		setProducts({
			...products,
			isLoading: true,
		});

		const productsData = await axios
			.get(
				`/api/products_page/products/${props.match.params.categoryId}/${filterType}/${filterId}`
			)
			.then((res) => {
				return res.data;
			});

		let promises = [];
		for (const product of productsData) {
			promises.push(getProductInfo(product));
		}

		Promise.all(promises).then((results) => {
			setProducts({
				isLoading: false,
				data: results,
			});
		});
	};

	// Pretraživanje
	const search = (event) => {
		event.preventDefault();

		props.history.push(
			`/oglasi/${category}?filterType=${filter.type}&filterId=${filter.id}&sortType=3&sortAsc=2`
		);
	};

	const deleteProductImage = (imageId, imageUrl) => {
		let config = tokenConfig(store.getState);
		config.data = {
			imageId: imageId,
			imageUrl: imageUrl,
		};

		return axios.delete("/api/product_page/image", config);
	};

	const deleteProduct = async (productId, productsData = products.data) => {
		const canDelete = await axios
			.get(
				`/api/farmer_profile_page/product_delete_check/${parseInt(productId)}`,
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
			const images = productsData.find(
				(item) => parseInt(item.sif_oglasa) === parseInt(productId)
			).slike;

			let promises = [];
			for (const image of images) {
				promises.push(deleteProductImage(image.sif_slike, image.url_slike));
			}

			Promise.all(promises).then(() => {
				axios
					.delete(
						`/api/farmer_profile_page/product/${parseInt(productId)}`,
						tokenConfig(store.getState)
					)
					.then(() => getProductsData(filter.type, filter.id));
			});
		}
	};

	if (formData === null) {
		return (
			<div className="ProductsPage">
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
			<div className="ProductsPage">
				<NavBar />

				<Toolbar />

				<Box className={classes.pageWrapper}>
					<Box className={classes.image}>
						<Box className={classes.imageOverlay}>
							<Container maxWidth="lg">
								<Typography
									variant="h3"
									align="center"
									className={classes.title}
								>
									Oglasi
								</Typography>
							</Container>
						</Box>
					</Box>

					<Box className={classes.sectionPaper}>
						<Container maxWidth="lg">
							<form onSubmit={(event) => search(event)}>
								<Hidden smDown>
									<Box className={classes.flexRow}>
										<Box className={classes.formItemBox}>
											<Autocomplete
												id="category"
												fullWidth
												autoSelect
												renderInput={(params) => (
													<TextField
														{...params}
														variant="filled"
														label="Proizvod"
														required
													/>
												)}
												options={formData.categories
													.map((item) => item.naziv_vrste_proizvoda)
													.sort(new Intl.Collator("hr").compare)
													.concat("Svi")}
												getOptionLabel={(option) => option}
												value={
													category === 0
														? ""
														: category === "all"
														? "Svi"
														: formData.categories.find(
																(item) => item.sif_vrste_proizvoda === category
														  ).naziv_vrste_proizvoda
												}
												onChange={(event, value) => {
													if (
														value === null ||
														value === "" ||
														value === "Svi"
													) {
														setCategory("all");
													} else {
														const categoryId = formData.categories.find(
															(item) => item.naziv_vrste_proizvoda === value
														).sif_vrste_proizvoda;

														setCategory(categoryId);
													}
												}}
											/>
										</Box>

										<Box className={classes.formItemBox}>
											<ExpansionPanel
												square={true}
												className={classes.expPanel}
											>
												<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
													<FilterListIcon
														fontSize="small"
														className={classes.filterIcon}
													/>

													<Typography variant="body1">
														Filtriraj oglase
													</Typography>
												</ExpansionPanelSummary>

												<ExpansionPanelDetails
													className={classes.expPanelDetails}
												>
													<Box className={classes.formItemBoxSm}>
														<Autocomplete
															id="countyFilter"
															fullWidth
															renderInput={(params) => (
																<TextField
																	{...params}
																	variant="filled"
																	label="Županija"
																/>
															)}
															options={formData.counties
																.map((item) => item.naziv_zupanije)
																.sort(new Intl.Collator("hr").compare)
																.concat("Sve")}
															getOptionLabel={(option) => option}
															value={
																filter.type === 1
																	? formData.counties.find(
																			(item) => item.sif_zupanije === filter.id
																	  ).naziv_zupanije
																	: "Sve"
															}
															onChange={(event, value) => {
																if (value !== null && value !== "Sve") {
																	setFilter({
																		type: 1,
																		id: formData.counties.find(
																			(item) => item.naziv_zupanije === value
																		).sif_zupanije,
																	});
																} else {
																	if (filter.type !== 2) {
																		setFilter({
																			type: 0,
																			id: 0,
																		});
																	}
																}
															}}
															className={classes.item}
														/>

														<Autocomplete
															id="farmerFilter"
															fullWidth
															renderInput={(params) => (
																<TextField
																	{...params}
																	variant="filled"
																	label="Proizvođač"
																/>
															)}
															options={formData.farmers
																.map((item) => item.ime_gospodarstva)
																.sort(new Intl.Collator("hr").compare)
																.concat("Svi")}
															getOptionLabel={(option) => option}
															value={
																filter.type === 2
																	? formData.farmers.find(
																			(item) => item.sif_korisnika === filter.id
																	  ).ime_gospodarstva
																	: "Svi"
															}
															onChange={(event, value) => {
																if (value !== null && value !== "Svi") {
																	setFilter({
																		type: 2,
																		id: formData.farmers.find(
																			(item) => item.ime_gospodarstva === value
																		).sif_korisnika,
																	});
																} else {
																	if (filter.type !== 1) {
																		setFilter({
																			type: 0,
																			id: 0,
																		});
																	}
																}
															}}
														/>
													</Box>

													<Typography
														variant="body1"
														color="textSecondary"
														className={classes.expPanelNote}
													>
														Napomena: Moguće je filtrirati samo po jednom
														kriteriju
													</Typography>
												</ExpansionPanelDetails>
											</ExpansionPanel>
										</Box>
									</Box>
								</Hidden>

								<Hidden mdUp>
									<Box className={classes.flexColumn}>
										<Box className={classes.formItemBoxSm}>
											<Autocomplete
												id="category"
												fullWidth
												autoSelect
												renderInput={(params) => (
													<TextField
														{...params}
														variant="filled"
														label="Proizvod"
														required
													/>
												)}
												options={formData.categories
													.map((item) => item.naziv_vrste_proizvoda)
													.sort(new Intl.Collator("hr").compare)
													.concat("Svi")}
												getOptionLabel={(option) => option}
												value={
													category === 0
														? ""
														: category === "all"
														? "Svi"
														: formData.categories.find(
																(item) => item.sif_vrste_proizvoda === category
														  ).naziv_vrste_proizvoda
												}
												onChange={(event, value) => {
													if (
														value === null ||
														value === "" ||
														value === "Svi"
													) {
														setCategory("all");
													} else {
														const categoryId = formData.categories.find(
															(item) => item.naziv_vrste_proizvoda === value
														).sif_vrste_proizvoda;

														setCategory(categoryId);
													}
												}}
												className={classes.item}
											/>
										</Box>

										<Box className={classes.formItemBoxSm}>
											<ExpansionPanel
												square={true}
												className={classes.expPanel}
											>
												<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
													<FilterListIcon
														fontSize="small"
														className={classes.filterIcon}
													/>

													<Typography variant="body1">
														Filtriraj oglase
													</Typography>
												</ExpansionPanelSummary>

												<ExpansionPanelDetails
													className={classes.expPanelDetails}
												>
													<Box className={classes.formItemBoxSm}>
														<Autocomplete
															id="countyFilter"
															fullWidth
															renderInput={(params) => (
																<TextField
																	{...params}
																	variant="filled"
																	label="Županija"
																/>
															)}
															options={formData.counties
																.map((item) => item.naziv_zupanije)
																.sort(new Intl.Collator("hr").compare)
																.concat("Sve")}
															getOptionLabel={(option) => option}
															value={
																filter.type === 1
																	? formData.counties.find(
																			(item) => item.sif_zupanije === filter.id
																	  ).naziv_zupanije
																	: "Sve"
															}
															onChange={(event, value) => {
																if (value !== null && value !== "Sve") {
																	setFilter({
																		type: 1,
																		id: formData.counties.find(
																			(item) => item.naziv_zupanije === value
																		).sif_zupanije,
																	});
																} else {
																	if (filter.type !== 2) {
																		setFilter({
																			type: 0,
																			id: 0,
																		});
																	}
																}
															}}
															className={classes.item}
														/>

														<Autocomplete
															id="farmerFilter"
															fullWidth
															renderInput={(params) => (
																<TextField
																	{...params}
																	variant="filled"
																	label="Proizvođač"
																/>
															)}
															options={formData.farmers
																.map((item) => item.ime_gospodarstva)
																.sort(new Intl.Collator("hr").compare)
																.concat("Svi")}
															getOptionLabel={(option) => option}
															value={
																filter.type === 2
																	? formData.farmers.find(
																			(item) => item.sif_korisnika === filter.id
																	  ).ime_gospodarstva
																	: "Svi"
															}
															onChange={(event, value) => {
																if (value !== null && value !== "Svi") {
																	setFilter({
																		type: 2,
																		id: formData.farmers.find(
																			(item) => item.ime_gospodarstva === value
																		).sif_korisnika,
																	});
																} else {
																	if (filter.type !== 1) {
																		setFilter({
																			type: 0,
																			id: 0,
																		});
																	}
																}
															}}
														/>
													</Box>

													<Typography
														variant="body1"
														color="textSecondary"
														className={classes.expPanelNote}
													>
														Napomena: Moguće je filtrirati samo po jednom
														kriteriju
													</Typography>
												</ExpansionPanelDetails>
											</ExpansionPanel>
										</Box>
									</Box>
								</Hidden>

								<Box className={classes.searchButtonBox}>
									<Hidden smDown>
										<Button
											type="submit"
											variant="contained"
											size="large"
											color="primary"
											className={classes.searchButton}
										>
											Pretraži
											<SearchIcon
												fontSize="small"
												className={classes.searchIcon}
											/>
										</Button>
									</Hidden>

									<Hidden mdUp>
										<Button
											type="submit"
											variant="contained"
											size="large"
											color="primary"
											className={classes.searchButtonSm}
										>
											Pretraži
											<SearchIcon
												fontSize="small"
												className={classes.searchIcon}
											/>
										</Button>
									</Hidden>
								</Box>
							</form>
						</Container>
					</Box>

					<Box className={classes.section}>
						<Container maxWidth="lg">
							{props.auth.user === null ||
							parseInt(props.auth.user.userType) !== 3 ? (
								<Box className={classes.sortBox}>
									<Typography variant="body1">Sortiraj</Typography>

									<IconButton
										size="medium"
										color="inherit"
										onClick={(event) => setAnchorElement(event.currentTarget)}
									>
										<SortIcon fontSize="inherit" />
									</IconButton>

									<Menu
										anchorEl={anchorElement}
										keepMounted
										open={Boolean(anchorElement)}
										onClose={() => setAnchorElement(null)}
									>
										<Link
											to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=1&sortAsc=1`}
											className={classes.menuLink}
										>
											<MenuItem onClick={() => setAnchorElement(null)}>
												Cijena (od najniže)
											</MenuItem>
										</Link>

										<Link
											to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=1&sortAsc=2`}
											className={classes.menuLink}
										>
											<MenuItem onClick={() => setAnchorElement(null)}>
												Cijena (od najviše)
											</MenuItem>
										</Link>

										<Link
											to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=2&sortAsc=1`}
											className={classes.menuLink}
										>
											<MenuItem onClick={() => setAnchorElement(null)}>
												Ocjena (od najniže)
											</MenuItem>
										</Link>

										<Link
											to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=2&sortAsc=2`}
											className={classes.menuLink}
										>
											<MenuItem onClick={() => setAnchorElement(null)}>
												Ocjena (od najviše)
											</MenuItem>
										</Link>

										<Link
											to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=3&sortAsc=1`}
											className={classes.menuLink}
										>
											<MenuItem onClick={() => setAnchorElement(null)}>
												Datum kreiranja (od najstarijeg)
											</MenuItem>
										</Link>

										<Link
											to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=3&sortAsc=2`}
											className={classes.menuLink}
										>
											<MenuItem onClick={() => setAnchorElement(null)}>
												Datum kreiranja (od najnovijeg)
											</MenuItem>
										</Link>
									</Menu>
								</Box>
							) : (
								<Box className={classes.resultsMenuBox}>
									<Hidden xsDown>
										<Box className={classes.farmerButtonsBox}>
											<Link
												to={`/oglas/novi_oglas`}
												className={classes.buttonLink}
											>
												<Button
													variant="contained"
													size="medium"
													color="primary"
													className={`${classes.button} ${classes.farmerButtonMarginRow}`}
												>
													Novi oglas
												</Button>
											</Link>

											<Button
												variant="outlined"
												size="medium"
												color="inherit"
												onClick={() =>
													props.history.push(
														`/oglasi/all?filterType=2&filterId=${parseInt(
															props.auth.user.userId
														)}&sortType=3&sortAsc=2`
													)
												}
											>
												Moji oglasi
											</Button>
										</Box>
									</Hidden>

									<Hidden smUp>
										<Box className={classes.farmerButtonsBoxSm}>
											<Link
												to={`/oglas/novi_oglas`}
												className={classes.buttonLink}
											>
												<Button
													variant="contained"
													size="medium"
													color="primary"
													className={`${classes.button} ${classes.farmerButtonMarginColumn}`}
												>
													Novi oglas
												</Button>
											</Link>

											<Button
												variant="outlined"
												size="medium"
												color="inherit"
												onClick={() =>
													props.history.push(
														`/oglasi/all?filterType=2&filterId=${parseInt(
															props.auth.user.userId
														)}&sortType=3&sortAsc=2`
													)
												}
											>
												Moji oglasi
											</Button>
										</Box>
									</Hidden>

									<Box className={classes.sortSubBox}>
										<Typography variant="body1">Sortiraj</Typography>

										<IconButton
											size="medium"
											color="inherit"
											onClick={(event) => setAnchorElement(event.currentTarget)}
										>
											<SortIcon fontSize="inherit" />
										</IconButton>

										<Menu
											anchorEl={anchorElement}
											keepMounted
											open={Boolean(anchorElement)}
											onClose={() => setAnchorElement(null)}
										>
											<Link
												to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=1&sortAsc=1`}
												className={classes.menuLink}
											>
												<MenuItem onClick={() => setAnchorElement(null)}>
													Cijena (od najniže)
												</MenuItem>
											</Link>

											<Link
												to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=1&sortAsc=2`}
												className={classes.menuLink}
											>
												<MenuItem onClick={() => setAnchorElement(null)}>
													Cijena (od najviše)
												</MenuItem>
											</Link>

											<Link
												to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=2&sortAsc=1`}
												className={classes.menuLink}
											>
												<MenuItem onClick={() => setAnchorElement(null)}>
													Ocjena (od najniže)
												</MenuItem>
											</Link>

											<Link
												to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=2&sortAsc=2`}
												className={classes.menuLink}
											>
												<MenuItem onClick={() => setAnchorElement(null)}>
													Ocjena (od najviše)
												</MenuItem>
											</Link>

											<Link
												to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=3&sortAsc=1`}
												className={classes.menuLink}
											>
												<MenuItem onClick={() => setAnchorElement(null)}>
													Datum kreiranja (od najstarijeg)
												</MenuItem>
											</Link>

											<Link
												to={`/oglasi/${props.match.params.categoryId}/?filterType=${filter.type}&filterId=${filter.id}&sortType=3&sortAsc=2`}
												className={classes.menuLink}
											>
												<MenuItem onClick={() => setAnchorElement(null)}>
													Datum kreiranja (od najnovijeg)
												</MenuItem>
											</Link>
										</Menu>
									</Box>
								</Box>
							)}

							{products.isLoading ? (
								<Backdrop className={classes.backdrop} open={true}>
									<CircularProgress color="inherit" />
								</Backdrop>
							) : products.data !== null && products.data.length !== 0 ? (
								<React.Fragment>
									<Grid
										container
										spacing={4}
										direction="row"
										justify="flex-start"
									>
										{products.data
											.sort((product1, product2) => {
												if (sort.type === 1 && sort.asc === 1) {
													if (product1.cijena < product2.cijena) {
														return -1;
													} else if (product1.cijena > product2.cijena) {
														return 1;
													} else {
														return 0;
													}
												} else if (sort.type === 1 && sort.asc === 2) {
													if (product1.cijena < product2.cijena) {
														return 1;
													} else if (product1.cijena > product2.cijena) {
														return -1;
													} else {
														return 0;
													}
												} else if (sort.type === 2 && sort.asc === 1) {
													if (product1.rating < product2.rating) {
														return -1;
													} else if (product1.rating > product2.rating) {
														return 1;
													} else {
														return 0;
													}
												} else if (sort.type === 2 && sort.asc === 2) {
													if (product1.rating < product2.rating) {
														return 1;
													} else if (product1.rating > product2.rating) {
														return -1;
													} else {
														return 0;
													}
												} else if (sort.type === 3 && sort.asc === 1) {
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
														return -1;
													} else if (date1 > date2) {
														return 1;
													} else {
														return 0;
													}
												} else {
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
												}
											})
											.slice((pageNum - 1) * 8, (pageNum - 1) * 8 + 8)
											.map((product) => (
												<Grid
													item
													xs={12}
													sm={6}
													md={4}
													lg={3}
													key={product.sif_oglasa}
												>
													{props.match.params.categoryId === "all" ? (
														<ProductCardMoreInfo
															product={product}
															deleteProduct={deleteProduct}
														/>
													) : (
														<ProductCard
															product={product}
															deleteProduct={deleteProduct}
														/>
													)}
												</Grid>
											))}
									</Grid>

									{products.data.length <= 8 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil(products.data.length / 8)}
												defaultPage={1}
												page={pageNum}
												onChange={(event, page) => setPageNum(page)}
											/>
										</Box>
									)}
								</React.Fragment>
							) : (
								<Typography variant="body1">Nema oglasa</Typography>
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

export default connect(mapStateToProps, { tokenConfig })(ProductsPage);
