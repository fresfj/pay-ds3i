import { RootStateType } from 'app/store/types';
import { combineReducers } from '@reduxjs/toolkit';
import searchText, { searchTextSliceType } from './searchTextSlice';
import { ContactsApiType } from '../ContactsApi';

/**
 * The Contacts App slices.
 */

const reducer = combineReducers({
	searchText
});

export default reducer;

export type AppRootStateType = RootStateType<[searchTextSliceType]> & ContactsApiType;
