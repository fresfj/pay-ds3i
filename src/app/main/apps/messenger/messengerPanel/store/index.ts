import { combineReducers } from '@reduxjs/toolkit';
import selectedContactId from './selectedContactIdSlice';
import state from './stateSlice';

/**
 * Chat panel reducer.
 */
const reducer = combineReducers({
	selectedContactId,
	state
});

export default reducer;
