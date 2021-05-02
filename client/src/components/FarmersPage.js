import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
	Box,
	Paper,
	Container,
	Typography,
	Toolbar,
	Backdrop,
	CircularProgress,
	TextField,
	Button,
	IconButton,
	Hidden,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Menu,
	MenuItem,
} from "@material-ui/core";
import { Autocomplete, Rating, Pagination } from "@material-ui/lab";
import FilterListIcon from "@material-ui/icons/FilterList";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";
import SortIcon from "@material-ui/icons/Sort";
import farmersImage from "../assets/images/farmersImage.jpg";
import NavBar from "./shared/NavBar";
import Footer from "./shared/Footer";

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: "none",
		color: theme.palette.text.primary,
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
		backgroundImage: `url(${farmersImage})`,
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
		alignItems: "center",
		justifyContent: "center",
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

	pagination: {
		marginTop: theme.spacing(5),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},

	paperBox: {
		padding: theme.spacing(2),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},

	farmerNameMargin: {
		marginRight: theme.spacing(2),
	},
}));

function FarmersPage(props) {
	const classes = useStyles();

	const [formData, setFormData] = useState(null);

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

	const [farmers, setFarmers] = useState({
		isLoading: false,
		data: null,
	});

	useEffect(() => {
		const url = new URL(window.location.href);
		const searchParams = url.searchParams;

		const filterType = parseInt(searchParams.get("filterType"));
		const filterId = parseInt(searchParams.get("filterId"));

		const sortType = parseInt(searchParams.get("sortType"));
		const sortAsc = parseInt(searchParams.get("sortAsc"));

		setFilter({
			type: filterType,
			id: filterId,
		});

		setSort({
			type: sortType,
			asc: sortAsc,
		});

		getFarmersData(filterType, filterId);

		getFormData();
	}, [props.match.params]);

	useEffect(() => {
		setPageNum(1);
	}, [farmers.data]);

	// Dohvaćanje svih vrsta proizvoda i mjernih jedinica
	const getFormData = async () => {
		axios.get("/api/farmers_page/counties").then((res) => {
			setFormData({
				counties: res.data,
			});
		});
	};

	const getFarmerInfo = async (farmer) => {
		let newFarmer = farmer;

		return axios
			.get(`/api/farmers_page/ratings/${farmer.sif_poljoprivrednika}`)
			.then((res) => {
				let totalRating = 0;
				res.data.forEach((rating) => (totalRating += rating.ocjena));
				totalRating = totalRating / res.data.length;

				newFarmer.rating = isNaN(totalRating) ? 0 : totalRating;

				return newFarmer;
			});
	};

	// Dohvaćanje podataka o oglasima
	const getFarmersData = async (filterType, filterId) => {
		setFarmers({
			...farmers,
			isLoading: true,
		});

		const farmersData = await axios
			.get(`/api/farmers_page/farmers/${filterType}/${filterId}`)
			.then((res) => {
				return res.data;
			});

		let promises = [];
		for (const farmer of farmersData) {
			promises.push(getFarmerInfo(farmer));
		}

		Promise.all(promises).then((results) => {
			setFarmers({
				isLoading: false,
				data: results,
			});
		});
	};

	// Pretraživanje
	const search = (event) => {
		event.preventDefault();

		props.history.push(
			`/poljoprivrednici?filterType=${filter.type}&filterId=${filter.id}&sortType=1&sortAsc=1`
		);
	};

	if (farmers.data === null || formData === null) {
		return (
			<div className="FarmersPage">
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
			<div className="FarmersPage">
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
									Poljoprivrednici
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
														Filtriraj poljoprivrednike
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
																	setFilter({
																		type: 0,
																		id: 0,
																	});
																}
															}}
															className={classes.item}
														/>
													</Box>
												</ExpansionPanelDetails>
											</ExpansionPanel>
										</Box>
									</Box>
								</Hidden>

								<Hidden mdUp>
									<Box className={classes.flexColumn}>
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
														Filtriraj poljoprivrednike
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
																	setFilter({
																		type: 0,
																		id: 0,
																	});
																}
															}}
															className={classes.item}
														/>
													</Box>
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
						<Container maxWidth="md">
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
										to={`/poljoprivrednici?filterType=${filter.type}&filterId=${filter.id}&sortType=1&sortAsc=1`}
										className={classes.menuLink}
									>
										<MenuItem onClick={() => setAnchorElement(null)}>
											Ime gospodarstva (uzlazno)
										</MenuItem>
									</Link>

									<Link
										to={`/poljoprivrednici?filterType=${filter.type}&filterId=${filter.id}&sortType=1&sortAsc=2`}
										className={classes.menuLink}
									>
										<MenuItem onClick={() => setAnchorElement(null)}>
											Ime gospodarstva (silazno)
										</MenuItem>
									</Link>

									<Link
										to={`/poljoprivrednici?filterType=${filter.type}&filterId=${filter.id}&sortType=2&sortAsc=1`}
										className={classes.menuLink}
									>
										<MenuItem onClick={() => setAnchorElement(null)}>
											Ocjena (od najniže)
										</MenuItem>
									</Link>

									<Link
										to={`/poljoprivrednici?filterType=${filter.type}&filterId=${filter.id}&sortType=2&sortAsc=2`}
										className={classes.menuLink}
									>
										<MenuItem onClick={() => setAnchorElement(null)}>
											Ocjena (od najviše)
										</MenuItem>
									</Link>
								</Menu>
							</Box>

							{farmers.isLoading ? (
								<Backdrop className={classes.backdrop} open={true}>
									<CircularProgress color="inherit" />
								</Backdrop>
							) : farmers.data !== null && farmers.data.length !== 0 ? (
								<React.Fragment>
									<Box>
										{farmers.data
											.sort((farmer1, farmer2) => {
												if (
													(sort.type === 0 && sort.asc === 0) ||
													(sort.type === 1 && sort.asc === 1)
												) {
													return new Intl.Collator("hr").compare(
														farmer1.ime_gospodarstva,
														farmer2.ime_gospodarstva
													);
												} else if (sort.type === 1 && sort.asc === 2) {
													return (
														new Intl.Collator("hr").compare(
															farmer1.ime_gospodarstva,
															farmer2.ime_gospodarstva
														) * -1
													);
												} else if (sort.type === 2 && sort.asc === 1) {
													if (farmer1.rating < farmer2.rating) {
														return -1;
													} else if (farmer1.rating > farmer2.rating) {
														return 1;
													} else {
														return 0;
													}
												} else {
													if (farmer1.rating < farmer2.rating) {
														return 1;
													} else if (farmer1.rating > farmer2.rating) {
														return -1;
													} else {
														return 0;
													}
												}
											})
											.slice((pageNum - 1) * 10, (pageNum - 1) * 10 + 10)
											.map((farmer) => (
												<Link
													key={farmer.sif_korisnika}
													to={`/profil_poljoprivrednik/${farmer.sif_korisnika}`}
													className={classes.link}
												>
													<Paper elevation={3} className={classes.paperBox}>
														<Typography
															variant="h5"
															className={classes.farmerNameMargin}
														>
															{farmer.ime_gospodarstva}
														</Typography>

														<Rating
															value={farmer.rating}
															precision={0.5}
															readOnly
														/>
													</Paper>
												</Link>
											))}
									</Box>

									{farmers.data.length <= 10 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil(farmers.data.length / 10)}
												defaultPage={1}
												page={pageNum}
												onChange={(event, page) => setPageNum(page)}
											/>
										</Box>
									)}
								</React.Fragment>
							) : (
								<Typography variant="body1">Nema poljoprivrednika</Typography>
							)}
						</Container>
					</Box>
				</Box>

				<Footer />
			</div>
		);
	}
}

export default FarmersPage;
