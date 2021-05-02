import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
	Toolbar,
	Box,
	Container,
	Typography,
	Grid,
	Paper,
	Button,
} from "@material-ui/core";
import homeHeroImage from "../assets/images/homeHeroImage.jpg";
import homeSubHeroImage from "../assets/images/homeSubHeroImage.jpg";
import NavBar from "./shared/NavBar";
import Footer from "./shared/Footer";

const useStyles = makeStyles((theme) => ({
	heroImage: {
		height: "94.1vh",
		backgroundImage: `url(${homeHeroImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center center",
	},

	heroImageOverlay: {
		height: "94.1vh",
		backgroundColor: "#0000006e",
		display: "flex",
	},

	heroText: {
		height: "20vh",
		marginTop: "30vh",
		color: "white",
	},

	subhero1: {
		backgroundColor: theme.palette.background.paper,
		display: "flex",
		alignItems: "center",
	},

	subhero1Box: {
		paddingTop: theme.spacing(9),
		paddingBottom: theme.spacing(9),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},

	subhero1Image: {
		height: "40vh",
		backgroundImage: `url(${homeSubHeroImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "top",
	},

	subhero1ContentBox: {
		width: "100%",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
	},

	subhero1Text: {
		marginBottom: theme.spacing(4),
	},

	subhero1Buttons: {
		width: "100%",
	},

	link: {
		textDecoration: "none",
	},

	button: {
		color: theme.palette.background.paper,
	},

	subhero2: {
		display: "flex",
		alignItems: "center",
	},

	subhero2Box: {
		paddingTop: theme.spacing(7),
		paddingBottom: theme.spacing(7),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "start",
	},

	subhero2Text: {
		marginBottom: theme.spacing(4),
	},
}));

function HomePage() {
	const classes = useStyles();

	return (
		<div className="HomePage">
			<NavBar />

			<Toolbar />

			<Box className={classes.heroImage}>
				<Box className={classes.heroImageOverlay}>
					<Container maxwidth="lg">
						<Box className={classes.heroText}>
							<Typography variant="h1" align="center" gutterBottom>
								Dobrodošli!
							</Typography>
							<Typography variant="h4" align="center">
								e-Tržnica je online platforma za prodaju i kupovinu
								poljoprivrednih proizvoda
							</Typography>
						</Box>
					</Container>
				</Box>
			</Box>

			<Box className={classes.subhero1}>
				<Container maxWidth="lg">
					<Box className={classes.subhero1Box}>
						<Grid
							container
							spacing={5}
							direction="row"
							justify="space-between"
							alignItems="center"
							align="center"
						>
							<Grid item xs={12} md={7}>
								<Paper elevation={2} className={classes.subhero1Image} />
							</Grid>

							<Grid item xs={12} md={5}>
								<Box className={classes.subhero1ContentBox}>
									<Box className={classes.subhero1Text}>
										<Typography variant="h4" align="center" gutterBottom>
											Kupujte provjereno
										</Typography>
										<Typography variant="body1" align="center" gutterBottom>
											Budite sigurni u podrijetlo svoje hrane. Kupujte od
											provjerenih poljoprivrednika.
										</Typography>
									</Box>

									<Box className={classes.subhero1Buttons}>
										<Grid
											container
											spacing={2}
											direction="row"
											justify="center"
											alignItems="center"
											align="center"
										>
											<Grid item xs={12} sm={3} md={6}>
												<Link
													to="/oglasi/0?filterType=0&filterId=0&sortType=0&sortAsc=0"
													className={classes.link}
												>
													<Button
														size="large"
														variant="contained"
														color="primary"
														className={classes.button}
													>
														Oglasi
													</Button>
												</Link>
											</Grid>

											<Grid item xs={12} sm={3} md={6}>
												<Link
													to="/poljoprivrednici?filterType=0&filterId=0&sortType=0&sortAsc=0"
													className={classes.link}
												>
													<Button
														size="large"
														variant="contained"
														color="primary"
														className={classes.button}
													>
														Poljoprivrednici
													</Button>
												</Link>
											</Grid>
										</Grid>
									</Box>
								</Box>
							</Grid>
						</Grid>
					</Box>
				</Container>
			</Box>

			<Box className={classes.subhero2}>
				<Container maxWidth="lg">
					<Box className={classes.subhero2Box}>
						<Box className={classes.subhero2Text}>
							<Typography variant="h4" gutterBottom>
								Jednostavna i brza registracija
							</Typography>
							<Typography variant="body1" gutterBottom>
								Registracija kupcima omogućuje naručivanje proizvoda, a
								poljoprivrednicima kreiranje vlastitih oglasa.
							</Typography>
						</Box>

						<Link to="/registracija" className={classes.link}>
							<Button
								size="large"
								variant="contained"
								color="primary"
								className={classes.button}
							>
								Registriraj se
							</Button>
						</Link>
					</Box>
				</Container>
			</Box>

			<Footer />
		</div>
	);
}

export default HomePage;
