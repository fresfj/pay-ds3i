import { combineReducers } from '@reduxjs/toolkit'
import { RootStateType } from 'app/store/types'
import searchText, { searchTextSliceType } from './searchTextSlice'
import instance from './InstanceSlice'

/**
 * The Contacts whatsapp store reducer.
 */

const reducer = combineReducers({
  searchText,
  instance
})

export type AppRootStateType = RootStateType<[searchTextSliceType]> & any

export default reducer
