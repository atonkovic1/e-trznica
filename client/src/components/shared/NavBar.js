import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/authActions";
import { Link, withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
	AppBar,
	Container,
	Toolbar,
	Box,
	Typography,
	Hidden,
	Button,
	IconButton,
	Drawer,
	Divider,
	Tooltip,
	Menu,
	MenuItem,
	Badge,
} from "@material-ui/core";
import EcoIcon from "@material-ui/icons/Eco";
import MenuIcon from "@material-ui/icons/Menu";
import ClearIcon from "@material-ui/icons/Clear";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const useStyles = makeStyles((theme) => ({
	appBar: {
		backgroundColor: theme.palette.primary.main,
	},

	toolbar: {
		display: "flex",
		justifyContent: "space-between",
	},

	link: {
		textDecoration: "none",
		color: theme.palette.background.paper,
	},

	menuLink: {
		textDecoration: "none",
		color: theme.palette.text.primary,
	},

	appNameBox: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},

	ecoIcon: {
		color: theme.palette.background.paper,
	},

	appName: {
		color: theme.palette.background.paper,
		marginLeft: theme.spacing(1),
	},

	buttonsBox: {
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
	},

	button: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		color: theme.palette.background.paper,
	},

	textWhite: {
		color: theme.palette.background.paper,
	},

	registerButton: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
		backgroundColor: theme.palette.background.paper,
		"&:hover": {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.background.paper,
		},
	},

	drawer: {
		backgroundColor: theme.palette.primary.main,
	},

	drawerToolbar: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "flex-end",
	},

	drawerButtonsBox: {
		padding: theme.spacing(1),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
	},

	drawerButton: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		color: theme.palette.background.paper,
	},

	drawerRegisterButton: {
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
		backgroundColor: theme.palette.background.paper,
		"&:hover": {
			backgroundColor: theme.palette.primary.dark,
			color: theme.palette.background.paper,
		},
	},
}));

