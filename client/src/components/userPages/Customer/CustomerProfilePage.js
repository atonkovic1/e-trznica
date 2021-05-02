import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import store from "../../../store";
import { connect } from "react-redux";
import { tokenConfig } from "../../../actions/authActions";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
	Toolbar,
	Backdrop,
	CircularProgress,
	Container,
	Box,
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
import LaunchIcon from "@material-ui/icons/Launch";
import NavBar from "../../shared/NavBar";
import Footer from "../../shared/Footer";
import OrderCardCustomer from "./OrderCardCustomer";

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: "none",
		color: theme.palette.text.primary,
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "start",
	},

	launchIcon: {
		marginLeft: theme.spacing(1),
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

	customerInfo: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "start",
		justifyContent: "start",
	},

	customerInfoSm: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "start",
	},

	customerAddress: {
		display: "flex",
		flexDirection: "column",
	},

	rating: {
		marginBottom: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
		alignItems: "start",
		justifyContent: "center",
	},

	ratingNameBtnBox: {
		marginTop: theme.spacing(2),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
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

function CustomerProfilePage(props) {
	const classes = useStyles();

	const [postOffices, setPostOffices] = useState([]);

	const [customerData, setCustomerData] = useState(null);

	const [newCustomerInfo, setNewCustomerInfo] = useState(null);
	const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);

	const [orderHistoryIsOpen, setOrderHistoryIsOpen] = useState(false);

	const [pageNumOrders, setPageNumOrders] = useState(1);
	const [pageNumFarmerRatings, setPageNumFarmerRatings] = useState(1);
	const [pageNumProductRatings, setPageNumProductRatings] = useState(1);

	const [error, setError] = useState({
		message: "",
		isOpen: false,
	});

	useEffect(() => {
		getCustomerData();

		getPostOffices();
	}, []);

	useEffect(() => {
		if (customerData !== undefined && customerData !== null) {
			if (
				pageNumOrders >
				Math.ceil(
					customerData.orders.filter(
						(order) => order.dostavljena === orderHistoryIsOpen
					).length / 4
				)
			) {
				const newPageNumOrders = Math.ceil(
					customerData.orders.filter(
						(order) => order.dostavljena === orderHistoryIsOpen
					).length / 4
				);
				setPageNumOrders(newPageNumOrders);
			}

			if (
				pageNumFarmerRatings > Math.ceil(customerData.farmerRatings.length / 3)
			) {
				const newPageNumFarmerRatings = Math.ceil(
					customerData.farmerRatings.length / 3
				);
				setPageNumFarmerRatings(newPageNumFarmerRatings);
			}

			if (
				pageNumProductRatings >
				Math.ceil(customerData.productRatings.length / 3)
			) {
				const newPageNumProductRatings = Math.ceil(
					customerData.productRatings.length / 3
				);
				setPageNumProductRatings(newPageNumProductRatings);
			}
		}
	}, [customerData]);

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
	}, [customerData]);

	const getProductImages = async (productId) => {
		return axios
			.get(
				`/api/customer_profile_page/product_images/${productId}`,
				tokenConfig(store.getState)
			)
			.then((res) => {
				return res.data;
			});
	};

	const getOrderInfo = async (order) => {
		let newOrder = order;

		return Promise.all([getProductImages(newOrder.sif_oglasa)]).then(
			(results) => {
				newOrder.slike = results[0];

				let date1 = new Date(newOrder.datum_narudzbe);
				let date2 = new Date(newOrder.datum_dostave);

				date1.setDate(date1.getDate());
				date2.setDate(date2.getDate());

				newOrder.datum_narudzbe = date1.toLocaleDateString("hr-HR");
				newOrder.datum_dostave = date2.toLocaleDateString("hr-HR");

				return newOrder;
			}
		);
	};

	const getUserOrders = async (userId) => {
		let orders = await axios
			.get(
				`/api/customer_profile_page/orders/${userId}`,
				tokenConfig(store.getState)
			)
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				return [];
			});

		let promises = [];
		for (const order of orders) {
			promises.push(getOrderInfo(order));
		}

		return Promise.all(promises).then((results) => {
			return results;
		});
	};

	const getUserData = async (userId) => {
		return axios
			.get(`/api/customer_profile_page/customer_data/${userId}`)
			.then((res) => {
				return res.data;
			});
	};

	const getFarmerRatings = async (userId) => {
		return axios
			.get(`/api/customer_profile_page/farmer_ratings/${userId}`)
			.then((res) => {
				res.data.forEach((rating) => {
					let date = new Date(rating.datum_kreiranja);
					date.setDate(date.getDate());

					rating.datum_kreiranja = date.toLocaleDateString("hr-HR");
				});

				return res.data;
			});
	};

	const getProductRatings = async (userId) => {
		return axios
			.get(`/api/customer_profile_page/product_ratings/${userId}`)
			.then((res) => {
				res.data.forEach((rating) => {
					let date = new Date(rating.datum_kreiranja);
					date.setDate(date.getDate());

					rating.datum_kreiranja = date.toLocaleDateString("hr-HR");
				});

				return res.data;
			});
	};

	// Dohvaćanje podataka o kupcu/korisniku
	const getCustomerData = async () => {
		Promise.all([
			getUserData(parseInt(props.match.params.id)),
			getUserOrders(parseInt(props.match.params.id)),
			getFarmerRatings(parseInt(props.match.params.id)),
			getProductRatings(parseInt(props.match.params.id)),
		]).then((results) => {
			setCustomerData({
				userId: results[0].sif_korisnika,
				firstName: results[0].ime,
				lastName: results[0].prezime,
				address: results[0].adresa_stanovanja,
				postalCodeLong:
					results[0].pbr_mjesta_stanovanja + " " + results[0].naziv_post_ureda,
				county: results[0].naziv_zupanije,
				phoneNumber: results[0].broj_telefona,
				email: results[0].email,
				orders: results[1],
				farmerRatings: results[2],
				productRatings: results[3],
			});

			setNewCustomerInfo({
				userId: results[0].sif_korisnika,
				firstName: results[0].ime,
				lastName: results[0].prezime,
				address: results[0].adresa_stanovanja,
				postalCodeLong:
					results[0].pbr_mjesta_stanovanja + " " + results[0].naziv_post_ureda,
				phoneNumber: results[0].broj_telefona,
				oldEmail: results[0].email,
				email: results[0].email,
			});
		});
	};

	// Dohvaćanje svih poštanskih ureda
	const getPostOffices = async () => {
		axios.get("/api/register_page/post_offices").then((res) => {
			setPostOffices(res.data);
		});
	};

	const editCustomerInfo = (event) => {
		event.preventDefault();

		axios
			.put(
				`/api/customer_profile_page/customer_info/`,
				{
					userId: parseInt(newCustomerInfo.userId),
					firstName: newCustomerInfo.firstName,
					lastName: newCustomerInfo.lastName,
					address: newCustomerInfo.address,
					postalCode: parseInt(newCustomerInfo.postalCodeLong.split()[0]),
					phoneNumber: newCustomerInfo.phoneNumber,
					oldEmail: newCustomerInfo.email,
					email: newCustomerInfo.email,
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

					getCustomerData();
				}
			});
	};

	const deleteOrder = async (orderId) => {
		await axios.delete(
			`/api/customer_profile_page/order/${orderId}`,
			tokenConfig(store.getState)
		);

		getCustomerData();
	};

	const deleteFarmerRating = async (farmerRatingId) => {
		await axios.delete(
			`/api/customer_profile_page/farmer_rating/${farmerRatingId}`,
			tokenConfig(store.getState)
		);

		getCustomerData();
	};

	const deleteProductRating = async (productRatingId) => {
		await axios.delete(
			`/api/customer_profile_page/product_rating/${productRatingId}`,
			tokenConfig(store.getState)
		);

		getCustomerData();
	};

	if (
		customerData === null ||
		customerData.farmerRatings === null ||
		customerData.productRatings === null ||
		postOffices.length === 0
	) {
		return (
			<div className="CustomerProfilePage">
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
			<div className="CustomerProfilePage">
				<NavBar />

				<Toolbar />

				<Box className={classes.pageWrapper}>
					<Box className={classes.sectionPaper}>
						<Container maxWidth="lg">
							<form onSubmit={(event) => editCustomerInfo(event)}>
								<Box className={classes.sectionTitleFlexStart}>
									{!editMenuIsOpen ? (
										<Typography variant="h3">
											{customerData.firstName} {customerData.lastName}
										</Typography>
									) : (
										<React.Fragment>
											<Hidden smDown>
												<Box className={classes.nameEditBox}>
													<TextField
														variant="filled"
														fullWidth
														id="firstName"
														label="Ime"
														required
														value={newCustomerInfo.firstName}
														onChange={(event) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																firstName: event.target.value,
															});
														}}
														className={classes.rowItem}
													/>

													<TextField
														variant="filled"
														fullWidth
														id="lastName"
														label="Prezime"
														required
														value={newCustomerInfo.lastName}
														onChange={(event) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																lastName: event.target.value,
															});
														}}
													/>
												</Box>
											</Hidden>

											<Hidden mdUp>
												<Box className={classes.nameEditBoxSm}>
													<TextField
														variant="filled"
														fullWidth
														id="firstName"
														label="Ime"
														required
														value={newCustomerInfo.firstName}
														onChange={(event) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																firstName: event.target.value,
															});
														}}
														className={classes.rowItem}
													/>

													<TextField
														variant="filled"
														fullWidth
														id="lastName"
														label="Prezime"
														required
														value={newCustomerInfo.lastName}
														onChange={(event) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																lastName: event.target.value,
															});
														}}
													/>
												</Box>
											</Hidden>
										</React.Fragment>
									)}

									{props.auth.user === null ||
									!(
										props.auth.user.userId === parseInt(props.match.params.id)
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
														setNewCustomerInfo({
															userId: customerData.userId,
															firstName: customerData.firstName,
															lastName: customerData.lastName,
															address: customerData.address,
															postalCodeLong: customerData.postalCodeLong,
															phoneNumber: customerData.phoneNumber,
															oldEmail: customerData.email,
															email: customerData.email,
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
															setNewCustomerInfo({
																userId: customerData.userId,
																firstName: customerData.firstName,
																lastName: customerData.lastName,
																address: customerData.address,
																postalCodeLong: customerData.postalCodeLong,
																phoneNumber: customerData.phoneNumber,
																oldEmail: customerData.email,
																email: customerData.email,
															});

															setEditMenuIsOpen(false);
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

								<Box>
									<Typography variant="h5" className={classes.subSectionTitle}>
										Kontakt podaci
									</Typography>

									{!editMenuIsOpen ? (
										<Box className={classes.customerInfo}>
											<Typography
												variant="subtitle2"
												color="textSecondary"
												className={classes.columnItem}
											>
												Adresa:
											</Typography>

											<Box className={classes.customerAddress}>
												<Typography variant="body1">
													{customerData.address}
												</Typography>

												<Typography variant="body1">
													{customerData.postalCodeLong}
												</Typography>

												<Typography variant="body1">
													{customerData.county}
												</Typography>
											</Box>
										</Box>
									) : (
										<React.Fragment>
											<Hidden smDown>
												<Box className={classes.addressEditBox}>
													<Box style={{ width: "49.40%" }}>
														<TextField
															variant="filled"
															fullWidth
															id="address"
															label="Adresa stanovanja"
															helperText="npr. Unska ulica 3, Zagreb"
															required
															value={newCustomerInfo.address}
															onChange={(event) => {
																setNewCustomerInfo({
																	...newCustomerInfo,
																	address: event.target.value,
																});
															}}
														/>
													</Box>

													<Box style={{ width: "49.40%" }}>
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
																.sort(new Intl.Collator("hr").compare)}
															getOptionLabel={(option) => option}
															value={newCustomerInfo.postalCodeLong}
															onChange={(event, value) => {
																setNewCustomerInfo({
																	...newCustomerInfo,
																	postalCodeLong: value,
																});
															}}
														/>
													</Box>
												</Box>
											</Hidden>

											<Hidden mdUp>
												<Box className={classes.addressEditBoxSm}>
													<TextField
														variant="filled"
														fullWidth
														id="address"
														label="Adresa stanovanja"
														helperText="npr. Unska ulica 3, Zagreb"
														required
														value={newCustomerInfo.address}
														onChange={(event) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																address: event.target.value,
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
																className={classes.rowItem}
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
															.sort(new Intl.Collator("hr").compare)}
														getOptionLabel={(option) => option}
														value={newCustomerInfo.postalCodeLong}
														onChange={(event, value) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																postalCodeLong: value,
															});
														}}
													/>
												</Box>
											</Hidden>
										</React.Fragment>
									)}

									{!editMenuIsOpen ? (
										<Box className={classes.customerInfo}>
											<Typography
												variant="subtitle2"
												color="textSecondary"
												className={classes.columnItem}
											>
												Broj telefona:
											</Typography>

											<Typography variant="body1">
												{customerData.phoneNumber}
											</Typography>
										</Box>
									) : (
										<React.Fragment>
											<Hidden smDown>
												<Box className={classes.contactsEditBox}>
													<TextField
														variant="filled"
														fullWidth
														id="phoneNumber"
														label="Broj telefona"
														required
														value={newCustomerInfo.phoneNumber}
														onChange={(event) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																phoneNumber: event.target.value,
															});
														}}
														className={classes.rowItem}
													/>
												</Box>
											</Hidden>

											<Hidden mdUp>
												<Box className={classes.contactsEditBoxSm}>
													<TextField
														variant="filled"
														fullWidth
														id="phoneNumber"
														label="Broj telefona"
														required
														value={newCustomerInfo.phoneNumber}
														onChange={(event) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																phoneNumber: event.target.value,
															});
														}}
														className={classes.rowItem}
													/>
												</Box>
											</Hidden>
										</React.Fragment>
									)}

									{!editMenuIsOpen ? (
										<Box className={classes.customerInfo}>
											<Typography
												variant="subtitle2"
												color="textSecondary"
												className={classes.columnItem}
											>
												E-mail adresa:
											</Typography>

											<Typography variant="body1">
												{customerData.email}
											</Typography>
										</Box>
									) : (
										<React.Fragment>
											<Hidden smDown>
												<Box className={classes.contactsEditBox}>
													<TextField
														variant="filled"
														fullWidth
														type="email"
														id="email"
														label="E-mail adresa"
														required
														value={newCustomerInfo.email}
														onChange={(event) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																email: event.target.value,
															});
														}}
													/>
												</Box>
											</Hidden>

											<Hidden mdUp>
												<Box className={classes.contactsEditBoxSm}>
													<TextField
														variant="filled"
														fullWidth
														type="email"
														id="email"
														label="E-mail adresa"
														required
														value={newCustomerInfo.email}
														onChange={(event) => {
															setNewCustomerInfo({
																...newCustomerInfo,
																email: event.target.value,
															});
														}}
													/>
												</Box>
											</Hidden>
										</React.Fragment>
									)}
								</Box>
							</form>
						</Container>
					</Box>

					{props.auth.user === null ||
					!(props.auth.user.userId === parseInt(props.match.params.id)) ? (
						<React.Fragment />
					) : (
						<Box className={classes.section}>
							<Container maxWidth="lg">
								<Box className={classes.sectionTitleFlex}>
									<Typography variant="h4">
										{!orderHistoryIsOpen ? "Narudžbe" : "Povijest narudžbi"}
									</Typography>

									<Button
										variant="outlined"
										size="medium"
										color="inherit"
										onClick={() => {
											setOrderHistoryIsOpen(!orderHistoryIsOpen);
											setPageNumOrders(1);
										}}
									>
										{!orderHistoryIsOpen
											? "Povijest narudžbi"
											: "Trenutne narudžbe"}
									</Button>
								</Box>

								{customerData.orders !== null &&
								customerData.orders.length !== 0 ? (
									<React.Fragment>
										<Grid
											container
											spacing={4}
											direction="row"
											justify="flex-start"
										>
											{customerData.orders
												.filter(
													(order) => order.dostavljena === orderHistoryIsOpen
												)
												.sort((order1, order2) => {
													const dateString1 = order1.datum_narudzbe.split(". ");
													const dateString2 = order2.datum_narudzbe.split(". ");

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
														<OrderCardCustomer
															order={order}
															deleteOrder={deleteOrder}
														/>
													</Grid>
												))}
										</Grid>

										{customerData.orders.length <= 4 ? (
											<React.Fragment />
										) : (
											<Box className={classes.pagination}>
												<Pagination
													count={Math.ceil(
														customerData.orders.filter(
															(order) =>
																order.dostavljena === orderHistoryIsOpen
														).length / 4
													)}
													defaultPage={1}
													page={pageNumOrders}
													onChange={(event, page) => setPageNumOrders(page)}
												/>
											</Box>
										)}
									</React.Fragment>
								) : (
									<Typography variant="body1">Nema narudžbi</Typography>
								)}
							</Container>
						</Box>
					)}

					<Box
						className={
							props.auth.user !== null &&
							props.auth.user.userId === parseInt(props.match.params.id)
								? `${classes.sectionPaper}`
								: `${classes.section}`
						}
					>
						<Container maxWidth="lg">
							<Box className={classes.sectionTitle}>
								<Typography variant="h4">Ocjene poljoprivrednika</Typography>
							</Box>

							{customerData.farmerRatings !== null &&
							customerData.farmerRatings.length !== 0 ? (
								<React.Fragment>
									{customerData.farmerRatings
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
											(pageNumFarmerRatings - 1) * 3,
											(pageNumFarmerRatings - 1) * 3 + 3
										)
										.map((rating, index) => (
											<Box key={rating.sif_ocjene}>
												<Box className={classes.ratingNameBtnBox}>
													<Link
														to={`/profil_poljoprivrednik/${rating.sif_korisnika}`}
														className={`${classes.link} ${classes.rowItem}`}
													>
														<Typography variant="h6">
															{rating.ime_gospodarstva}
														</Typography>

														<Tooltip title="Otvori stranicu poljoprivrednika">
															<LaunchIcon
																fontSize="small"
																color="inherit"
																className={classes.launchIcon}
															/>
														</Tooltip>
													</Link>

													{props.auth.user === null ||
													!(
														props.auth.user.userId ===
														parseInt(props.match.params.id)
													) ? (
														<React.Fragment />
													) : (
														<Button
															size="medium"
															color="inherit"
															onClick={() =>
																deleteFarmerRating(rating.sif_ocjene)
															}
														>
															Obriši
														</Button>
													)}
												</Box>

												<Box className={classes.rating}>
													<Rating
														value={rating.ocjena}
														precision={0.5}
														readOnly
														className={classes.rowItem}
													/>

													<Typography
														variant="body1"
														className={classes.rowItem}
													>
														{rating.komentar}
													</Typography>

													<Typography variant="caption" color="textSecondary">
														{rating.datum_kreiranja}
													</Typography>
												</Box>

												{rating.sif_ocjene !==
													customerData.farmerRatings[
														customerData.farmerRatings.length - 1
													].sif_ocjene &&
												index !== pageNumFarmerRatings * 3 - 1 ? (
													<Divider />
												) : (
													<React.Fragment />
												)}
											</Box>
										))}

									{customerData.farmerRatings.length <= 3 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil(customerData.farmerRatings.length / 3)}
												defaultPage={1}
												page={pageNumFarmerRatings}
												onChange={(event, page) =>
													setPageNumFarmerRatings(page)
												}
											/>
										</Box>
									)}
								</React.Fragment>
							) : (
								<Typography variant="body1">Nema ocjena</Typography>
							)}
						</Container>
					</Box>

					<Box
						className={
							props.auth.user !== null &&
							props.auth.user.userId === parseInt(props.match.params.id)
								? `${classes.section}`
								: `${classes.sectionPaper}`
						}
					>
						<Container maxWidth="lg">
							<Box className={classes.sectionTitle}>
								<Typography variant="h4">Ocjene oglasa</Typography>
							</Box>

							{customerData.productRatings !== null &&
							customerData.productRatings.length !== 0 ? (
								<React.Fragment>
									{customerData.productRatings
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
											(pageNumProductRatings - 1) * 3,
											(pageNumProductRatings - 1) * 3 + 3
										)
										.map((rating, index) => (
											<Box key={rating.sif_ocjene}>
												<Box className={classes.ratingNameBtnBox}>
													<Link
														to={`/oglas/${rating.sif_oglasa}`}
														className={`${classes.link} ${classes.rowItem}`}
													>
														<Typography variant="h6">
															{rating.naziv_vrste_proizvoda} (
															{rating.ime_gospodarstva})
														</Typography>

														<Tooltip title="Otvori stranicu oglasa">
															<LaunchIcon
																fontSize="small"
																color="inherit"
																className={classes.launchIcon}
															/>
														</Tooltip>
													</Link>

													{props.auth.user === null ||
													!(
														props.auth.user.userId ===
														parseInt(props.match.params.id)
													) ? (
														<React.Fragment />
													) : (
														<Button
															size="medium"
															color="inherit"
															onClick={() =>
																deleteProductRating(rating.sif_ocjene)
															}
														>
															Obriši
														</Button>
													)}
												</Box>

												<Box className={classes.rating}>
													<Rating
														value={rating.ocjena}
														precision={0.5}
														readOnly
														className={classes.rowItem}
													/>

													<Typography
														variant="body1"
														className={classes.rowItem}
													>
														{rating.komentar}
													</Typography>

													<Typography variant="caption" color="textSecondary">
														{rating.datum_kreiranja}
													</Typography>
												</Box>

												{rating.sif_ocjene !==
													customerData.productRatings[
														customerData.productRatings.length - 1
													].sif_ocjene &&
												index !== pageNumProductRatings * 3 - 1 ? (
													<Divider />
												) : (
													<React.Fragment />
												)}
											</Box>
										))}

									{customerData.productRatings.length <= 3 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil(
													customerData.productRatings.length / 3
												)}
												defaultPage={1}
												page={pageNumProductRatings}
												onChange={(event, page) =>
													setPageNumProductRatings(page)
												}
											/>
										</Box>
									)}
								</React.Fragment>
							) : (
								<Typography variant="body1">Nema ocjena</Typography>
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

export default connect(mapStateToProps, { tokenConfig })(CustomerProfilePage);
