import { createSlice } from '@reduxjs/toolkit';
import _ from '@lodash';
import { AppRootStateType } from '.';
import { MailboxMail } from '../MailboxApi';

const initialState: string[] = [];

/**
 * The Mailbox App selectedMailIds slice.
 */
export const selectedMailIdsSlice = createSlice({
	name: 'mailboxApp/selectedMailIds',
	initialState,
	reducers: {
		setSelectedMailIds: (state, action) => action.payload as string[],
		selectAllMails: (state, action) => {
			const mailList = action.payload as MailboxMail[];
			return mailList.map((mail) => mail.id);
		},
		deselectAllMails: () => initialState,
		toggleInSelectedMails: (state, action) => {
			const mailId = action.payload as string;
			return _.xor(state, [mailId]);
		}
	}
});

export const { setSelectedMailIds, toggleInSelectedMails, deselectAllMails } = selectedMailIdsSlice.actions;

const selectedMailIdsReducer = selectedMailIdsSlice.reducer;

export type selectedMailIdsSliceType = typeof selectedMailIdsSlice;

export default selectedMailIdsReducer;

export const selectSelectedMailIds = (state: AppRootStateType) => state.mailboxApp?.selectedMailIds;
