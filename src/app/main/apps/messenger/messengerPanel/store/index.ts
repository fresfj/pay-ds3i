import { combineReducers } from '@reduxjs/toolkit'
import selectedContactId from './selectedContactIdSlice'
import state from './stateSlice'
import chat from './chatSlice'
/**
 * Chat panel reducer.
 */
const reducer = combineReducers({
  selectedContactId,
  chat,
  state
})

export default reducer
