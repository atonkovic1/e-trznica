import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import store from "../../../../store";
import { connect } from "react-redux";
import { tokenConfig } from "../../../../actions/authActions";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
	Typography,
	Toolbar,
	Backdrop,
	CircularProgress,
	Box,
	Container,
	Paper,
	Grid,
	IconButton,
	Hidden,
	TextField,
	Tooltip,
	Snackbar,
} from "@material-ui/core";
import { Autocomplete, Alert, Pagination } from "@material-ui/lab";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import adminCategoriesImage from "../../../../assets/images/adminCategoriesImage.jpg";
import NavBar from "../../../shared/NavBar";
import Footer from "../../../shared/Footer";
import AdminPageCategory from "./AdminPageCategory";

const useStyles = makeStyles((theme) => ({
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
		backgroundImage: `url(${adminCategoriesImage})`,
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

	list: {
		display: "flex",
		flexDirection: "column",
		marginBottom: theme.spacing(10),
	},

	listTitle: {
		padding: theme.spacing(2),
	},

	listItem: {
		marginBottom: theme.spacing(1),
		padding: theme.spacing(2),
	},

	gridItem: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},

	icon: {
		color: theme.palette.primary.main,
	},

	textXs: {
		width: "50%",
	},

	pagination: {
		marginTop: theme.spacing(5),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
}));

