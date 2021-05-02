import React, { useState, useEffect } from "react";
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
	Grid,
	Typography,
	Button,
	Snackbar,
} from "@material-ui/core";
import { Alert, Pagination } from "@material-ui/lab";
import NavBar from "./shared/NavBar";
import Footer from "./shared/Footer";
import ShoppingCartOrder from "./ShoppingCartOrder";

const useStyles = makeStyles((theme) => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: "#fff",
	},

	button: {
		color: theme.palette.background.paper,
	},

	pageWrapper: {
		backgroundColor: theme.palette.background.paper,
		minHeight: "89.25vh",
		height: "auto",
		display: "flex",
		flexDirection: "column",
	},

	section: {
		padding: theme.spacing(2),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(5),
		backgroundColor: theme.palette.background.default,
	},

	sectionPaper: {
		padding: theme.spacing(2),
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(5),
		backgroundColor: theme.palette.background.paper,
	},

	sectionTitle: {
		marginBottom: theme.spacing(3),
	},

	subSection: {
		marginBottom: theme.spacing(5),
	},

	subSectionTitle: {
		marginBottom: theme.spacing(2),
	},

	subSectionTitleSm: {
		marginBottom: theme.spacing(1),
	},

	orderButton: {
		marginTop: theme.spacing(5),
	},

	pagination: {
		marginTop: theme.spacing(5),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
}));

function ShoppingCartPage(props) {
	const classes = useStyles();

	const [ordersData, setOrdersData] = useState(null);
	const [totalPrice, setTotalPrice] = useState(null);

	const [pageNum, setPageNum] = useState(1);

	const [alert, setAlert] = useState({
		message: "",
		isOpen: false,
	});

	useEffect(() => {
		getOrdersData();
	}, []);

	useEffect(() => {
		if (
			ordersData !== undefined &&
			ordersData !== null &&
			pageNum > Math.ceil(ordersData.length / 4)
		) {
			const newPageNum = Math.ceil(ordersData.length / 4);
			setPageNum(newPageNum);
		}
	}, [ordersData]);

	const getProductImages = async (productId) => {
		return axios
			.get(`/api/shopping_cart_page/product_images/${productId}`)
			.then((res) => {
				return res.data;
			});
	};

	const getProductInfo = async (productId) => {
		return axios
			.get(`/api/shopping_cart_page/product_data/${productId}`)
			.then((res) => {
				return res.data;
			});
	};

	const getOrderInfo = async (order) => {
		let orderInfo = {
			orderId: order.orderId,
			customerId: order.customerId,
			productData: null,
			quantity: order.quantity,
		};

		return Promise.all([
			getProductInfo(order.productId),
			getProductImages(order.productId),
		]).then((results) => {
			results[0].slike = results[1];
			orderInfo.productData = results[0];

			return orderInfo;
		});
	};

	const getOrdersData = async () => {
		const shoppingCartData = JSON.parse(
			localStorage.getItem("shoppingCartData") || "[]"
		);

		let promises = [];
		if (shoppingCartData.length !== 0) {
			for (const order of shoppingCartData) {
				promises.push(getOrderInfo(order));
			}
		}

		Promise.all(promises).then((results) => {
			let priceTotal = 0;
			results.forEach((item) => {
				priceTotal += item.quantity * item.productData.cijena;
			});

			setOrdersData(results);
			setTotalPrice(priceTotal);
		});
	};

	const emptyShoppingCart = () => {
		setOrdersData(null);
		setTotalPrice(null);

		localStorage.removeItem("shoppingCartData");
	};

	const makeOrders = async () => {
		for (const order of ordersData) {
			await axios.post(
				"/api/shopping_cart_page/order",
				{
					quantity: parseInt(order.quantity),
					productId: parseInt(order.productData.sif_oglasa),
					customerId: parseInt(order.customerId),
				},
				tokenConfig(store.getState)
			);
		}

		setAlert({
			message: "Proizvodi su uspješno naručeni",
			isOpen: true,
		});

		setTimeout(() => {
			emptyShoppingCart();

			props.history.push(`/profil_kupac/${props.auth.user.userId}`);
		}, 2300);
	};

	const deleteOrder = (orderId) => {
		let shoppingCartData = JSON.parse(
			localStorage.getItem("shoppingCartData") || "[]"
		);

		const shoppingCartDataNew = shoppingCartData.filter(
			(item) => item.orderId !== orderId
		);

		localStorage.setItem(
			"shoppingCartData",
			JSON.stringify(shoppingCartDataNew)
		);

		getOrdersData();
	};

	if (ordersData === null || totalPrice === null) {
		return (
			<div className="ShoppingCartPage">
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
			<div className="ShoppingCartPage">
				<NavBar storage={localStorage.getItem("shoppingCartData")} />

				<Toolbar />

				<Box className={classes.pageWrapper}>
					<Box
						className={
							ordersData.length !== 0
								? `${classes.section}`
								: `${classes.sectionPaper}`
						}
					>
						<Container maxWidth="lg">
							<Typography variant="h3" className={classes.sectionTitle}>
								Košarica
							</Typography>

							{ordersData.length === 0 ? (
								<Typography variant="h5">Vaša košarica je prazna</Typography>
							) : (
								<React.Fragment>
									<Typography variant="h4" className={classes.subSectionTitle}>
										Proizvodi
									</Typography>

									<Grid
										container
										spacing={4}
										direction="row"
										justify="flex-start"
									>
										{ordersData
											.slice((pageNum - 1) * 4, (pageNum - 1) * 4 + 4)
											.map((order) => (
												<Grid
													item
													xs={12}
													sm={6}
													md={4}
													lg={3}
													key={order.orderId}
												>
													<ShoppingCartOrder
														order={order}
														deleteOrder={deleteOrder}
													/>
												</Grid>
											))}
									</Grid>

									{ordersData.length <= 4 ? (
										<React.Fragment />
									) : (
										<Box className={classes.pagination}>
											<Pagination
												count={Math.ceil(ordersData.length / 4)}
												defaultPage={1}
												page={pageNum}
												onChange={(event, page) => setPageNum(page)}
											/>
										</Box>
									)}
								</React.Fragment>
							)}
						</Container>
					</Box>

					{ordersData.length === 0 ? (
						<React.Fragment />
					) : (
						<Box className={classes.sectionPaper}>
							<Container maxWidth="lg">
								<Typography variant="h4" className={classes.subSectionTitleSm}>
									Ukupna cijena
								</Typography>

								<Typography variant="h5">{totalPrice} kn</Typography>

								<Box className={classes.orderButton}>
									<Button
										variant="contained"
										size="large"
										color="primary"
										className={classes.button}
										onClick={() => makeOrders()}
									>
										Naruči
									</Button>
								</Box>
							</Container>
						</Box>
					)}
				</Box>

				<Snackbar
					open={alert.isOpen}
					autoHideDuration={2000}
					onClose={(event, reason) => {
						if (reason === "clickaway") {
							return;
						}

						setAlert({
							message: "",
							isOpen: false,
						});
					}}
				>
					<Alert severity="success">{alert.message}</Alert>
				</Snackbar>

				<Footer />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, { tokenConfig })(ShoppingCartPage);
