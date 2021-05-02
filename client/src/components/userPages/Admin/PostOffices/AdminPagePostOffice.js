import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
	Typography,
	Box,
	Paper,
	Grid,
	IconButton,
	Hidden,
	TextField,
	Tooltip,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import EditIcon from "@material-ui/icons/Edit";
import SaveIcon from "@material-ui/icons/Save";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
	listItem: {
		marginBottom: theme.spacing(1),
		padding: theme.spacing(2),
	},

	gridItem: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
	},

	icon: {
		color: theme.palette.primary.main,
	},

	iconDark: {
		color: theme.palette.primary.dark,
	},

	textXs: {
		width: "50%",
	},
}));

function AdminPagePostOffice(props) {
	const classes = useStyles();

	const [newPostOffice, setNewPostOffice] = useState({
		postalCode: props.postOffice.post_broj,
		postOfficeName: props.postOffice.naziv_post_ureda,
		countyId: props.postOffice.sif_zupanije,
	});
	const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);

	return (
		<div className="AdminPagePostOffice">
			<Paper elevation={3} className={classes.listItem}>
				<form
					onSubmit={async (event) => {
						await props.editPostOffice(
							event,
							props.postOffice.post_broj,
							newPostOffice.postalCode,
							newPostOffice.postOfficeName,
							newPostOffice.countyId
						);

						setNewPostOffice({
							postalCode: "",
							postOfficeName: "",
							countyId: "",
						});
						setEditMenuIsOpen(false);
					}}
				>
					<Grid
						container
						spacing={1}
						direction="row"
						justify="center"
						alignItems="center"
						align="center"
					>
						<Grid item xs={12} sm={3}>
							<Box className={classes.gridItem}>
								<Hidden smUp>
									<Typography
										variant="body1"
										align="center"
										className={classes.textXs}
									>
										<strong>Poštanski broj</strong>
									</Typography>
								</Hidden>

								<Hidden smUp>
									{editMenuIsOpen ? (
										<TextField
											type="number"
											variant="filled"
											size="small"
											fullWidth
											id="newPostalCode"
											label="Poštanski broj"
											required
											value={newPostOffice.postalCode}
											onChange={(event) => {
												setNewPostOffice({
													...newPostOffice,
													postalCode: event.target.value,
												});
											}}
											className={classes.textXs}
										/>
									) : (
										<Typography
											variant="body1"
											align="center"
											className={classes.textXs}
										>
											{props.postOffice.post_broj}
										</Typography>
									)}
								</Hidden>

								<Hidden xsDown>
									{editMenuIsOpen ? (
										<TextField
											type="number"
											variant="filled"
											size="small"
											fullWidth
											id="newPostalCode"
											label="Poštanski broj"
											required
											value={newPostOffice.postalCode}
											onChange={(event) => {
												setNewPostOffice({
													...newPostOffice,
													postalCode: event.target.value,
												});
											}}
										/>
									) : (
										<Typography variant="body1" align="center">
											{props.postOffice.post_broj}
										</Typography>
									)}
								</Hidden>
							</Box>
						</Grid>

						<Grid item xs={12} sm={3}>
							<Box className={classes.gridItem}>
								<Hidden smUp>
									<Typography
										variant="body1"
										align="center"
										className={classes.textXs}
									>
										<strong>Naziv poštanskog ureda</strong>
									</Typography>
								</Hidden>

								<Hidden smUp>
									{editMenuIsOpen ? (
										<TextField
											variant="filled"
											size="small"
											fullWidth
											id="newPostOfficeName"
											label="Naziv pošt. ureda"
											required
											value={newPostOffice.postOfficeName}
											onChange={(event) => {
												setNewPostOffice({
													...newPostOffice,
													postOfficeName: event.target.value,
												});
											}}
											className={classes.textXs}
										/>
									) : (
										<Typography
											variant="body1"
											align="center"
											className={classes.textXs}
										>
											{props.postOffice.naziv_post_ureda}
										</Typography>
									)}
								</Hidden>

								<Hidden xsDown>
									{editMenuIsOpen ? (
										<TextField
											variant="filled"
											size="small"
											fullWidth
											id="newPostOfficeName"
											label="Naziv poštanskog ureda"
											required
											value={newPostOffice.postOfficeName}
											onChange={(event) => {
												setNewPostOffice({
													...newPostOffice,
													postOfficeName: event.target.value,
												});
											}}
										/>
									) : (
										<Typography variant="body1" align="center">
											{props.postOffice.naziv_post_ureda}
										</Typography>
									)}
								</Hidden>
							</Box>
						</Grid>

						<Grid item xs={12} sm={3}>
							<Box className={classes.gridItem}>
								<Hidden smUp>
									<Typography
										variant="body1"
										align="center"
										className={classes.textXs}
									>
										<strong>Županija</strong>
									</Typography>
								</Hidden>

								<Hidden smUp>
									{editMenuIsOpen ? (
										<Autocomplete
											id="newCountyId"
											size="small"
											fullWidth
											renderInput={(params) => (
												<TextField
													{...params}
													variant="filled"
													label="Županija"
													required
												/>
											)}
											options={props.counties
												.map((item) => item.naziv_zupanije)
												.sort(new Intl.Collator("hr").compare)}
											getOptionLabel={(option) => option}
											value={
												newPostOffice.countyId === ""
													? ""
													: props.counties.find(
															(item) =>
																item.sif_zupanije ===
																parseInt(newPostOffice.countyId)
													  ).naziv_zupanije
											}
											onChange={(event, value) => {
												setNewPostOffice({
													...newPostOffice,
													countyId: props.counties.find(
														(item) => item.naziv_zupanije === value
													).sif_zupanije,
												});
											}}
											className={classes.textXs}
										/>
									) : (
										<Typography
											variant="body1"
											align="center"
											className={classes.textXs}
										>
											{props.postOffice.naziv_zupanije}
										</Typography>
									)}
								</Hidden>

								<Hidden xsDown>
									{editMenuIsOpen ? (
										<Autocomplete
											id="newCountyId"
											size="small"
											fullWidth
											renderInput={(params) => (
												<TextField
													{...params}
													variant="filled"
													label="Županija"
													required
												/>
											)}
											options={props.counties
												.map((item) => item.naziv_zupanije)
												.sort(new Intl.Collator("hr").compare)}
											getOptionLabel={(option) => option}
											value={
												newPostOffice.countyId === ""
													? ""
													: props.counties.find(
															(item) =>
																item.sif_zupanije ===
																parseInt(newPostOffice.countyId)
													  ).naziv_zupanije
											}
											onChange={(event, value) => {
												setNewPostOffice({
													...newPostOffice,
													countyId: props.counties.find(
														(item) => item.naziv_zupanije === value
													).sif_zupanije,
												});
											}}
										/>
									) : (
										<Typography variant="body1" align="center">
											{props.postOffice.naziv_zupanije}
										</Typography>
									)}
								</Hidden>
							</Box>
						</Grid>

						<Grid item xs={12} sm={3}>
							{editMenuIsOpen ? (
								<Box className={classes.gridItem}>
									<Tooltip title="Spremi">
										<IconButton type="submit" size="medium" color="inherit">
											<SaveIcon fontSize="inherit" className={classes.icon} />
										</IconButton>
									</Tooltip>

									<Tooltip title="Odustani">
										<IconButton
											size="medium"
											color="inherit"
											onClick={() => {
												setNewPostOffice({
													postalCode: props.postOffice.post_broj,
													postOfficeName: props.postOffice.naziv_post_ureda,
													countyId: props.postOffice.sif_zupanije,
												});
												setEditMenuIsOpen(false);
											}}
										>
											<HighlightOffIcon fontSize="inherit" color="secondary" />
										</IconButton>
									</Tooltip>
								</Box>
							) : (
								<Box className={classes.gridItem}>
									<Tooltip title="Uredi">
										<IconButton
											size="medium"
											color="inherit"
											onClick={() =>
												setTimeout(() => {
													setEditMenuIsOpen(true);
												}, 500)
											}
										>
											<EditIcon
												fontSize="inherit"
												className={classes.iconDark}
											/>
										</IconButton>
									</Tooltip>

									<Tooltip title="Obriši">
										<IconButton
											size="medium"
											color="inherit"
											onClick={() =>
												props.deletePostOffice(props.postOffice.post_broj)
											}
										>
											<DeleteIcon fontSize="inherit" color="secondary" />
										</IconButton>
									</Tooltip>
								</Box>
							)}
						</Grid>
					</Grid>
				</form>
			</Paper>
		</div>
	);
}

export default AdminPagePostOffice;
