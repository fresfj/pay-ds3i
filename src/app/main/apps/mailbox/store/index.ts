import { combineReducers } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import searchText, { searchTextSliceType } from './searchTextSlice';
import selectedMailIds, { selectedMailIdsSliceType } from './selectedMailIdsSlice';
import { MailboxApiType } from '../MailboxApi';

/**
 * The Mailbox App reducer.
 */
const reducer = combineReducers({
	selectedMailIds,
	searchText
});

export type AppRootStateType = RootStateType<[searchTextSliceType, selectedMailIdsSliceType]> & MailboxApiType;

export default reducer;
