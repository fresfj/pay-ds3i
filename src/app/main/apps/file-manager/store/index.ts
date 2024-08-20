import { combineReducers } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import selectedItemId, { selectedItemIdSliceType } from './selectedItemIdSlice';

/**
 * The File Manager store reducer.
 */
const reducer = combineReducers({
	selectedItemId
});

export type AppRootStateType = RootStateType<selectedItemIdSliceType>;

export default reducer;
