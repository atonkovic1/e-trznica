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
import adminPostOfficesImage from "../../../../assets/images/adminPostOfficesImage.jpg";
import NavBar from "../../../shared/NavBar";
import Footer from "../../../shared/Footer";
import AdminPagePostOffice from "./AdminPagePostOffice";

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
		backgroundImage: `url(${adminPostOfficesImage})`,
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

function AdminPagePostOffices(props) {
	const classes = useStyles();

	const [counties, setCounties] = useState([]);

	const [postOffices, setPostOffices] = useState([]);
	const [newPostOffice, setNewPostOffice] = useState({
		postalCode: "",
		postOfficeName: "",
		countyId: "",
	});
	const [addMenuIsOpen, setAddMenuIsOpen] = useState(false);
	const [comparator, setComparator] = useState(1);

	const [pageNum, setPageNum] = useState(1);

	const [error, setError] = useState({
		message: "",
		isOpen: false,
	});

	// Dohvaćanje svih poštanskih ureda i županija
	useEffect(() => {
		getPostOffices();

		getCounties();
	}, []);

	useEffect(() => {
		if (
			postOffices !== undefined &&
			postOffices !== null &&
			postOffices.length !== 0 &&
			pageNum > Math.ceil(postOffices.length / 7)
		) {
			const newPageNum = Math.ceil(postOffices.length / 7);
			setPageNum(newPageNum);
		}
	}, [postOffices]);

	const getPostOffices = async () => {
		axios
			.get(
				"/api/admin_page_post_offices/post_offices",
				tokenConfig(store.getState)
			)
			.then((res) => {
				setPostOffices(res.data);
			});
	};

	const getCounties = async () => {
		axios.get("/api/farmers_page/counties").then((res) => {
			setCounties(res.data);
		});
	};

	const addPostOffice = (event) => {
		event.preventDefault();

		axios
			.post(
				"/api/admin_page_post_offices/post_office",
				{
					postalCode: parseInt(newPostOffice.postalCode),
					postOfficeName: newPostOffice.postOfficeName.toUpperCase(),
					countyId: parseInt(newPostOffice.countyId),
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
					setNewPostOffice({
						postalCode: "",
						postOfficeName: "",
						countyId: "",
					});
					setAddMenuIsOpen(false);

					getPostOffices();
				}
			});
	};

	const editPostOffice = (
		event,
		oldPostalCode,
		newPostalCode,
		newPostOfficeName,
		newCountyId
	) => {
		event.preventDefault();

		axios
			.put(
				"/api/admin_page_post_offices/post_office",
				{
					oldPostalCode: parseInt(oldPostalCode),
					newPostalCode: parseInt(newPostalCode),
					newPostOfficeName: newPostOfficeName.toUpperCase(),
					newCountyId: parseInt(newCountyId),
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
					getPostOffices();
				}
			});
	};

	const deletePostOffice = (postalCode) => {
		axios
			.delete(
				`/api/admin_page_post_offices/post_office/${parseInt(postalCode)}`,
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
					getPostOffices();
				}
			});
	};

	if (
		props.auth.user === null ||
		(props.auth.user !== null && props.auth.user.userType !== 1)
	) {
		return <Redirect to="/" />;
	} else {
		return (
			<div className="AdminPagePostOffices">
				<NavBar />

				<Toolbar />

				<Backdrop className={classes.backdrop} open={postOffices.length === 0}>
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
									Poštanski uredi
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
													<strong>Poštanski broj</strong>
												</Typography>

												<Tooltip title="Sortiraj po poštanskom broju">
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
													<strong>Naziv poštanskog ureda</strong>
												</Typography>

												<Tooltip title="Sortiraj po nazivu poštanskog ureda">
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
													<strong>Županija</strong>
												</Typography>

												<Tooltip title="Sortiraj po županiji">
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
													<strong>Dodaj novi poštanski ured</strong>
												</Typography>
											</Hidden>

											<Tooltip title="Dodaj novi poštanski ured">
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

							{/* Redak za dodavanje novog poštanskog ureda */}
							{addMenuIsOpen ? (
								<Paper elevation={3} className={classes.listItem}>
									<form onSubmit={(event) => addPostOffice(event)}>
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
															<strong>Poštanski broj</strong>
														</Typography>
													</Hidden>

													<Hidden smUp>
														<TextField
															type="number"
															variant="filled"
															size="small"
															fullWidth
															id="newPostalCode"
															label="Poštanski broj"
															required
															value={newPostOffice.postalCode}
															onChange={(event) => {
																setNewPostOffice({
																	...newPostOffice,
																	postalCode: event.target.value,
																});
															}}
															className={classes.textXs}
														/>
													</Hidden>

													<Hidden xsDown>
														<TextField
															type="number"
															variant="filled"
															size="small"
															fullWidth
															id="newPostalCode"
															label="Poštanski broj"
															required
															value={newPostOffice.postalCode}
															onChange={(event) => {
																setNewPostOffice({
																	...newPostOffice,
																	postalCode: event.target.value,
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
															<strong>Naziv poštanskog ureda</strong>
														</Typography>
													</Hidden>

													<Hidden smUp>
														<TextField
															variant="filled"
															size="small"
															fullWidth
															id="newPostOfficeName"
															label="Naziv pošt. ureda"
															required
															value={newPostOffice.postOfficeName}
															onChange={(event) => {
																setNewPostOffice({
																	...newPostOffice,
																	postOfficeName: event.target.value,
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
															id="newPostOfficeName"
															label="Naziv poštanskog ureda"
															required
															value={newPostOffice.postOfficeName}
															onChange={(event) => {
																setNewPostOffice({
																	...newPostOffice,
																	postOfficeName: event.target.value,
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
															<strong>Županija</strong>
														</Typography>
													</Hidden>

													<Hidden smUp>
														<Autocomplete
															id="newCountyId"
															size="small"
															fullWidth
															renderInput={(params) => (
																<TextField
																	{...params}
																	variant="filled"
																	label="Županija"
																	required
																/>
															)}
															options={counties
																.map((item) => item.naziv_zupanije)
																.sort(new Intl.Collator("hr").compare)}
															getOptionLabel={(option) => option}
															value={
																newPostOffice.countyId === ""
																	? ""
																	: counties.find(
																			(item) =>
																				item.sif_zupanije ===
																				parseInt(newPostOffice.countyId)
																	  ).naziv_zupanije
															}
															onChange={(event, value) => {
																setNewPostOffice({
																	...newPostOffice,
																	countyId: counties.find(
																		(item) => item.naziv_zupanije === value
																	).sif_zupanije,
																});
															}}
															className={classes.textXs}
														/>
													</Hidden>

													<Hidden xsDown>
														<Autocomplete
															id="newCountyId"
															size="small"
															fullWidth
															renderInput={(params) => (
																<TextField
																	{...params}
																	variant="filled"
																	label="Županija"
																	required
																/>
															)}
															options={counties
																.map((item) => item.naziv_zupanije)
																.sort(new Intl.Collator("hr").compare)}
															getOptionLabel={(option) => option}
															value={
																newPostOffice.countyId === ""
																	? ""
																	: counties.find(
																			(item) =>
																				item.sif_zupanije ===
																				parseInt(newPostOffice.countyId)
																	  ).naziv_zupanije
															}
															onChange={(event, value) => {
																setNewPostOffice({
																	...newPostOffice,
																	countyId: counties.find(
																		(item) => item.naziv_zupanije === value
																	).sif_zupanije,
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
																setNewPostOffice({
																	postalCode: "",
																	postOfficeName: "",
																	countyId: "",
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

							{postOffices !== null && postOffices.length !== 0 ? (
								<React.Fragment>
									{postOffices
										.sort((postOffice1, postOffice2) => {
											if (comparator === 1) {
												if (postOffice1.post_broj < postOffice2.post_broj) {
													return -1;
												} else if (
													postOffice1.post_broj > postOffice2.post_broj
												) {
													return 1;
												} else {
													return 0;
												}
											} else if (comparator === -1) {
												if (postOffice1.post_broj < postOffice2.post_broj) {
													return 1;
												} else if (
													postOffice1.post_broj > postOffice2.post_broj
												) {
													return -1;
												} else {
													return 0;
												}
											} else if (comparator === 2) {
												return new Intl.Collator("hr").compare(
													postOffice1.naziv_post_ureda,
													postOffice2.naziv_post_ureda
												);
											} else if (comparator === -2) {
												return (
													new Intl.Collator("hr").compare(
														postOffice1.naziv_post_ureda,
														postOffice2.naziv_post_ureda
													) * -1
												);
											} else if (comparator === 3) {
												return new Intl.Collator("hr").compare(
													postOffice1.naziv_zupanije,
													postOffice2.naziv_zupanije
												);
											} else {
												return (
													new Intl.Collator("hr").compare(
														postOffice1.naziv_zupanije,
														postOffice2.naziv_zupanije
													) * -1
												);
											}
										})
										.slice((pageNum - 1) * 7, (pageNum - 1) * 7 + 7)
										.map((postOffice) => (
											<AdminPagePostOffice
												key={postOffice.post_broj}
												postOffice={postOffice}
												counties={counties}
												editPostOffice={editPostOffice}
												deletePostOffice={deletePostOffice}
											/>
										))}

									{postOffices.length <= 7 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil(postOffices.length / 7)}
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

export default connect(mapStateToProps, { tokenConfig })(AdminPagePostOffices);