function AdminPageCategories(props) {
	const classes = useStyles();

	const [categories, setCategories] = useState([]);
	const [newCategory, setNewCategory] = useState({
		name: "",
		masterCategoryName: "",
	});
	const [addMenuIsOpen, setAddMenuIsOpen] = useState(false);
	const [comparator, setComparator] = useState(1);

	const [pageNum, setPageNum] = useState(1);

	const [error, setError] = useState({
		message: "",
		isOpen: false,
	});

	// Dohvaćanje svih vrsti proizvoda
	useEffect(() => {
		getCategories();
	}, []);

	useEffect(() => {
		if (
			categories !== undefined &&
			categories !== null &&
			categories.length !== 0 &&
			pageNum > Math.ceil((categories.length - 1) / 7)
		) {
			const newPageNum = Math.ceil((categories.length - 1) / 7);
			setPageNum(newPageNum);
		}
	}, [categories]);

	const getCategories = () => {
		axios
			.get("/api/admin_page_categories/categories", tokenConfig(store.getState))
			.then((res) => {
				let data = res.data;
				data.forEach((item) => {
					if (item.naziv_nadvrste_proizvoda === null) {
						item.naziv_nadvrste_proizvoda = "-";
					}
				});
				data.push({
					sif_vrste_proizvoda: "NULL",
					naziv_vrste_proizvoda: "-",
					sif_nadvrste_proizvoda: "NULL",
					naziv_nadvrste_proizvoda: "-",
				});
				setCategories(data);
			});
	};

	const addCategory = (event) => {
		event.preventDefault();

		const masterCategoryId = categories.find(
			(item) => item.naziv_vrste_proizvoda === newCategory.masterCategoryName
		).sif_vrste_proizvoda;

		axios
			.post(
				"/api/admin_page_categories/category",
				{
					categoryName: newCategory.name,
					masterCategoryId: masterCategoryId,
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
					setNewCategory({
						name: "",
						masterCategoryName: "",
					});
					setAddMenuIsOpen(false);

					getCategories();
				}
			});
	};

	const editCategory = (event, masterCategoryName, name, categoryId) => {
		event.preventDefault();

		const masterCategoryId = categories.find(
			(item) => item.naziv_vrste_proizvoda === masterCategoryName
		).sif_vrste_proizvoda;

		axios
			.put(
				"/api/admin_page_categories/category",
				{
					categoryId: categoryId,
					newCategoryName: name,
					newMasterCategoryId: masterCategoryId,
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
					getCategories();
				}
			});
	};

	const deleteCategory = (categoryId) => {
		axios
			.delete(
				`/api/admin_page_categories/category/${categoryId}`,
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
					getCategories();
				}
			});
	};

	if (
		props.auth.user === null ||
		(props.auth.user !== null && props.auth.user.userType !== 1)
	) {
		return <Redirect to="/" />;
	} else if (categories === null) {
		return (
			<div className="AdminPageCategories">
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
			<div className="AdminPageCategories">
				<NavBar />

				<Toolbar />

				<Backdrop className={classes.backdrop} open={categories.length === 0}>
					<CircularProgress color="inherit" />
				</Backdrop>

				<Box className={classes.pageWrapper}>
					<Box className={classes.image}>
						<Box className={classes.imageOverlay}>
							<Container maxWidth="lg">
								<Typography
									variant="h3"
									align="center"
									className={classes.title}
								>
									Vrste proizvoda
								</Typography>
							</Container>
						</Box>
					</Box>

					<Container maxWidth="lg">
						<Box className={classes.list}>
							{/* Naslovni redak liste */}
							<Box className={classes.listTitle}>
								<Grid
									container
									spacing={1}
									direction="row"
									justify="center"
									alignItems="center"
									align="center"
								>
									<Hidden xsDown>
										<Grid item sm={3}>
											<Box className={classes.gridItem}>
												<Typography variant="body1">
													<strong>Šifra</strong>
												</Typography>

												<Tooltip title="Sortiraj po šifri">
													<IconButton
														size="small"
														color="inherit"
														onClick={() =>
															comparator === 1
																? setComparator(-1)
																: setComparator(1)
														}
													>
														<UnfoldMoreIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											</Box>
										</Grid>

										<Grid item sm={3}>
											<Box className={classes.gridItem}>
												<Typography variant="body1">
													<strong>Naziv</strong>
												</Typography>

												<Tooltip title="Sortiraj po nazivu">
													<IconButton
														size="small"
														color="inherit"
														onClick={() =>
															comparator === 2
																? setComparator(-2)
																: setComparator(2)
														}
													>
														<UnfoldMoreIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											</Box>
										</Grid>

										<Grid item sm={3}>
											<Box className={classes.gridItem}>
												<Typography variant="body1">
													<strong>Naziv nadvrste</strong>
												</Typography>

												<Tooltip title="Sortiraj po nazivu nadvrste">
													<IconButton
														size="small"
														color="inherit"
														onClick={() =>
															comparator === 3
																? setComparator(-3)
																: setComparator(3)
														}
													>
														<UnfoldMoreIcon fontSize="small" />
													</IconButton>
												</Tooltip>
											</Box>
										</Grid>
									</Hidden>

									<Grid item xs={12} sm={3}>
										<Box className={classes.gridItem}>
											<Hidden smUp>
												<Typography variant="body1">
													<strong>Dodaj novu vrstu</strong>
												</Typography>
											</Hidden>

											<Tooltip title="Dodaj novu vrstu proizvoda">
												<IconButton
													size="medium"
													onClick={() => setAddMenuIsOpen(true)}
												>
													<AddCircleIcon
														fontSize="large"
														className={classes.icon}
													/>
												</IconButton>
											</Tooltip>
										</Box>
									</Grid>
								</Grid>
							</Box>

							{/* Redak za dodavanje nove vrste proizvoda */}
							{addMenuIsOpen ? (
								<Paper elevation={3} className={classes.listItem}>
									<form onSubmit={(event) => addCategory(event)}>
										<Grid
											container
											spacing={1}
											direction="row"
											justify="center"
											alignItems="center"
											align="center"
										>
											<Grid item xs={12} sm={3}>
												<Box className={classes.gridItem}>
													<Hidden smUp>
														<Typography
															variant="body1"
															align="center"
															className={classes.textXs}
														>
															<strong>Šifra</strong>
														</Typography>
													</Hidden>

													<Hidden smUp>
														<Typography
															variant="body1"
															align="center"
															className={classes.textXs}
														>
															-
														</Typography>
													</Hidden>

													<Hidden xsDown>
														<Typography variant="body1" align="center">
															-
														</Typography>
													</Hidden>
												</Box>
											</Grid>

											<Grid item xs={12} sm={3}>
												<Box className={classes.gridItem}>
													<Hidden smUp>
														<Typography
															variant="body1"
															align="center"
															className={classes.textXs}
														>
															<strong>Naziv</strong>
														</Typography>
													</Hidden>

													<Hidden smUp>
														<TextField
															variant="filled"
															size="small"
															fullWidth
															id="newCategoryName"
															label="Naziv"
															required
															value={newCategory.name}
															onChange={(event) => {
																setNewCategory({
																	...newCategory,
																	name: event.target.value,
																});
															}}
															className={classes.textXs}
														/>
													</Hidden>

													<Hidden xsDown>
														<TextField
															variant="filled"
															size="small"
															fullWidth
															id="newCategoryName"
															label="Naziv"
															required
															value={newCategory.name}
															onChange={(event) => {
																setNewCategory({
																	...newCategory,
																	name: event.target.value,
																});
															}}
														/>
													</Hidden>
												</Box>
											</Grid>

											<Grid item xs={12} sm={3}>
												<Box className={classes.gridItem}>
													<Hidden smUp>
														<Typography
															variant="body1"
															align="center"
															className={classes.textXs}
														>
															<strong>Naziv nadvrste</strong>
														</Typography>
													</Hidden>

													<Hidden smUp>
														<Autocomplete
															id="newMasterCategory"
															fullWidth
															className={classes.textXs}
															autoSelect
															renderInput={(params) => (
																<TextField
																	{...params}
																	variant="filled"
																	size="small"
																	label="Naziv nadvrste"
																	required
																/>
															)}
															options={categories
																.map(
																	(category) => category.naziv_vrste_proizvoda
																)
																.sort()}
															getOptionLabel={(option) => option}
															value={newCategory.masterCategoryName}
															onChange={(event, value) => {
																setNewCategory({
																	...newCategory,
																	masterCategoryName: value,
																});
															}}
														/>
													</Hidden>

													<Hidden xsDown>
														<Autocomplete
															id="newMasterCategory"
															fullWidth
															autoSelect
															renderInput={(params) => (
																<TextField
																	{...params}
																	variant="filled"
																	size="small"
																	label="Naziv nadvrste"
																	required
																/>
															)}
															options={categories
																.map(
																	(category) => category.naziv_vrste_proizvoda
																)
																.sort()}
															getOptionLabel={(option) => option}
															value={newCategory.masterCategoryName}
															onChange={(event, value) => {
																setNewCategory({
																	...newCategory,
																	masterCategoryName: value,
																});
															}}
														/>
													</Hidden>
												</Box>
											</Grid>

											<Grid item xs={12} sm={3}>
												<Box className={classes.gridItem}>
													<Tooltip title="Spremi">
														<IconButton
															type="submit"
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
																setNewCategory({
																	name: "",
																	masterCategoryName: "",
																});
																setAddMenuIsOpen(false);
															}}
														>
															<HighlightOffIcon
																fontSize="inherit"
																color="secondary"
															/>
														</IconButton>
													</Tooltip>
												</Box>
											</Grid>
										</Grid>
									</form>
								</Paper>
							) : (
								<React.Fragment />
							)}

							{categories !== null && categories.length !== 0 ? (
								<React.Fragment>
									{categories
										.sort((category1, category2) => {
											if (comparator === 1) {
												if (
													category1.sif_vrste_proizvoda <
													category2.sif_vrste_proizvoda
												) {
													return -1;
												} else if (
													category1.sif_vrste_proizvoda >
													category2.sif_vrste_proizvoda
												) {
													return 1;
												} else {
													return 0;
												}
											} else if (comparator === -1) {
												if (
													category1.sif_vrste_proizvoda <
													category2.sif_vrste_proizvoda
												) {
													return 1;
												} else if (
													category1.sif_vrste_proizvoda >
													category2.sif_vrste_proizvoda
												) {
													return -1;
												} else {
													return 0;
												}
											} else if (comparator === 2) {
												if (
													category1.naziv_vrste_proizvoda <
													category2.naziv_vrste_proizvoda
												) {
													return -1;
												} else if (
													category1.naziv_vrste_proizvoda >
													category2.naziv_vrste_proizvoda
												) {
													return 1;
												} else {
													return 0;
												}
											} else if (comparator === -2) {
												if (
													category1.naziv_vrste_proizvoda <
													category2.naziv_vrste_proizvoda
												) {
													return 1;
												} else if (
													category1.naziv_vrste_proizvoda >
													category2.naziv_vrste_proizvoda
												) {
													return -1;
												} else {
													return 0;
												}
											} else if (comparator === 3) {
												if (
													category1.naziv_nadvrste_proizvoda <
													category2.naziv_nadvrste_proizvoda
												) {
													return -1;
												} else if (
													category1.naziv_nadvrste_proizvoda >
													category2.naziv_nadvrste_proizvoda
												) {
													return 1;
												} else {
													return 0;
												}
											} else {
												if (
													category1.naziv_nadvrste_proizvoda <
													category2.naziv_nadvrste_proizvoda
												) {
													return 1;
												} else if (
													category1.naziv_nadvrste_proizvoda >
													category2.naziv_nadvrste_proizvoda
												) {
													return -1;
												} else {
													return 0;
												}
											}
										})
										.slice((pageNum - 1) * 7, (pageNum - 1) * 7 + 7)
										.map((category) => {
											if (category.naziv_vrste_proizvoda !== "-") {
												return (
													<AdminPageCategory
														key={category.sif_vrste_proizvoda}
														categories={categories}
														category={category}
														editCategory={editCategory}
														deleteCategory={deleteCategory}
													/>
												);
											} else {
												return (
													<React.Fragment key={category.sif_vrste_proizvoda} />
												);
											}
										})}

									{categories.length <= 7 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil((categories.length - 1) / 7)}
												defaultPage={1}
												page={pageNum}
												onChange={(event, page) => setPageNum(page)}
											/>
										</Box>
									)}
								</React.Fragment>
							) : (
								<Backdrop className={classes.backdrop} open={true}>
									<CircularProgress color="inherit" />
								</Backdrop>
							)}
						</Box>
					</Container>
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

export default connect(mapStateToProps, { tokenConfig })(AdminPageCategories);
