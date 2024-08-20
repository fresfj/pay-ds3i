import { createSlice } from '@reduxjs/toolkit';
import { appSelector } from 'app/store/store';
import { AppRootStateType } from '.';

const initialState = '';

export const searchTextSlice = createSlice({
	name: 'notesApp/searchText',
	initialState,
	reducers: {
		setSearchText: {
			reducer: (state, action) => action.payload as string,
			prepare: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => ({
				payload: event.target.value || '',
				meta: undefined,
				error: null
			})
		}
	}
});

export const { setSearchText } = searchTextSlice.actions;

const searchTextReducer = searchTextSlice.reducer;

export const selectSearchText = appSelector((state: AppRootStateType) => state.notesApp?.searchText);

export default searchTextReducer;

export type searchTextSliceType = typeof searchTextSlice;
