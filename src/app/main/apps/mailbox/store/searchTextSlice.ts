import { createSlice } from '@reduxjs/toolkit';
import { appSelector } from 'app/store/store';
import { AppRootStateType } from '.';

const initialState = '';

/**
 * The Contacts App Contacts slice.
 */
export const searchTextSlice = createSlice({
	name: 'mailboxApp/searchText',
	initialState,
	reducers: {
		setSearchText: {
			reducer: (state, action) => action.payload as string,
			prepare: (event: React.ChangeEvent<HTMLInputElement>) => ({
				payload: event.target.value || '',
				meta: undefined,
				error: null
			})
		}
	}
});

export const { setSearchText } = searchTextSlice.actions;

export const selectSearchText = appSelector((state: AppRootStateType) => state.mailboxApp?.searchText);

export type searchTextSliceType = typeof searchTextSlice;

const searchTextReducer = searchTextSlice.reducer;

export default searchTextReducer;
