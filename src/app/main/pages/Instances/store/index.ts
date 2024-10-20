import { combineReducers } from '@reduxjs/toolkit'
import { RootStateType } from 'app/store/types'
import searchText, { searchTextSliceType } from './searchTextSlice'
import instances from './InstancesSlice'
import { InstanceApiType } from '../InstanceApi'

/**
 * The Instances store reducer.
 */

const reducer = combineReducers({
  searchText,
  instances
})

export type AppRootStateType = RootStateType<[searchTextSliceType]> &
  InstanceApiType

export default reducer
