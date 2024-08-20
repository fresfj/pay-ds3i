import { combineReducers } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import cardDialog, { CardSliceType } from './cardDialogSlice';
import { ScrumboardApiType } from '../ScrumboardApi';

/**
 * The Scrumboard Reducer.
 */
const reducer = combineReducers({
	cardDialog
});

export default reducer;

export type AppRootStateType = RootStateType<[CardSliceType]> & ScrumboardApiType;
