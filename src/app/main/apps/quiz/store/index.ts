import { combineReducers } from '@reduxjs/toolkit'
import { RootStateType } from 'app/store/types'
import quiz, { selectedItemIdSliceType } from './selectedItemIdSlice'

/**
 * The File Manager store reducer.
 */
const reducer = combineReducers({
  quiz
})

export type AppRootStateType = RootStateType<selectedItemIdSliceType>

export default reducer
