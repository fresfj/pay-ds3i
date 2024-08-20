import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PartialDeep } from 'type-fest'

export const getOrder = createAsyncThunk(
  'checkoutApp/order/getOrder',
  async (dispatch, getState) => {
    return null
  }
)

export const sendOrderToAsaas = createAsyncThunk(
  'checkoutApp/order/updateOrder',
  async (data, { dispatch, getState }) => {
    const current = new Date()
    const date = `${current.getFullYear()}-${
      current.getMonth() + 1
    }-${current.getDate()}`
    return null
  }
)
interface OrderDataProps {
  address: string
  addressNumber: string
  state: string
  neighborhood: string
  city: string
  complement: string
  zipcode: string
  cardNumber: string
  fullName: string
  email: string
  cpfCnpj: string
  phone: string
  country?: string
  paymentMethod: string
  price: string
  cvv: string
  nameOnCard: string
  expiryDate: string
  installments: string
  installmentsOptions: [any]
  useAddressForPaymentDetails: boolean
}

export const createOrder = createAsyncThunk(
  'checkoutApp/order/createOrder',
  async (orderData: PartialDeep<OrderDataProps>, { dispatch, getState }) => {
    return null
  }
)
interface OrderState {}

const orderSlice = createSlice({
  name: 'checkoutApp/order',
  initialState: null,
  reducers: {
    resetOrder: () => null,
    refreshOrder: (state, action: PayloadAction<OrderState>) => {
      return action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createOrder.fulfilled, (state, action) => action.payload)
      .addCase(sendOrderToAsaas.fulfilled, (state, action) => action.payload)
      .addCase(getOrder.pending, (state, action) => null)
      .addCase(getOrder.fulfilled, (state, action) => action.payload)
  }
})

export const { resetOrder, refreshOrder } = orderSlice.actions
export default orderSlice.reducer
