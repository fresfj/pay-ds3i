import { createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import { RootStateType } from 'app/store/types';
import { appSelector } from 'app/store/store';

type AppRootStateType = RootStateType<labelsSliceType>;

const initialState: string[] = [];

/**
 * The CalendarApp labels slice.
 */
export const selectedLabelsSlice = createSlice({
	name: 'calendarApp/selectedLabels',
	initialState,
	reducers: {
		setSelectedLabels: (state, action) => action.payload as string[],
		toggleSelectedLabels: (state, action) => _.xor(state, [action.payload]) as string[]
	}
});

export const selectSelectedLabels = appSelector((state: AppRootStateType) => state.calendarApp?.selectedLabels);

export const { toggleSelectedLabels, setSelectedLabels } = selectedLabelsSlice.actions;

export type labelsSliceType = typeof selectedLabelsSlice;

export default selectedLabelsSlice.reducer;
