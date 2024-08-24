import { createSlice } from '@reduxjs/toolkit'
import { RootStateType } from 'app/store/types'
import { createSelector } from 'reselect'

const cartSlice = createSlice({
  name: 'checkoutApp/cart',
  initialState: {
    customer: null,
    referral: {},
    products: [],
    quantity: 0,
    discount: { value: 0, code: '', applied: '' },
    subTotal: 0,
    total: 0,
    shipping: { value: 0, delivery: false, title: '' }
  },
  reducers: {
    addCustomer: (state, action) => {
      state.customer = action.payload
    },
    addReferral: (state, action) => {
      state.referral = action.payload
    },
    addToCart: (state, action) => {
      const itemExists = state.products.find(
        item => item.id === action.payload.id
      )
      if (itemExists) {
        //itemExists.quantity++;
      } else {
        state.products.push({ ...action.payload, quantity: 1 })
      }
      updateCartTotals(state)
    },
    updateProduct: (state, action) => {
      const { id, newValue } = action.payload
      const productToUpdate = state.products.find(item => item.id === id)
      if (productToUpdate) {
        productToUpdate.value = newValue
        updateCartTotals(state)
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.products.find(item => item.id === action.payload)
      item.quantity++
    },
    decrementQuantity: (state, action) => {
      const item = state.products.find(item => item.id === action.payload)
      if (item.quantity === 1) {
        const index = state.products.findIndex(
          item => item.id === action.payload
        )
        state.products.splice(index, 1)
      } else {
        item.quantity--
      }
    },
    removeFromCart: (state, action) => {
      const index = state.products.findIndex(item => item.id === action.payload)
      state.products.splice(index, 1)
      updateCartTotals(state)
    },
    clearCart: state => {
      state.products = []
      state.quantity = 0
      state.discount = { value: 0, code: '', applied: '' }
      state.subTotal = 0
      state.total = 0
      state.shipping = { value: 0, delivery: false, title: '' }
    },
    setShipping: (state, action) => {
      state.shipping = action.payload
      updateCartTotals(state)
    },
    addDiscount: (state, action) => {
      state.discount = action.payload
      updateCartTotals(state)
    },
    removeDiscount: state => {
      state.discount = { value: 0, code: '', applied: '' }
      updateCartTotals(state)
    },
    getTotals(state: any) {
      let { total, quantity } = state.products.reduce(
        (cartTotal, cartItem) => {
          const { value, quantity } = cartItem
          const valueTotal = value * quantity

          cartTotal.total += valueTotal
          cartTotal.quantity += quantity

          return cartTotal
        },
        {
          total: 0,
          quantity: 0
        }
      )
      state.quantity = quantity
      state.subTotal = total.toFixed(2)
      state.total = (
        total +
        state.shipping.value -
        state.discount.value
      ).toFixed(2)
    }
  }
})

const updateCartTotals = state => {
  state.subTotal = state.products.reduce(
    (acc, item) => acc + item.value * item.quantity,
    0
  )
  state.quantity = state.products.reduce((acc, item) => acc + item.quantity, 0)
  state.total = (
    state.subTotal +
    state.shipping.value -
    state.discount.value
  ).toFixed(2)
}

export type cartSliceType = typeof cartSlice

export default cartSlice.reducer

export const {
  addToCart,
  addCustomer,
  addReferral,
  addDiscount,
  setShipping,
  updateProduct,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  removeDiscount,
  clearCart,
  getTotals
} = cartSlice.actions

export const getDiscount = state => state.checkoutApp.cart.discount.value
export const itemsCartSelector = state => state.checkoutApp.cart

export const calculateTotalSelector = createSelector(
  itemsCartSelector,
  ({ products, discount, shipping }) => {
    return (
      products.reduce((acc, item) => acc + item.value * item.quantity, 0) +
      shipping.value -
      discount.value
    )
  }
)
