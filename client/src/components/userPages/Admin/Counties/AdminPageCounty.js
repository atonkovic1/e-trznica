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

function AdminPageCounty(props) {
	const classes = useStyles();

	const [newCounty, setNewCounty] = useState({
		countyId: props.county.sif_zupanije,
		countyName: props.county.naziv_zupanije,
	});
	const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);

	return (
		<div className="AdminPageCounty">
			<Paper elevation={3} className={classes.listItem}>
				<form
					onSubmit={async (event) => {
						await props.editCounty(
							event,
							props.county.sif_zupanije,
							newCounty.countyId,
							newCounty.countyName
						);

						setNewCounty({
							countyId: "",
							countyName: "",
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
						<Grid item xs={12} sm={4}>
							<Box className={classes.gridItem}>
								<Hidden smUp>
									<Typography
										variant="body1"
										align="center"
										className={classes.textXs}
									>
										<strong>Šifra</strong>
									</Typography>
								</Hidden>

								<Hidden smUp>
									{editMenuIsOpen ? (
										<TextField
											type="number"
											variant="filled"
											size="small"
											fullWidth
											id="newCountyId"
											label="Šifra"
											required
											value={newCounty.countyId}
											onChange={(event) => {
												setNewCounty({
													...newCounty,
													countyId: event.target.value,
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
											{props.county.sif_zupanije}
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
											id="newCountyId"
											label="Šifra"
											required
											value={newCounty.countyId}
											onChange={(event) => {
												setNewCounty({
													...newCounty,
													countyId: event.target.value,
												});
											}}
										/>
									) : (
										<Typography variant="body1" align="center">
											{props.county.sif_zupanije}
										</Typography>
									)}
								</Hidden>
							</Box>
						</Grid>

						<Grid item xs={12} sm={4}>
							<Box className={classes.gridItem}>
								<Hidden smUp>
									<Typography
										variant="body1"
										align="center"
										className={classes.textXs}
									>
										<strong>Naziv</strong>
									</Typography>
								</Hidden>

								<Hidden smUp>
									{editMenuIsOpen ? (
										<TextField
											variant="filled"
											size="small"
											fullWidth
											id="newCountyName"
											label="Naziv"
											required
											value={newCounty.countyName}
											onChange={(event) => {
												setNewCounty({
													...newCounty,
													countyName: event.target.value,
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
											{props.county.naziv_zupanije}
										</Typography>
									)}
								</Hidden>

								<Hidden xsDown>
									{editMenuIsOpen ? (
										<TextField
											variant="filled"
											size="small"
											fullWidth
											id="newCountyName"
											label="Naziv"
											required
											value={newCounty.countyName}
											onChange={(event) => {
												setNewCounty({
													...newCounty,
													countyName: event.target.value,
												});
											}}
										/>
									) : (
										<Typography variant="body1" align="center">
											{props.county.naziv_zupanije}
										</Typography>
									)}
								</Hidden>
							</Box>
						</Grid>

						<Grid item xs={12} sm={4}>
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
												setNewCounty({
													countyId: props.county.sif_zupanije,
													countyName: props.county.naziv_zupanije,
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
												props.deleteCounty(props.county.sif_zupanije)
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

export default AdminPageCounty;
