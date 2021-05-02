import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { login } from "../../actions/authActions";
import { clearError } from "../../actions/errorActions";
import { makeStyles } from "@material-ui/core/styles";
import {
	Toolbar,
	Box,
	Container,
	Paper,
	Typography,
	TextField,
	Button,
	Snackbar,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import loginImage from "../../assets/images/loginImage.jpg";
import NavBar from "../shared/NavBar";
import Footer from "../shared/Footer";

const useStyles = makeStyles((theme) => ({
	image: {
		minHeight: "89.25vh",
		height: "auto",
		backgroundImage: `url(${loginImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "top",
	},

	imageOverlay: {
		minHeight: "89.25vh",
		height: "auto",
		backgroundColor: "#0000006E",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},

	formPaper: {
		marginTop: theme.spacing(8),
		marginBottom: theme.spacing(8),
		paddingLeft: theme.spacing(5),
		paddingRight: theme.spacing(5),
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	},

	form: {
		marginTop: theme.spacing(5),
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
	},

	formItem: {
		marginBottom: theme.spacing(1),
	},

	button: {
		marginTop: theme.spacing(7),
		color: theme.palette.background.paper,
	},
}));

function LoginPage(props) {
	const classes = useStyles();

	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState({
		message: "",
		isOpen: false,
	});

	// Dohvaćanje greške
	useEffect(() => {
		if (props.error.message !== error.message) {
			if (props.error.errorType === "LOGIN_FAIL") {
				setError({
					message: props.error.message,
					isOpen: true,
				});
			} else {
				setError({
					message: "",
					isOpen: false,
				});
			}
		}
	}, [props.error]);

	const handleSubmit = (event) => {
		event.preventDefault();

		props.login(formData, (isAuthenticated) => {
			if (isAuthenticated) {
				setFormData({
					email: "",
					password: "",
				});

				props.clearError();
				props.history.push("/");
			}
		});
	};

	return (
		<div className="LoginPage">
			<NavBar />

			<Toolbar />

			<Box className={classes.image}>
				<Box className={classes.imageOverlay}>
					<Container maxWidth="sm">
						<Paper className={classes.formPaper}>
							<Typography
								variant="h3"
								align="center"
								gutterBottom
							>
								Prijavite se!
							</Typography>

							<form
								className={classes.form}
								onSubmit={(event) => handleSubmit(event)}
							>
								<TextField
									variant="filled"
									type="email"
									id="email"
									label="E-mail adresa"
									required
									className={classes.formItem}
									value={formData.email}
									onChange={(event) => {
										setFormData({
											...formData,
											email: event.target.value,
										});
									}}
								/>

								<TextField
									variant="filled"
									type="password"
									id="password"
									label="Lozinka"
									required
									className={classes.formItem}
									value={formData.password}
									onChange={(event) => {
										setFormData({
											...formData,
											password: event.target.value,
										});
									}}
								/>

								<Button
									type="submit"
									size="large"
									variant="contained"
									color="primary"
									className={classes.button}
								>
									Prijavi se
								</Button>
							</form>
						</Paper>
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

					props.clearError();
				}}
			>
				<Alert severity="error">{error.message}</Alert>
			</Snackbar>

			<Footer />
		</div>
	);
}

const mapStateToProps = (state) => ({
	error: state.error,
});

export default connect(mapStateToProps, { login, clearError })(LoginPage);
