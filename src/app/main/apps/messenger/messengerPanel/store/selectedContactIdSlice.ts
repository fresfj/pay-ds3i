import { createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import { appSelector } from 'app/store/store';

export type AppRootStateType = RootStateType<contactsSliceType>;

const initialState: string = '';

/**
 * The slice for the contacts.
 */
export const selectedContactIdSlice = createSlice({
	name: 'chatPanel/selectedContactId',
	initialState,
	reducers: {
		setSelectedContactId: (state, action) => action.payload as string,
		removeSelectedContactId: () => ''
	}
});

export const { setSelectedContactId } = selectedContactIdSlice.actions;

export const selectSelectedContactId = appSelector((state: AppRootStateType) => state.chatPanel.selectedContactId);

export type contactsSliceType = typeof selectedContactIdSlice;

export default selectedContactIdSlice.reducer;
