import { combineReducers } from '@reduxjs/toolkit';
import state from './stateSlice';

/**
 * The Notification panel reducer.
 */
const reducer = combineReducers({
	state
});

export default reducer;
