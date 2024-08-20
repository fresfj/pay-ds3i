import { RootStateType } from 'app/store/types'
import { combineReducers } from '@reduxjs/toolkit'
import searchText, { searchTextSliceType } from './searchTextSlice'
import { CustomersApiType } from '../CustomersApi'

/**
 * The Customers App slices.
 */

const reducer = combineReducers({
  searchText
})

export default reducer

export type AppRootStateType = RootStateType<[searchTextSliceType]> &
  CustomersApiType
