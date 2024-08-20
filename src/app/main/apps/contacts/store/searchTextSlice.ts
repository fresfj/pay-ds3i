import { createSlice } from '@reduxjs/toolkit';
import { appSelector } from 'app/store/store';
import { AppRootStateType } from '.';

const initialState = '';

/**
 * The Contacts App Contacts slice.
 */
export const searchTextSlice = createSlice({
	name: 'contactsApp/searchText',
	initialState,
	reducers: {
		setSearchText: {
			reducer: (state, action) => action.payload as string,
			prepare: (event: React.ChangeEvent<HTMLInputElement>) => ({
				payload: `${event?.target?.value}` || initialState,
				meta: undefined,
				error: null
			})
		},
		resetSearchText: () => initialState
	}
});

export const { setSearchText, resetSearchText } = searchTextSlice.actions;

export type searchTextSliceType = typeof searchTextSlice;

export const selectSearchText = appSelector((state: AppRootStateType) => state.contactsApp?.searchText);

const searchTextReducer = searchTextSlice.reducer;

export default searchTextReducer;
