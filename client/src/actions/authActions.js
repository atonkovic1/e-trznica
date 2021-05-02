import axios from "axios";
import { returnError } from "./errorActions";

import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	USER_LOADING,
	USER_LOADED,
	LOGOUT,
	AUTH_ERROR,
} from "./types";

// Registracija korisnika
export const register = (userData, callback) => (dispatch) => {
	const config = {
		headers: {
			"Content-type": "application/json",
		},
	};
	const body = JSON.stringify(userData);

	axios
		.post("/api/auth/register", body, config)
		.then((res) => {
			dispatch({
				type: REGISTER_SUCCESS,
				payload: res.data,
			});
			// dispatch({
			// 	type: USER_LOADED,
			// 	payload: res.data.user,
			// });
			callback(true);
		})
		.catch((err) => {
			dispatch(returnError(err.response.data.message, REGISTER_FAIL));
			dispatch({
				type: REGISTER_FAIL,
			});
			callback(false);
		});
};

// Prijava korisnika
export const login = (userData, callback) => (dispatch) => {
	const config = {
		headers: {
			"Content-type": "application/json",
		},
	};
	const body = JSON.stringify(userData);

	axios
		.post("/api/auth/login", body, config)
		.then((res) => {
			dispatch({
				type: LOGIN_SUCCESS,
				payload: res.data,
			});
			// dispatch({
			// 	type: USER_LOADED,
			// 	payload: res.data.user,
			// });
			callback(true);
		})
		.catch((err) => {
			dispatch(returnError(err.response.data.message, LOGIN_FAIL));
			dispatch({
				type: LOGIN_FAIL,
			});
			callback(false);
		});
};

// Provjeri token i dohvati korisnika
export const loadUser = () => (dispatch, getState) => {
	dispatch({ type: USER_LOADING });

	axios
		.get("/api/auth/user", tokenConfig(getState))
		.then((res) => {
			dispatch({
				type: USER_LOADED,
				payload: res.data,
			});
		})
		.catch((err) => {
			dispatch(returnError(err.response.data.message, AUTH_ERROR));
			dispatch({
				type: AUTH_ERROR,
			});
		});
};

// Odjava korisnika
export const logout = () => (dispatch) => {
	dispatch({ type: LOGOUT });
};

// Postavljanje tokena u headers
export const tokenConfig = (getState) => {
	const token = getState().auth.token;

	const config = {
		headers: {
			"Content-type": "application/json",
		},
	};

	if (token) {
		config.headers["x-auth-token"] = token;
	}

	return config;
};
