import { combineReducers } from '@reduxjs/toolkit'
import { RootStateType } from 'app/store/types'
import searchText, { searchTextSliceType } from './searchTextSlice'
import { InvoiceApiType } from '../InvoiceApi'

/**
 * The E-Commerce store reducer.
 */

const reducer = combineReducers({
  searchText
})

export type AppRootStateType = RootStateType<[searchTextSliceType]> &
  InvoiceApiType

export default reducer
