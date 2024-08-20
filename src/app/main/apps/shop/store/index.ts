import { combineReducers } from '@reduxjs/toolkit'
import { RootStateType } from 'app/store/types'
import searchText, { searchTextSliceType } from './searchTextSlice'
import filters, { filtersSliceType } from './filtersSlice'
import cart from './cartSlice'

import { ShopApiType } from '../ShopApi'

/**
 * The Shop store reducer.
 */

const reducer = combineReducers({
  searchText,
  filters,
  cart
})

export type AppRootStateType = RootStateType<
  [searchTextSliceType, filtersSliceType]
> &
  ShopApiType

export default reducer
