import { combineReducers } from '@reduxjs/toolkit';
import eventDialog from './eventDialogSlice';
import selectedLabels from './selectedLabelsSlice';

/**
 * The Calendar App reducer.
 */
const reducer = combineReducers({ eventDialog, selectedLabels });

export default reducer;
