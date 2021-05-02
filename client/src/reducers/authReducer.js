import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	USER_LOADING,
	USER_LOADED,
	LOGOUT,
	AUTH_ERROR,
} from "../actions/types";

const initialState = {
	isLoading: true, //bilo je false
	isAuthenticated: false, //bilo je null
	token: localStorage.getItem("token"),
	user: null,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			localStorage.setItem("token", action.payload.token);
			return {
				isLoading: false,
				isAuthenticated: true,
				token: action.payload.token,
				user: action.payload.user,
			};
		case REGISTER_FAIL:
		case LOGIN_FAIL:
		case LOGOUT:
		case AUTH_ERROR:
			localStorage.removeItem("token");
			return {
				isLoading: false,
				isAuthenticated: false,
				token: null,
				user: null,
			};
		case USER_LOADING:
			return {
				...state,
				isLoading: true,
			};
		case USER_LOADED:
			return {
				...state,
				isLoading: false,
				isAuthenticated: true,
				user: action.payload,
			};
		default:
			return state;
	}
}
