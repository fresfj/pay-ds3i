import { createSlice } from '@reduxjs/toolkit'
import { createSelector } from 'reselect'
const CART_STORAGE_KEY = 'shopApp_cart'

export const getStoredCart = () => {
  try {
    const storedCart = localStorage.getItem(CART_STORAGE_KEY)
    return storedCart ? JSON.parse(storedCart) : undefined
  } catch (error) {
    console.error('Error getting stored cart:', error)
    return undefined
  }
}

const saveCartToStorage = state => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem(CART_STORAGE_KEY, serializedState)
  } catch (error) {
    console.error('Error saving cart to storage:', error)
  }
}

const initialState = getStoredCart() || {
  customer: {},
  products: [],
  quantity: 0,
  discount: { value: 0, code: '', applied: '' },
  subTotal: 0,
  total: 0,
  address: {},
  shipping: { value: 0, delivery: false, title: '' }
}

const cartSlice = createSlice({
  name: 'shopApp/cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemExists = state.products.find(
        item => item.id === action.payload.id
      )
      if (itemExists) {
        itemExists.quantity++
      } else {
        state.products.push({
          ...action.payload,
          quantity: action.payload?.quantity > 1 ? action.payload.quantity : 1
        })
      }
      updateCartTotals(state)
      saveCartToStorage(state)
    },
    incrementQuantity: (state, action) => {
      const item = state.products.find(item => item.id === action.payload)
      item.quantity++
      updateCartTotals(state)
      saveCartToStorage(state)
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
      updateCartTotals(state)
      saveCartToStorage(state)
    },
    removeFromCart: (state, action) => {
      const index = state.products.findIndex(item => item.id === action.payload)
      state.products.splice(index, 1)
      updateCartTotals(state)
      saveCartToStorage(state)
    },
    setShipping: (state, action) => {
      state.shipping = action.payload
      updateCartTotals(state)
      saveCartToStorage(state)
    },
    setCustomer: (state, action) => {
      state.customer = action.payload
      saveCartToStorage(state)
    },
    setAddress: (state, action) => {
      state.address = action.payload
      updateCartTotals(state)
      saveCartToStorage(state)
    },
    addDiscount: (state, action) => {
      state.discount = action.payload
      updateCartTotals(state)
      saveCartToStorage(state)
    },
    removeDiscount: state => {
      state.discount = { value: 0, code: '', applied: '' }
      updateCartTotals(state)
      saveCartToStorage(state)
    },
    clearCart: state => {
      state.customer = {}
      state.products = []
      state.quantity = 0
      state.subTotal = 0
      state.total = 0
      state.address = {}
      state.discount = { value: 0, code: '', applied: '' }
      state.shipping = { value: 0, delivery: false, title: '' }
      saveCartToStorage(state)
    },
    getTotals(state) {
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
      state.subTotal = total
      state.total = total + state.shipping.value - state.discount.value
      saveCartToStorage(state)
    }
  }
})

const updateCartTotals = state => {
  state.subTotal = state.products.reduce(
    (acc, item) => acc + item.value * item.quantity,
    0
  )
  state.quantity = state.products.reduce((acc, item) => acc + item.quantity, 0)
  state.total = state.subTotal + state.shipping.value - state.discount.value
}

export default cartSlice.reducer

export const {
  addToCart,
  clearCart,
  addDiscount,
  setShipping,
  setAddress,
  setCustomer,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  removeDiscount,
  getTotals
} = cartSlice.actions

export const getDiscount = state => state.shopApp?.cart?.discount?.value ?? 0

export const itemsCartSelector = createSelector(
  state => state.shopApp?.cart ?? initialState,
  cart => cart
)

export const calculateTotalSelector = createSelector(
  itemsCartSelector,
  ({ products, discount, shipping }) => {
    return (
      (products?.reduce((acc, item) => acc + item.value * item.quantity, 0) ||
        0) +
      (shipping?.value || 0) -
      (discount?.value || 0)
    )
  }
)

export const calculateTotalItemsSelector = createSelector(
  itemsCartSelector,
  ({ products }) => {
    return products?.reduce((acc, item) => acc + item.quantity, 0) || 0
  }
)
