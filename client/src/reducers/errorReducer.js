import { SET_ERROR, CLEAR_ERROR } from "../actions/types";

const initialState = {
	message: "",
	errorType: null,
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_ERROR:
			return {
				message: action.payload.message,
				errorType: action.payload.errorType,
			};
		case CLEAR_ERROR:
			return {
				msg: "",
				errorType: null,
			};
		default:
			return state;
	}
}
