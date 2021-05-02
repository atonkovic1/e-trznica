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
	FormControlLabel,
	Checkbox,
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

	seller: {
		display: "flex",
		flexDirection: "column",
		overflow: "visible",
	},

	loadingOverlay: {
		filter: "brightness(90%)",
	},
}));

function OrderCardCustomer(props) {
	const classes = useStyles();

	const [deliveryDate, setDeliveryDate] = useState(null);
	const [isDelivered, setIsDelivered] = useState(null);

	useEffect(() => {
		const dateString = props.order.datum_narudzbe.split(". ");
		let date = new Date(dateString[2], dateString[1] - 1, dateString[0]);
		date.setDate(date.getDate() + props.order.rok_isporuke_dani);
		date = date.toLocaleDateString("hr-HR");

		setDeliveryDate(date);

		setIsDelivered(props.order.dostavljena);
	}, [props.order, props.order.dostavljena]);

	if (props.order === undefined || props.order === null) {
		return null;
	} else {
		return (
			<div className="OrderCardCustomer">
				<Card
					className={
						!isDelivered
							? `${classes.card}`
							: `${classes.card} ${classes.loadingOverlay}`
					}
				>
					<CardActionArea>
						{props.order.slike !== undefined &&
						props.order.slike.length !== 0 ? (
							<Hidden smDown>
								<CardMedia
									className={classes.image}
									image={props.order.slike[0].url_slike}
									title={props.order.naziv_vrste_proizvoda}
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
									to={`/oglas/${props.order.sif_oglasa}`}
									className={classes.link}
								>
									<Typography variant="h5" component="h2">
										{props.order.naziv_vrste_proizvoda}
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
									to={`/profil_poljoprivrednik/${props.order.sif_korisnika}`}
									className={classes.link}
								>
									<Typography variant="body2">
										{props.order.ime_gospodarstva}
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
									{props.order.kolicina} {props.order.oznaka_mjerne_jedinice}
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
									{props.order.kolicina * props.order.cijena} kn
								</Typography>
							</Box>

							<Box className={classes.productInfo}>
								<Typography
									variant="subtitle2"
									color="textSecondary"
									className={classes.columnItem}
								>
									{!isDelivered ? "Dostava do:" : "Dostavljeno:"}
								</Typography>

								<Typography variant="body2">
									{!isDelivered ? deliveryDate : props.order.datum_dostave}
								</Typography>
							</Box>
						</CardContent>
					</CardActionArea>

					<CardActions>
						{!isDelivered ? (
							<Button
								size="small"
								color="inherit"
								onClick={() => props.deleteOrder(props.order.sif_narudzbe)}
							>
								Obriši
							</Button>
						) : (
							<FormControlLabel
								control={
									<Checkbox
										checked={isDelivered}
										onChange={(event) => {}}
										name="orderIsDelivered"
										color="primary"
									/>
								}
								label="Dostavljeno"
							/>
						)}
					</CardActions>
				</Card>
			</div>
		);
	}
}

export default OrderCardCustomer;
