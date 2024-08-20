import { combineReducers } from '@reduxjs/toolkit'
import { RootStateType } from 'app/store/types'
import searchText, { searchTextSliceType } from './searchTextSlice'
import { Account } from '../AccountApi'

/**
 * The Account store reducer.
 */

const reducer = combineReducers({
  searchText
})

export type AppRootStateType = RootStateType<[searchTextSliceType]> & Account

export default reducer
