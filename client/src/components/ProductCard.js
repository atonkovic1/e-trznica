import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	CardActions,
	Button,
	Typography,
	Box,
	Divider,
} from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import BlockIcon from "@material-ui/icons/Block";

const useStyles = makeStyles((theme) => ({
	link: {
		textDecoration: "none",
		color: theme.palette.text.primary,
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

	orderInfo: {
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "start",
		justifyContent: "start",
	},

	orderInfoCenter: {
		marginBottom: theme.spacing(1),
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "start",
	},

	columnItem: {
		marginRight: theme.spacing(1),
	},

	priceInfo: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "start",
	},
}));

function ProductCard(props) {
	const classes = useStyles();

	if (props.product === undefined || props.product === null) {
		return null;
	} else {
		return (
			<div className="ProductCard">
				<Card className={classes.card}>
					<Link
						to={`/oglas/${props.product.sif_oglasa}`}
						className={classes.link}
					>
						<CardActionArea>
							{props.product.slike !== undefined &&
							props.product.slike.length !== 0 ? (
								<CardMedia
									className={classes.image}
									image={props.product.slike[0].url_slike}
									title={props.product.naziv_vrste_proizvoda}
								/>
							) : (
								<Box className={classes.noImage}>
									<BlockIcon style={{ fontSize: "64px" }} />
								</Box>
							)}

							<CardContent>
								<Box className={classes.orderInfo}>
									<Typography variant="body1">
										{props.product.opis_oglasa}
									</Typography>
								</Box>

								<Divider style={{ marginBottom: "8px" }} />

								<Box className={classes.orderInfoCenter}>
									<Typography
										variant="subtitle2"
										color="textSecondary"
										className={classes.columnItem}
									>
										Cijena:
									</Typography>

									<Box className={classes.priceInfo}>
										<Typography variant="h5" style={{ marginRight: "8px" }}>
											{props.product.cijena}
										</Typography>

										<Typography variant="body2">
											kn/
											{props.product.oznaka_mjerne_jedinice}
										</Typography>
									</Box>
								</Box>

								<Box className={classes.orderInfo}>
									<Typography
										variant="subtitle2"
										color="textSecondary"
										className={classes.columnItem}
									>
										Proizvođač:
									</Typography>

									<Typography variant="body2">
										{props.product.ime_gospodarstva}
									</Typography>
								</Box>

								<Box className={classes.orderInfo}>
									<Typography
										variant="subtitle2"
										color="textSecondary"
										className={classes.columnItem}
									>
										Ocjena:
									</Typography>

									<Rating
										value={props.product.rating}
										size="medium"
										precision={0.5}
										readOnly
									/>
								</Box>
							</CardContent>
						</CardActionArea>
					</Link>

					{props.auth.user === null ||
					!(
						parseInt(props.auth.user.userId) ===
						parseInt(props.product.sif_korisnika)
					) ? (
						<React.Fragment />
					) : (
						<CardActions>
							<Link
								to={`/oglas/${props.product.sif_oglasa}`}
								className={classes.link}
							>
								<Button size="small" color="inherit">
									Uredi
								</Button>
							</Link>

							<Button
								size="small"
								color="inherit"
								onClick={() =>
									props.deleteProduct(parseInt(props.product.sif_oglasa))
								}
							>
								Obriši
							</Button>
						</CardActions>
					)}
				</Card>
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, null)(ProductCard);
