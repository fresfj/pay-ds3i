import { combineReducers } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import data, { dataSliceType } from './dataSlice';
import state, { stateSliceType } from './stateSlice';

const reducer = combineReducers({
	data,
	state
});

export default reducer;

export type AppRootStateType = RootStateType<dataSliceType, stateSliceType>;
