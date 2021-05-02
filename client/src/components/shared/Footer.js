import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Container, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	footer: {
		paddingTop: theme.spacing(1),
		paddingBottom: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.background.paper,
		display: "flex",
		alignItems: "center",
	},
}));

function Footer() {
	const classes = useStyles();

	return (
		<div className="Footer">
			<Box className={classes.footer}>
				<Container maxwidth="lg">
					<Typography variant="body1" align="center">
						&copy; 2020 Antonio Tonković
					</Typography>
				</Container>
			</Box>
		</div>
	);
}

export default Footer;
