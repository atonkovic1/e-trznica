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

function AdminPageUnit(props) {
	const classes = useStyles();

	const [newUnit, setNewUnit] = useState({
		name: props.unit.oznaka_mjerne_jedinice,
	});
	const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);

	return (
		<div className="AdminPageUnit">
			<Paper elevation={3} className={classes.listItem}>
				<form
					onSubmit={async (event) => {
						await props.editUnit(
							event,
							props.unit.sif_mjerne_jedinice,
							newUnit.name
						);

						setNewUnit({
							name: "",
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
										<strong>Šifra</strong>
									</Typography>
								</Hidden>

								<Hidden smUp>
									<Typography
										variant="body1"
										align="center"
										className={classes.textXs}
									>
										{props.unit.sif_mjerne_jedinice}
									</Typography>
								</Hidden>

								<Hidden xsDown>
									<Typography variant="body1" align="center">
										{props.unit.sif_mjerne_jedinice}
									</Typography>
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
										<strong>Oznaka</strong>
									</Typography>
								</Hidden>

								<Hidden smUp>
									{editMenuIsOpen ? (
										<TextField
											variant="filled"
											size="small"
											fullWidth
											id="newUnitName"
											label="Oznaka"
											required
											value={newUnit.name}
											onChange={(event) => {
												setNewUnit({
													name: event.target.value,
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
											{props.unit.oznaka_mjerne_jedinice}
										</Typography>
									)}
								</Hidden>

								<Hidden xsDown>
									{editMenuIsOpen ? (
										<TextField
											variant="filled"
											size="small"
											fullWidth
											id="newUnitName"
											label="Oznaka"
											required
											value={newUnit.name}
											onChange={(event) => {
												setNewUnit({
													name: event.target.value,
												});
											}}
										/>
									) : (
										<Typography variant="body1" align="center">
											{props.unit.oznaka_mjerne_jedinice}
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
												setNewUnit({
													name: props.unit.oznaka_mjerne_jedinice,
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
												props.deleteUnit(props.unit.sif_mjerne_jedinice)
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

export default AdminPageUnit;
