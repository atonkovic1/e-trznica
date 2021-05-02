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
import { Alert, Pagination } from "@material-ui/lab";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import UnfoldMoreIcon from "@material-ui/icons/UnfoldMore";
import adminUnitsImage from "../../../../assets/images/adminUnitsImage.jpg";
import NavBar from "../../../shared/NavBar";
import Footer from "../../../shared/Footer";
import AdminPageUnit from "./AdminPageUnit";

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
		backgroundImage: `url(${adminUnitsImage})`,
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

function AdminPageUnits(props) {
	const classes = useStyles();

	const [units, setUnits] = useState([]);
	const [newUnit, setNewUnit] = useState({
		name: "",
	});
	const [addMenuIsOpen, setAddMenuIsOpen] = useState(false);
	const [comparator, setComparator] = useState(1);

	const [pageNum, setPageNum] = useState(1);

	const [error, setError] = useState({
		message: "",
		isOpen: false,
	});

	// Dohvaćanje svih mjernih jedinica
	useEffect(() => {
		getUnits();
	}, []);

	useEffect(() => {
		if (
			units !== undefined &&
			units !== null &&
			units.length !== 0 &&
			pageNum > Math.ceil(units.length / 7)
		) {
			const newPageNum = Math.ceil(units.length / 7);
			setPageNum(newPageNum);
		}
	}, [units]);

	const getUnits = () => {
		axios
			.get("/api/admin_page_units/units", tokenConfig(store.getState))
			.then((res) => {
				setUnits(res.data);
			});
	};

	const addUnit = (event) => {
		event.preventDefault();

		axios
			.post(
				"/api/admin_page_units/unit",
				{
					unitName: newUnit.name,
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
					setNewUnit({
						name: "",
					});
					setAddMenuIsOpen(false);

					getUnits();
				}
			});
	};

	const editUnit = (event, unitId, name) => {
		event.preventDefault();

		axios
			.put(
				"/api/admin_page_units/unit",
				{
					unitId: unitId,
					newUnitName: name,
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
					getUnits();
				}
			});
	};

	const deleteUnit = (unitId) => {
		axios
			.delete(
				`/api/admin_page_units/unit/${unitId}`,
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
					getUnits();
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
			<div className="AdminPageUnits">
				<NavBar />

				<Toolbar />

				<Backdrop className={classes.backdrop} open={units.length === 0}>
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
									Mjerne jedinice
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
													<strong>Oznaka</strong>
												</Typography>

												<Tooltip title="Sortiraj po oznaci">
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
									</Hidden>

									<Grid item xs={12} sm={3}>
										<Box className={classes.gridItem}>
											<Hidden smUp>
												<Typography variant="body1">
													<strong>Dodaj novu mjernu jedinicu</strong>
												</Typography>
											</Hidden>

											<Tooltip title="Dodaj novu mjernu jedinicu">
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

							{/* Redak za dodavanje nove mjerne jedinice */}
							{addMenuIsOpen ? (
								<Paper elevation={3} className={classes.listItem}>
									<form onSubmit={(event) => addUnit(event)}>
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
															<strong>Oznaka</strong>
														</Typography>
													</Hidden>

													<Hidden smUp>
														<TextField
															variant="filled"
															size="small"
															fullWidth
															id="newUnitName"
															label="Oznaka"
															required
															value={newUnit.name}
															onChange={(event) => {
																setNewUnit({
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
															id="newUnitName"
															label="Oznaka"
															required
															value={newUnit.name}
															onChange={(event) => {
																setNewUnit({
																	name: event.target.value,
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
																setNewUnit({
																	name: "",
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

							{units !== null && units.length !== 0 ? (
								<React.Fragment>
									{units
										.sort((unit1, unit2) => {
											if (comparator === 1) {
												if (
													unit1.sif_mjerne_jedinice < unit2.sif_mjerne_jedinice
												) {
													return -1;
												} else if (
													unit1.sif_mjerne_jedinice > unit2.sif_mjerne_jedinice
												) {
													return 1;
												} else {
													return 0;
												}
											} else if (comparator === -1) {
												if (
													unit1.sif_mjerne_jedinice < unit2.sif_mjerne_jedinice
												) {
													return 1;
												} else if (
													unit1.sif_mjerne_jedinice > unit2.sif_mjerne_jedinice
												) {
													return -1;
												} else {
													return 0;
												}
											} else if (comparator === 2) {
												if (
													unit1.oznaka_mjerne_jedinice <
													unit2.oznaka_mjerne_jedinice
												) {
													return -1;
												} else if (
													unit1.oznaka_mjerne_jedinice >
													unit2.oznaka_mjerne_jedinice
												) {
													return 1;
												} else {
													return 0;
												}
											} else {
												if (
													unit1.oznaka_mjerne_jedinice <
													unit2.oznaka_mjerne_jedinice
												) {
													return 1;
												} else if (
													unit1.oznaka_mjerne_jedinice >
													unit2.oznaka_mjerne_jedinice
												) {
													return -1;
												} else {
													return 0;
												}
											}
										})
										.slice((pageNum - 1) * 7, (pageNum - 1) * 7 + 7)
										.map((unit) => (
											<AdminPageUnit
												key={unit.sif_mjerne_jedinice}
												unit={unit}
												editUnit={editUnit}
												deleteUnit={deleteUnit}
											/>
										))}

									{units.length <= 7 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil(units.length / 7)}
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

export default connect(mapStateToProps, { tokenConfig })(AdminPageUnits);
