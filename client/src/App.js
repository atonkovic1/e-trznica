import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { CssBaseline } from "@material-ui/core";
import {
	createMuiTheme,
	responsiveFontSizes,
	ThemeProvider,
} from "@material-ui/core/styles";
import store from "./store";
import { loadUser } from "./actions/authActions";
import ScrollToTop from "./components/utility/ScrollToTop";
import PrivateRoute from "./components/utility/PrivateRoute";
import HomePage from "./components/HomePage";
import RegisterPage from "./components/auth/RegisterPage";
import LoginPage from "./components/auth/LoginPage";
import AdminPage from "./components/userPages/Admin/AdminPage";
import AdminPageCategories from "./components/userPages/Admin/Categories/AdminPageCategories";
import AdminPageUnits from "./components/userPages/Admin/Units/AdminPageUnits";
import AdminPagePostOffices from "./components/userPages/Admin/PostOffices/AdminPagePostOffices";
import AdminPageCounties from "./components/userPages/Admin/Counties/AdminPageCounties";
import FarmerProfilePage from "./components/userPages/Farmer/FarmerProfilePage";
import CustomerProfilePage from "./components/userPages/Customer/CustomerProfilePage";
import ProductPage from "./components/ProductPage";
import ProductsPage from "./components/ProductsPage";
import ShoppingCartPage from "./components/ShoppingCartPage";
import FarmersPage from "./components/FarmersPage";

function App() {
	let theme = createMuiTheme({
		palette: {
			primary: {
				main: "#69b55d",
			},
			secondary: {
				main: "#A6281C",
			},
		},
	});
	theme = responsiveFontSizes(theme);

	useEffect(() => {
		store.dispatch(loadUser());
	}, []);

	return (
		<Provider store={store}>
			<div className="App">
				<CssBaseline />
				<ThemeProvider theme={theme}>
					<Router>
						<ScrollToTop />

						<Switch>
							<Route exact path="/" component={HomePage} />
							<Route exact path="/registracija" component={RegisterPage} />
							<Route exact path="/prijava" component={LoginPage} />
							<PrivateRoute exact path="/admin" component={AdminPage} />
							<PrivateRoute
								exact
								path="/admin_vrste_proizvoda"
								component={AdminPageCategories}
							/>
							<PrivateRoute
								exact
								path="/admin_mjerne_jedinice"
								component={AdminPageUnits}
							/>
							<PrivateRoute
								exact
								path="/admin_postanski_uredi"
								component={AdminPagePostOffices}
							/>
							<PrivateRoute
								exact
								path="/admin_zupanije"
								component={AdminPageCounties}
							/>
							<Route
								exact
								path="/profil_poljoprivrednik/:id"
								component={FarmerProfilePage}
							/>
							<Route
								exact
								path="/profil_kupac/:id"
								component={CustomerProfilePage}
							/>
							<Route exact path="/oglas/:id" component={ProductPage} />
							<Route
								exact
								path="/oglasi/:categoryId"
								component={ProductsPage}
							/>
							<Route exact path="/poljoprivrednici" component={FarmersPage} />
							<PrivateRoute
								exact
								path="/kosarica"
								component={ShoppingCartPage}
							/>
						</Switch>
					</Router>
				</ThemeProvider>
			</div>
		</Provider>
	);
}

export default App;
