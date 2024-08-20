import { combineReducers } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
// import { removeReducer } from 'app/store';
import dialogs, { dialogsSliceType } from './dialogsSlice';
import searchText, { searchTextSliceType } from './searchTextSlice';
import variateDesc, { variateDescSliceType } from './variateDescSlice';
import { NotesApiType } from '../NotesApi';
/**
 * The Notes store reducer.
 */
const reducer = combineReducers({
	searchText,
	variateDesc,
	dialogs
});

export type AppRootStateType = RootStateType<[searchTextSliceType, variateDescSliceType, dialogsSliceType]> &
	NotesApiType;
//
// if (module.hot && module.hot.status() === 'apply') {
// 	removeReducer('notesApp');
// 	// replaceReducer(
// 	// 	'notesApp',
// 	// 	combineReducers(
// 	// 		_.cloneDeep({
// 	// 			searchText,
// 	// 			variateDesc,
// 	// 			dialogs
// 	// 		})
// 	// 	)
// 	// );
// }
// const createdReducer = reducer;
export default reducer;
