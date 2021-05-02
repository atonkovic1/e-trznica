import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { register } from "../../actions/authActions";
import { clearError } from "../../actions/errorActions";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import {
	Toolbar,
	Box,
	Container,
	Paper,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	TextField,
	Button,
	Snackbar,
} from "@material-ui/core";
import { Autocomplete, Alert } from "@material-ui/lab";
import registerImage from "../../assets/images/registerImage.jpg";
import NavBar from "../shared/NavBar";
import Footer from "../shared/Footer";

const useStyles = makeStyles((theme) => ({
	image: {
		minHeight: "100%",
		height: "auto",
		backgroundImage: `url(${registerImage})`,
		backgroundSize: "cover",
		backgroundRepeat: "no-repeat",
		backgroundPosition: "top",
	},

	imageOverlay: {
		minHeight: "100%",
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

	formItemMargin: {
		marginBottom: theme.spacing(4),
	},

	button: {
		marginTop: theme.spacing(7),
		color: theme.palette.background.paper,
	},
}));

function RegisterPage(props) {
	const classes = useStyles();

	const [formData, setFormData] = useState({
		userType: "",
		firstName: "",
		lastName: "",
		postalCodeLong: "",
		address: "",
		phoneNumber: "",
		email: "",
		password: "",
		farmerName: "",
		farmDesc: "",
		deliveryDays: "",
	});
	const [postOffices, setPostOffices] = useState([]);
	const [error, setError] = useState({
		message: "",
		isOpen: false,
	});

	// Dohvaćanje svih poštanskih ureda
	useEffect(() => {
		getData();
	}, []);

	// Dohvaćanje greške
	useEffect(() => {
		if (props.error.message !== error.message) {
			if (props.error.errorType === "REGISTER_FAIL") {
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

	// Dohvaćanje svih poštanskih ureda
	const getData = async () => {
		await axios.get("/api/register_page/post_offices").then((res) => {
			setPostOffices(res.data);
		});
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		props.register(
			{
				userType: parseInt(formData.userType),
				firstName: formData.firstName,
				lastName: formData.lastName,
				postalCode: parseInt(formData.postalCodeLong.split()[0]),
				address: formData.address,
				phoneNumber: formData.phoneNumber,
				email: formData.email,
				password: formData.password,
				farmerName: formData.farmerName,
				farmDesc: formData.farmDesc,
				deliveryDays: parseInt(formData.deliveryDays),
			},
			(isAuthenticated) => {
				if (isAuthenticated) {
					setFormData({
						userType: "",
						firstName: "",
						lastName: "",
						postalCodeLong: "",
						address: "",
						phoneNumber: "",
						email: "",
						password: "",
						farmerName: "",
						farmDesc: "",
						deliveryDays: "",
					});

					props.clearError();
					props.history.push("/");
				}
			}
		);
	};

	return (
		<div className="RegisterPage">
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
								Registrirajte se!
							</Typography>

							<form
								className={classes.form}
								onSubmit={(event) => handleSubmit(event)}
							>
								<FormControl
									variant="filled"
									required
									className={`${classes.formItem} ${classes.formItemMargin}`}
								>
									<InputLabel id="user-type">
										Vrsta korisnika
									</InputLabel>
									<Select
										labelId="user-type"
										id="userType"
										value={formData.userType}
										onChange={(event) => {
											setFormData({
												...formData,
												userType: event.target.value,
											});
										}}
									>
										<MenuItem value={2}>Kupac</MenuItem>
										<MenuItem value={3}>
											Poljoprivrednik
										</MenuItem>
									</Select>
								</FormControl>

								<Typography variant="h6" gutterBottom>
									Osobni podaci:
								</Typography>

								<TextField
									variant="filled"
									id="firstName"
									label="Ime"
									required
									className={classes.formItem}
									value={formData.firstName}
									onChange={(event) => {
										setFormData({
											...formData,
											firstName: event.target.value,
										});
									}}
								/>

								<TextField
									variant="filled"
									id="lastName"
									label="Prezime"
									required
									className={classes.formItem}
									value={formData.lastName}
									onChange={(event) => {
										setFormData({
											...formData,
											lastName: event.target.value,
										});
									}}
								/>

								<TextField
									variant="filled"
									id="address"
									label="Adresa stanovanja"
									helperText="npr. Unska ulica 3, Zagreb"
									required
									className={classes.formItem}
									value={formData.address}
									onChange={(event) => {
										setFormData({
											...formData,
											address: event.target.value,
										});
									}}
								/>

								<Autocomplete
									id="postalCodeLong"
									autoSelect
									renderInput={(params) => (
										<TextField
											{...params}
											variant="filled"
											label="Poštanski broj"
											required
											className={classes.formItemMargin}
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
										.sort()}
									getOptionLabel={(option) => option}
									value={formData.postalCodeLong}
									onChange={(event, value) => {
										setFormData({
											...formData,
											postalCodeLong: value,
										});
									}}
								/>

								{formData.userType === "" ||
								formData.userType === 2 ? (
									<React.Fragment />
								) : (
									<React.Fragment>
										<Typography variant="h6" gutterBottom>
											Podaci o gospodarstvu:
										</Typography>

										<TextField
											variant="filled"
											id="farmerName"
											label="Ime gospodarstva"
											required
											className={classes.formItem}
											value={formData.farmerName}
											onChange={(event) => {
												setFormData({
													...formData,
													farmerName:
														event.target.value,
												});
											}}
										/>

										<TextField
											variant="filled"
											multiline
											rows={4}
											id="farmDesc"
											label="Opis gospodarstva"
											helperText="Opis čime se gospodarstvo bavi, što proizvodi te dodatni podaci"
											required
											className={classes.formItem}
											value={
												formData.userType === 3
													? formData.farmDesc
													: ""
											}
											onChange={(event) => {
												setFormData({
													...formData,
													farmDesc:
														event.target.value,
												});
											}}
										/>

										<TextField
											type="number"
											variant="filled"
											id="deliveryDays"
											label="Rok dostave u danima"
											required
											className={`${classes.formItem} ${classes.formItemMargin}`}
											value={
												formData.userType === 3
													? formData.deliveryDays
													: ""
											}
											onChange={(event) => {
												setFormData({
													...formData,
													deliveryDays:
														event.target.value,
												});
											}}
										/>
									</React.Fragment>
								)}

								<Typography variant="h6" gutterBottom>
									Kontakt podaci:
								</Typography>

								<TextField
									variant="filled"
									id="phoneNumber"
									label="Broj telefona"
									required
									className={classes.formItem}
									value={formData.phoneNumber}
									onChange={(event) => {
										setFormData({
											...formData,
											phoneNumber: event.target.value,
										});
									}}
								/>

								<TextField
									variant="filled"
									type="email"
									id="email"
									label="E-mail adresa"
									helperText="Dodatno služi i za prijavu u sustav"
									required
									className={`${classes.formItem} ${classes.formItemMargin}`}
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
									helperText="Služi za prijavu u sustav"
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
									Registriraj se
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

export default connect(mapStateToProps, { register, clearError })(RegisterPage);
