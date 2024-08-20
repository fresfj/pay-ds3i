import { RootStateType } from 'app/store/types'
import { combineReducers } from '@reduxjs/toolkit'
import searchText, { searchTextSliceType } from './searchTextSlice'
import cart from './cartSlice'
import order from './orderSlice'
/**
 * The Contacts App slices.
 */

const reducer = combineReducers({
  searchText,
  cart,
  order
})

export default reducer
export type AppRootStateType = RootStateType<[searchTextSliceType]>
