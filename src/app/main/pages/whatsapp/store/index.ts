import { combineReducers } from '@reduxjs/toolkit'
import { RootStateType } from 'app/store/types'
import searchText, { searchTextSliceType } from './searchTextSlice'

/**
 * The Contacts whatsapp store reducer.
 */

const reducer = combineReducers({
  searchText
})

export type AppRootStateType = RootStateType<[searchTextSliceType]> & any

export default reducer
