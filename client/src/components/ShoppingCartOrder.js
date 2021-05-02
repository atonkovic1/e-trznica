import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Box,
	Typography,
	Hidden,
	Tooltip,
} from "@material-ui/core";
import BlockIcon from "@material-ui/icons/Block";
import LaunchIcon from "@material-ui/icons/Launch";

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

	card: {
		maxWidth: 345,
	},

	image: {
		height: 140,
	},

	noImage: {
		height: 140,
		backgroundColor: theme.palette.text.disabled,
		color: theme.palette.background.default,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},

	productInfo: {
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "start",
		justifyContent: "start",
	},

	columnItem: {
		marginRight: theme.spacing(1),
	},

	rowItem: {
		marginBottom: theme.spacing(1),
	},
}));

function ShoppingCartOrder(props) {
	const classes = useStyles();

	const [deliveryDate, setDeliveryDate] = useState(null);

	useEffect(() => {
		let date = new Date();
		date.setDate(date.getDate() + props.order.productData.rok_isporuke_dani);
		date = date.toLocaleDateString("hr-HR");

		setDeliveryDate(date);
	}, [props.order]);

	if (props.order === undefined || props.order === null) {
		return null;
	} else {
		return (
			<div className="ShoppingCartOrder">
				<Card className={classes.card}>
					<CardActionArea>
						{props.order.productData.slike !== undefined &&
						props.order.productData.slike.length !== 0 ? (
							<Hidden smDown>
								<CardMedia
									className={classes.image}
									image={props.order.productData.slike[0].url_slike}
									title={props.order.productData.naziv_vrste_proizvoda}
								/>
							</Hidden>
						) : (
							<Box className={classes.noImage}>
								<BlockIcon style={{ fontSize: "64px" }} />
							</Box>
						)}

						<CardContent>
							<Box className={classes.productInfo}>
								<Link
									to={`/oglas/${props.order.productData.sif_oglasa}`}
									className={classes.link}
								>
									<Typography variant="h5" component="h2">
										{props.order.productData.naziv_vrste_proizvoda}
									</Typography>

									<Tooltip title="Otvori stranicu oglasa">
										<LaunchIcon
											color="inherit"
											className={classes.launchIcon}
											style={{ fontSize: "1rem" }}
										/>
									</Tooltip>
								</Link>
							</Box>

							<Box className={classes.productInfo}>
								<Typography
									variant="subtitle2"
									color="textSecondary"
									className={classes.columnItem}
								>
									Proizvođač:
								</Typography>

								<Link
									to={`/profil_poljoprivrednik/${props.order.productData.sif_korisnika}`}
									className={classes.link}
								>
									<Typography variant="body2">
										{props.order.productData.ime_gospodarstva}
									</Typography>

									<Tooltip title="Otvori stranicu poljoprivrednika">
										<LaunchIcon
											color="inherit"
											className={classes.launchIcon}
											style={{ fontSize: "1rem" }}
										/>
									</Tooltip>
								</Link>
							</Box>

							<Box className={classes.productInfo}>
								<Typography
									variant="subtitle2"
									color="textSecondary"
									className={classes.columnItem}
								>
									Količina:
								</Typography>

								<Typography variant="body2">
									{props.order.quantity}{" "}
									{props.order.productData.oznaka_mjerne_jedinice}
								</Typography>
							</Box>

							<Box className={classes.productInfo}>
								<Typography
									variant="subtitle2"
									color="textSecondary"
									className={classes.columnItem}
								>
									Cijena:
								</Typography>

								<Typography variant="body2">
									{props.order.quantity * props.order.productData.cijena} kn
								</Typography>
							</Box>

							<Box className={classes.productInfo}>
								<Typography
									variant="subtitle2"
									color="textSecondary"
									className={classes.columnItem}
								>
									Dostava do:
								</Typography>

								<Typography variant="body2">{deliveryDate}</Typography>
							</Box>
						</CardContent>
					</CardActionArea>

					<CardActions>
						<Button
							size="small"
							color="inherit"
							onClick={() => props.deleteOrder(props.order.orderId)}
						>
							Obriši
						</Button>
					</CardActions>
				</Card>
			</div>
		);
	}
}

export default ShoppingCartOrder;
