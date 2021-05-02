import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	CardActions,
	Box,
	Typography,
	Hidden,
	FormControlLabel,
	Checkbox,
} from "@material-ui/core";
import BlockIcon from "@material-ui/icons/Block";

const useStyles = makeStyles((theme) => ({
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

	buyer: {
		display: "flex",
		flexDirection: "column",
	},

	loadingOverlay: {
		filter: "brightness(90%)",
	},
}));

function OrderCardFarmer(props) {
	const classes = useStyles();

	const [deliveryDate, setDeliveryDate] = useState(null);
	const [isDelivered, setIsDelivered] = useState(null);

	useEffect(() => {
		const dateString = props.order.datum_narudzbe.split(". ");
		let date = new Date(dateString[2], dateString[1] - 1, dateString[0]);
		date.setDate(date.getDate() + props.deliveryDays);
		date = date.toLocaleDateString("hr-HR");

		setDeliveryDate(date);

		setIsDelivered(props.order.dostavljena);
	}, [props.order.datum_narudzbe, props.deliveryDays, props.order.dostavljena]);

	if (props.order === undefined || props.order === null) {
		return null;
	} else {
		return (
			<div className="OrderCardFarmer">
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
								<Typography variant="h5" component="h2">
									{props.order.naziv_vrste_proizvoda}
								</Typography>
							</Box>

							<Box className={classes.productInfo}>
								<Typography
									variant="subtitle2"
									color="textSecondary"
									className={classes.columnItem}
								>
									Kupac:
								</Typography>

								<Box className={classes.buyer}>
									<Typography variant="body2">
										{props.order.ime} {props.order.prezime}
									</Typography>
									<Typography variant="body2">
										{props.order.adresa_stanovanja}
									</Typography>
									<Typography variant="body2" className={classes.rowItem}>
										{props.order.pbr_mjesta_stanovanja},{" "}
										{props.order.naziv_post_ureda}
									</Typography>

									<Typography variant="body2">
										{props.order.broj_telefona}
									</Typography>
									<Typography variant="body2">{props.order.email}</Typography>
								</Box>
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
									{!isDelivered ? "Dostaviti do:" : "Dostavljeno:"}
								</Typography>

								<Typography variant="body2">
									{!isDelivered ? deliveryDate : props.order.datum_dostave}
								</Typography>
							</Box>
						</CardContent>
					</CardActionArea>

					<CardActions>
						<FormControlLabel
							control={
								<Checkbox
									checked={isDelivered}
									onChange={(event) => {
										if (!isDelivered) {
											setIsDelivered(!isDelivered);

											props.setOrderIsDelivered(
												props.order.sif_narudzbe,
												event.target.checked
											);
										}
									}}
									name="orderIsDelivered"
									color="primary"
								/>
							}
							label="Dostavljeno"
						/>
					</CardActions>
				</Card>
			</div>
		);
	}
}

export default OrderCardFarmer;
