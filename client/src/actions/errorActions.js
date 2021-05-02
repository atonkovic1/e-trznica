import { SET_ERROR, CLEAR_ERROR } from "./types";

// Dohvati grešku
export const returnError = (message, errorType = null) => (dispatch) => {
	dispatch({
		type: SET_ERROR,
		payload: { message, errorType },
	});
};

// Očisti grešku
export const clearError = () => (dispatch) => {
	dispatch({
		type: CLEAR_ERROR,
	});
};
