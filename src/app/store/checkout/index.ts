import { combineReducers } from '@reduxjs/toolkit'
import cart from './cartSlice'
import order from './orderSlice'

const store = combineReducers({
  cart,
  order
})

export default store
