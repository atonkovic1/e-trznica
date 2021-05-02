import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
	Toolbar,
	Container,
	Box,
	Paper,
	Typography,
	Button,
	Hidden,
} from "@material-ui/core";
import adminCategoriesImage from "../../../assets/images/adminCategoriesImage.jpg";
import adminUnitsImage from "../../../assets/images/adminUnitsImage.jpg";
import adminPostOfficesImage from "../../../assets/images/adminPostOfficesImage.jpg";
import adminCountiesImage from "../../../assets/images/adminCountiesImage.jpg";
import NavBar from "../../shared/NavBar";
import Footer from "../../shared/Footer";

const useStyles = makeStyles((theme) => ({
	pageWrapper: {
		minHeight: "89.25vh",
		height: "auto",
		display: "flex",
	},

	contentPaper: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
	},

	contentPaperXs: {
		marginTop: theme.spacing(5),
		marginBottom: theme.spacing(5),
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-around",
	},

	textBox: {
		paddingTop: theme.spacing(5),
		paddingBottom: theme.spacing(5),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "start",
	},

	textBoxXs: {
		paddingTop: theme.spacing(3),
		paddingBottom: theme.spacing(3),
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "start",
	},

	text: {
		marginBottom: theme.spacing(2),
	},

	link: {
		textDecoration: "none",
	},

	button: {
		color: theme.palette.background.default,
	},

	imageCategories: {
		width: "50%",
		backgroundImage: `url(${adminCategoriesImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},

	imageUnits: {
		width: "50%",
		backgroundImage: `url(${adminUnitsImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},

	imagePostOffices: {
		width: "50%",
		backgroundImage: `url(${adminPostOfficesImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},

	imageCounties: {
		width: "50%",
		backgroundImage: `url(${adminCountiesImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},

	imageCategoriesXs: {
		height: "20vh",
		backgroundImage: `url(${adminCategoriesImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},

	imageUnitsXs: {
		height: "20vh",
		backgroundImage: `url(${adminUnitsImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},

	imagePostOfficesXs: {
		height: "20vh",
		backgroundImage: `url(${adminPostOfficesImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},

	imageCountiesXs: {
		height: "20vh",
		backgroundImage: `url(${adminCountiesImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "center",
	},
}));

function AdminPage(props) {
	const classes = useStyles();

	if (
		props.auth.user === null ||
		(props.auth.user !== null && props.auth.user.userType !== 1)
	) {
		return <Redirect to="/" />;
	} else {
		return (
			<div className="AdminPage">
				<NavBar />

				<Toolbar />

				<Box className={classes.pageWrapper}>
					<Container maxWidth="md">
						<Hidden xsDown>
							<Paper elevation={5} className={classes.contentPaper}>
								<Box className={classes.textBox}>
									<Box className={classes.text}>
										<Typography variant="h4" gutterBottom>
											Vrste proizvoda
										</Typography>
									</Box>

									<Link to="/admin_vrste_proizvoda" className={classes.link}>
										<Button
											size="medium"
											variant="contained"
											color="primary"
											className={classes.button}
										>
											Uredi
										</Button>
									</Link>
								</Box>

								<Box className={classes.imageCategories} />
							</Paper>

							<Paper elevation={5} className={classes.contentPaper}>
								<Box className={classes.textBox}>
									<Box className={classes.text}>
										<Typography variant="h4" gutterBottom>
											Mjerne jedinice
										</Typography>
									</Box>

									<Link to="/admin_mjerne_jedinice" className={classes.link}>
										<Button
											size="medium"
											variant="contained"
											color="primary"
											className={classes.button}
										>
											Uredi
										</Button>
									</Link>
								</Box>

								<Box className={classes.imageUnits} />
							</Paper>

							<Paper elevation={5} className={classes.contentPaper}>
								<Box className={classes.textBox}>
									<Box className={classes.text}>
										<Typography variant="h4" gutterBottom>
											Poštanski uredi
										</Typography>
									</Box>

									<Link to="/admin_postanski_uredi" className={classes.link}>
										<Button
											size="medium"
											variant="contained"
											color="primary"
											className={classes.button}
										>
											Uredi
										</Button>
									</Link>
								</Box>

								<Box className={classes.imagePostOffices} />
							</Paper>

							<Paper elevation={5} className={classes.contentPaper}>
								<Box className={classes.textBox}>
									<Box className={classes.text}>
										<Typography variant="h4" gutterBottom>
											Županije
										</Typography>
									</Box>

									<Link to="/admin_zupanije" className={classes.link}>
										<Button
											size="medium"
											variant="contained"
											color="primary"
											className={classes.button}
										>
											Uredi
										</Button>
									</Link>
								</Box>

								<Box className={classes.imageCounties} />
							</Paper>
						</Hidden>

						<Hidden smUp>
							<Paper elevation={5} className={classes.contentPaperXs}>
								<Box className={classes.imageCategoriesXs} />

								<Box className={classes.textBoxXs}>
									<Box className={classes.text}>
										<Typography variant="h4" gutterBottom>
											Vrste proizvoda
										</Typography>
									</Box>

									<Link to="/admin_vrste_proizvoda" className={classes.link}>
										<Button
											size="medium"
											variant="contained"
											color="primary"
											className={classes.button}
										>
											Uredi
										</Button>
									</Link>
								</Box>
							</Paper>

							<Paper elevation={5} className={classes.contentPaperXs}>
								<Box className={classes.imageUnitsXs} />

								<Box className={classes.textBoxXs}>
									<Box className={classes.text}>
										<Typography variant="h4" gutterBottom>
											Mjerne jedinice
										</Typography>
									</Box>

									<Link to="/admin_mjerne_jedinice" className={classes.link}>
										<Button
											size="medium"
											variant="contained"
											color="primary"
											className={classes.button}
										>
											Uredi
										</Button>
									</Link>
								</Box>
							</Paper>

							<Paper elevation={5} className={classes.contentPaperXs}>
								<Box className={classes.imagePostOfficesXs} />

								<Box className={classes.textBoxXs}>
									<Box className={classes.text}>
										<Typography variant="h4" gutterBottom>
											Poštanski uredi
										</Typography>
									</Box>

									<Link to="/admin_postanski_uredi" className={classes.link}>
										<Button
											size="medium"
											variant="contained"
											color="primary"
											className={classes.button}
										>
											Uredi
										</Button>
									</Link>
								</Box>
							</Paper>

							<Paper elevation={5} className={classes.contentPaperXs}>
								<Box className={classes.imageCountiesXs} />

								<Box className={classes.textBoxXs}>
									<Box className={classes.text}>
										<Typography variant="h4" gutterBottom>
											Županije
										</Typography>
									</Box>

									<Link to="/admin_zupanije" className={classes.link}>
										<Button
											size="medium"
											variant="contained"
											color="primary"
											className={classes.button}
										>
											Uredi
										</Button>
									</Link>
								</Box>
							</Paper>
						</Hidden>
					</Container>
				</Box>

				<Footer />
			</div>
		);
	}
}

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps, null)(AdminPage);
