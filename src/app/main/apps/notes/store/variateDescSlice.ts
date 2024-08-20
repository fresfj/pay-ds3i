import { createSlice } from '@reduxjs/toolkit';
import { appSelector } from 'app/store/store';
import { AppRootStateType } from '.';

const initialState = false;

/**
 * The Notes variateDescSlice.
 */
export const variateDescSlice = createSlice({
	name: 'notesApp/variateDesc',
	initialState,
	reducers: {
		toggleVariateDescSize: (state) => !state
	}
});

export const { toggleVariateDescSize } = variateDescSlice.actions;

export type variateDescSliceType = typeof variateDescSlice;

export const selectVariateDescSize = appSelector((state: AppRootStateType) => state.notesApp?.variateDesc);

export default variateDescSlice.reducer;