function NavBar(props) {
	const classes = useStyles();

	const [menuIsOpen, setMenuIsOpen] = useState(false);

	const [itemsInShoppingCart, setItemsInShoppingCart] = useState(null);

	const [anchorElement, setAnchorElement] = useState(null);

	useEffect(() => {
		const itemsInCart = JSON.parse(
			localStorage.getItem("shoppingCartData") || "[]"
		).length;

		setItemsInShoppingCart(itemsInCart);
	}, [props.storage]);

	return (
		<div className="NavBar">
			<AppBar position="fixed" className={classes.appBar}>
				<Container maxWidth="lg">
					<Toolbar className={classes.toolbar}>
						<Link to="/" className={classes.link}>
							<Box className={classes.appNameBox}>
								<EcoIcon fontSize="large" className={classes.ecoIcon} />
								<Typography variant="h5" className={classes.appName}>
									e-Tržnica
								</Typography>
							</Box>
						</Link>

						<Hidden smDown>
							<Box className={classes.buttonsBox}>
								<Link to="/" className={classes.link}>
									<Button color="inherit" className={classes.button}>
										Početna
									</Button>
								</Link>

								<Link
									to="/oglasi/0?filterType=0&filterId=0&sortType=0&sortAsc=0"
									className={classes.link}
								>
									<Button color="inherit" className={classes.button}>
										Oglasi
									</Button>
								</Link>

								<Link
									to="/poljoprivrednici?filterType=0&filterId=0&sortType=0&sortAsc=0"
									className={classes.link}
								>
									<Button color="inherit" className={classes.button}>
										Poljoprivrednici
									</Button>
								</Link>

								<Divider
									orientation="vertical"
									flexItem={true}
									className={classes.button}
								/>

								{props.auth.isAuthenticated &&
								props.auth.user.userType === 2 ? (
									<Link to="/kosarica" className={classes.link}>
										<Tooltip title="Košarica">
											<IconButton
												size="small"
												color="inherit"
												className={classes.button}
											>
												<Badge
													badgeContent={itemsInShoppingCart}
													color="secondary"
												>
													<ShoppingCartIcon fontSize="default" />
												</Badge>
											</IconButton>
										</Tooltip>
									</Link>
								) : (
									<React.Fragment />
								)}

								{!props.auth.isAuthenticated ? (
									<React.Fragment>
										<Link to="/registracija" className={classes.link}>
											<Button
												variant="contained"
												color="primary"
												className={classes.registerButton}
											>
												Registriraj se
											</Button>
										</Link>

										<Link to="/prijava" className={classes.link}>
											<Button color="inherit" className={classes.button}>
												Prijavi se
											</Button>
										</Link>
									</React.Fragment>
								) : (
									<React.Fragment>
										<Box className={classes.buttonsBox}>
											<Tooltip title="Račun">
												<IconButton
													size="small"
													color="primary"
													className={classes.button}
													onClick={(event) =>
														setAnchorElement(event.currentTarget)
													}
												>
													<AccountCircleIcon fontSize="large" />
												</IconButton>
											</Tooltip>

											<Typography
												variant="subtitle2"
												className={classes.textWhite}
											>
												{props.auth.user.name}
											</Typography>
										</Box>

										<Menu
											anchorEl={anchorElement}
											keepMounted
											open={Boolean(anchorElement)}
											onClose={() => setAnchorElement(null)}
										>
											<Link
												to={
													props.auth.user.userType === 1
														? "/admin"
														: props.auth.user.userType === 2
														? `/profil_kupac/${props.auth.user.userId}`
														: `/profil_poljoprivrednik/${props.auth.user.userId}`
												}
												className={classes.menuLink}
											>
												<MenuItem>
													{props.auth.user.userType === 1
														? "Administracija"
														: "Moj račun"}
												</MenuItem>
											</Link>

											<MenuItem
												onClick={() => {
													setAnchorElement(null);
													props.logout();
													props.history.push("/");
												}}
											>
												Odjavi se
											</MenuItem>
										</Menu>
									</React.Fragment>
								)}
							</Box>
						</Hidden>

						<Hidden mdUp>
							<IconButton
								edge="end"
								size="small"
								color="inherit"
								aria-label="menu"
								onClick={() => setMenuIsOpen(!menuIsOpen)}
								className={classes.button}
							>
								<MenuIcon fontSize="large" />
							</IconButton>
						</Hidden>
					</Toolbar>
				</Container>
			</AppBar>

			<Drawer
				anchor="right"
				open={menuIsOpen}
				classes={{ paper: classes.drawer }}
			>
				<Container maxWidth="md">
					<Toolbar className={classes.drawerToolbar}>
						<IconButton
							edge="end"
							size="small"
							color="inherit"
							aria-label="menu"
							onClick={() => setMenuIsOpen(!menuIsOpen)}
							className={classes.drawerButton}
						>
							<ClearIcon fontSize="large" />
						</IconButton>
					</Toolbar>

					<Box className={classes.drawerButtonsBox}>
						<Link to="/" className={classes.link}>
							<Button color="inherit" className={classes.drawerButton}>
								Početna
							</Button>
						</Link>

						<Link
							to="/oglasi/0?filterType=0&filterId=0&sortType=0&sortAsc=0"
							className={classes.link}
						>
							<Button color="inherit" className={classes.drawerButton}>
								Oglasi
							</Button>
						</Link>

						<Link
							to="/poljoprivrednici?filterType=0&filterId=0&sortType=0&sortAsc=0"
							className={classes.link}
						>
							<Button color="inherit" className={classes.drawerButton}>
								Poljoprivrednici
							</Button>
						</Link>
					</Box>

					<Divider />

					<Box className={classes.drawerButtonsBox}>
						{props.auth.isAuthenticated && props.auth.user.userType === 2 ? (
							<Link to="/kosarica" className={classes.link}>
								<Tooltip title="Košarica">
									<IconButton
										size="small"
										color="inherit"
										className={classes.drawerButton}
									>
										<Badge badgeContent={itemsInShoppingCart} color="secondary">
											<ShoppingCartIcon fontSize="default" />
										</Badge>
									</IconButton>
								</Tooltip>
							</Link>
						) : (
							<React.Fragment />
						)}

						{!props.auth.isAuthenticated ? (
							<React.Fragment>
								<Link to="/registracija" className={classes.link}>
									<Button
										variant="contained"
										color="primary"
										className={classes.drawerRegisterButton}
									>
										Registriraj se
									</Button>
								</Link>

								<Link to="/prijava" className={classes.link}>
									<Button color="inherit" className={classes.drawerButton}>
										Prijavi se
									</Button>
								</Link>
							</React.Fragment>
						) : (
							<React.Fragment>
								<Box className={classes.buttonsBox}>
									<Tooltip title="Račun">
										<IconButton
											size="small"
											color="primary"
											className={classes.drawerButton}
											onClick={(event) => setAnchorElement(event.currentTarget)}
										>
											<AccountCircleIcon fontSize="large" />
										</IconButton>
									</Tooltip>

									<Typography variant="subtitle2" className={classes.textWhite}>
										{props.auth.user.name}
									</Typography>
								</Box>

								<Menu
									anchorEl={anchorElement}
									keepMounted
									open={Boolean(anchorElement)}
									onClose={() => setAnchorElement(null)}
								>
									<Link
										to={
											props.auth.user.userType === 1
												? "/admin"
												: props.auth.user.userType === 2
												? `/profil_kupac/${props.auth.user.userId}`
												: `/profil_poljoprivrednik/${props.auth.user.userId}`
										}
										className={classes.menuLink}
									>
										<MenuItem>
											{props.auth.user.userType === 1
												? "Administracija"
												: "Moj račun"}
										</MenuItem>
									</Link>

									<MenuItem
										onClick={() => {
											setAnchorElement(null);
											props.logout();
											props.history.push("/");
										}}
									>
										Odjavi se
									</MenuItem>
								</Menu>
							</React.Fragment>
						)}
					</Box>
				</Container>
			</Drawer>
		</div>
	);
}

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default withRouter(connect(mapStateToProps, { logout })(NavBar));
