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

function AdminPageCategory(props) {
	const classes = useStyles();

	const [newCategory, setNewCategory] = useState({
		name: props.category.naziv_vrste_proizvoda,
		masterCategoryName: props.category.naziv_nadvrste_proizvoda,
	});
	const [editMenuIsOpen, setEditMenuIsOpen] = useState(false);

	return (
		<div className="AdminPageCategory">
			<Paper elevation={3} className={classes.listItem}>
				<form
					onSubmit={async (event) => {
						await props.editCategory(
							event,
							newCategory.masterCategoryName,
							newCategory.name,
							props.category.sif_vrste_proizvoda
						);

						setNewCategory({
							name: "",
							masterCategoryName: "",
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
										{props.category.sif_vrste_proizvoda}
									</Typography>
								</Hidden>

								<Hidden xsDown>
									<Typography variant="body1" align="center">
										{props.category.sif_vrste_proizvoda}
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
										<strong>Naziv</strong>
									</Typography>
								</Hidden>

								<Hidden smUp>
									{editMenuIsOpen ? (
										<TextField
											variant="filled"
											size="small"
											fullWidth
											id="newCategoryName"
											label="Naziv"
											required
											value={newCategory.name}
											onChange={(event) => {
												setNewCategory({
													...newCategory,
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
											{props.category.naziv_vrste_proizvoda}
										</Typography>
									)}
								</Hidden>

								<Hidden xsDown>
									{editMenuIsOpen ? (
										<TextField
											variant="filled"
											size="small"
											fullWidth
											id="newCategoryName"
											label="Naziv"
											required
											value={newCategory.name}
											onChange={(event) => {
												setNewCategory({
													...newCategory,
													name: event.target.value,
												});
											}}
										/>
									) : (
										<Typography variant="body1" align="center">
											{props.category.naziv_vrste_proizvoda}
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
										<strong>Naziv nadvrste</strong>
									</Typography>
								</Hidden>

								<Hidden smUp>
									{editMenuIsOpen ? (
										<Autocomplete
											id="newMasterCategory"
											fullWidth
											className={classes.textXs}
											autoSelect
											renderInput={(params) => (
												<TextField
													{...params}
													variant="filled"
													size="small"
													label="Naziv nadvrste"
													required
												/>
											)}
											options={props.categories
												.map((category) => category.naziv_vrste_proizvoda)
												.sort()}
											getOptionLabel={(option) => option}
											value={newCategory.masterCategoryName}
											onChange={(event, value) => {
												setNewCategory({
													...newCategory,
													masterCategoryName: value,
												});
											}}
										/>
									) : (
										<Typography
											variant="body1"
											align="center"
											className={classes.textXs}
										>
											{props.category.naziv_nadvrste_proizvoda}
										</Typography>
									)}
								</Hidden>

								<Hidden xsDown>
									{editMenuIsOpen ? (
										<Autocomplete
											id="newMasterCategory"
											fullWidth
											autoSelect
											renderInput={(params) => (
												<TextField
													{...params}
													variant="filled"
													size="small"
													label="Naziv nadvrste"
													required
												/>
											)}
											options={props.categories
												.map((category) => category.naziv_vrste_proizvoda)
												.sort()}
											getOptionLabel={(option) => option}
											value={newCategory.masterCategoryName}
											onChange={(event, value) => {
												setNewCategory({
													...newCategory,
													masterCategoryName: value,
												});
											}}
										/>
									) : (
										<Typography variant="body1" align="center">
											{props.category.naziv_nadvrste_proizvoda}
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
												setNewCategory({
													name: props.category.naziv_vrste_proizvoda,
													masterCategoryName:
														props.category.naziv_nadvrste_proizvoda,
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
												props.deleteCategory(props.category.sif_vrste_proizvoda)
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

export default AdminPageCategory;
