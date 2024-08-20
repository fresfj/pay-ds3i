import { createSelector, createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import { appSelector } from 'app/store/store';
import { AppRootStateType } from './index';
import { NotesNote, RouteParams, selectNoteList } from '../NotesApi';

const initialState: {
	noteDialogId: string | null;
	labelsDialogOpen: boolean;
} = {
	noteDialogId: null,
	labelsDialogOpen: false
};

/**
 * The Notes App notes slice.
 */
export const dialogsSlice = createSlice({
	name: 'notesApp/dialogs',
	initialState,
	reducers: {
		openNoteDialog: (state, action) => {
			state.noteDialogId = action.payload as string;
		},
		closeNoteDialog: (state) => {
			state.noteDialogId = null;
		},
		openLabelsDialog: (state) => {
			state.labelsDialogOpen = true;
		},
		closeLabelsDialog: (state) => {
			state.labelsDialogOpen = false;
		}
	}
});

export const { openNoteDialog, closeNoteDialog, closeLabelsDialog, openLabelsDialog } = dialogsSlice.actions;

export const selectNoteDialogId = appSelector((state: AppRootStateType) => state.notesApp?.dialogs?.noteDialogId);

export const selectDialogNote = (routeParams: RouteParams) =>
	createSelector([selectNoteDialogId, selectNoteList(routeParams)], (noteId: string, notes: NotesNote[]) => {
		return _.find(notes, { id: noteId });
	});

export const selectLabelsDialogOpen = (state: AppRootStateType) => state.notesApp?.dialogs?.labelsDialogOpen;

export type dialogsSliceType = typeof dialogsSlice;

export default dialogsSlice.reducer;
