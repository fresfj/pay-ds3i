import { createSlice } from '@reduxjs/toolkit';
import { appSelector } from 'app/store/store';
import { AppRootStateType } from '.';

const initialState = '';

/**
 * The ECommerce App SearchText.
 */
export const searchTextSlice = createSlice({
	name: 'eCommerceApp/searchText',
	initialState,
	reducers: {
		resetSearchText: () => initialState,
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

export const { setSearchText, resetSearchText } = searchTextSlice.actions;

export type searchTextSliceType = typeof searchTextSlice;

export const selectSearchText = appSelector((state: AppRootStateType) => state.eCommerceApp?.searchText);

const searchTextReducer = searchTextSlice.reducer;

export default searchTextReducer;
