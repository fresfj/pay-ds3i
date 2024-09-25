import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter
} from '@reduxjs/toolkit'
import { PartialDeep } from 'type-fest'
import { AppThunk, RootStateType } from 'app/store/types'
import axios from 'axios'
import { cartSliceType } from './cartSlice'
import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import FuseUtils from '@fuse/utils'

const API_BACKEND = import.meta.env.VITE_API_BACKEND
const options = { headers: { 'Content-Type': 'application/json' } }

export interface OrderDataProps {
  customerId?: string
  abandonedId?: string
  cardDocument?: string
  address: string
  addressNumber: string
  state: string
  neighborhood: string
  city: string
  birthday: string
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
  installments: number
  installmentsOptions: [any]
  invoiceAddress?: []
  shippingAddress?: []
  useAddressForPaymentDetails: boolean
  createdAt?: string
}

export const getOrder = createAsyncThunk(
  'checkoutApp/order/getOrder',
  async (orderId: string, { dispatch, getState }) => {
    const firestore = firebase.firestore()
    const orderRef = firestore.collection('orders').doc(orderId)

    return new Promise((resolve, reject) => {
      orderRef.onSnapshot(
        snapshot => {
          if (snapshot.exists) {
            const data = snapshot.data()
            if (data && Array.isArray(data.cart.products)) {
              const updatedProducts = data.cart.products.map(product => {
                if (product.updatedAt instanceof firebase.firestore.Timestamp) {
                  return {
                    ...product,
                    updatedAt: product.updatedAt.toDate().toISOString()
                  }
                }
                return product
              })
              const updatedData = {
                ...data,
                createdAt: data.createdAt.toDate().toISOString(),
                updatedAt: data.updatedAt.toDate().toISOString(),
                cart: {
                  ...data.cart,
                  products: updatedProducts
                }
              }
              dispatch(refreshOrder(updatedData))
            } else {
              reject()
            }
          } else {
            reject()
          }
        },
        error => {
          reject(error)
        }
      )
    })
  }
)

export const sendOrderToAsaas = createAsyncThunk(
  'checkoutApp/order/sendOrderToAsaas',
  async (data: any, { dispatch, getState }) => {
    const current = new Date()
    const date = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`
    const nextMonth = `${current.getFullYear()}-${current.getMonth() + 2}-${current.getDate()}`
    const thisMonth = `${current.getFullYear()}-${current.getMonth() + 1}-${current.getDate()}`

    let payRef = null
    let dataCard = null

    const { cart, customer } = data
    const {
      paymentMethod,
      installments,
      installmentValue,
      total,
      discount,
      products
    } = cart

    if (paymentMethod === 'card') {
      const [expiryMonth, expiryYear] = cart?.cardExpiry.split('/')
      dataCard = {
        creditCard: {
          holderName: cart?.cardName,
          number: cart?.cardNumber,
          expiryMonth,
          expiryYear: `20${expiryYear}`,
          ccv: cart?.cardCCV
        },
        creditCardHolderInfo: {
          name: customer.name,
          email: customer.email,
          cpfCnpj: customer.cpfCnpj,
          postalCode: customer.postalCode,
          addressNumber: customer.addressNumber,
          phone: customer.phone
        }
      }
    }

    const dataPayments = {
      customer: customer.id,
      billingType:
        paymentMethod.toUpperCase() === 'CARD'
          ? 'CREDIT_CARD'
          : paymentMethod.toUpperCase(),
      dueDate: date,
      description: cart.products[0].name,
      cycle: 'MONTHLY',
      nextDueDate: cart.discount.value > 0 ? nextMonth : thisMonth,
      maxPayments: 12,
      externalReference: cart.products[0].id,
      postalService: false,
      ...dataCard,
      value: cart?.total,
      remoteIp: '8.8.8.8'
    }

    const split = [
      {
        walletId: '6bc2e43b-264f-4b14-87c9-4e2981c1f44c', //32408b82-88ee-4120-ad1e-c959d1c55821', // Homologação
        //walletId: 'e82684b8-804d-4788-a593-b9ede5cc19c2', //Produção
        percentualValue: 95
      }
    ]

    const firestore = firebase.firestore()
    const timestamp = firebase.firestore.Timestamp.now()
    const id: string = FuseUtils.generateGUID()

    let payment: any

    const handlePaymentError = async (err: any) => {
      const paymentErr = {
        status: err.response.status,
        description: err.response.data
      }

      await firestore
        .collection('abandoned')
        .doc(data.abandonedId)
        .update({
          ...data,
          payment: paymentErr,
          updatedAt: timestamp
        })

      return paymentErr
    }

    const processPayment = async (
      paymentData: any,
      isSubscription: boolean
    ) => {
      try {
        const response = await axios.post(`${API_BACKEND}payments`, paymentData)
        if (isSubscription) {
          return await axios.post(`${API_BACKEND}subscriptions`, {
            ...dataPayments,
            value: (
              parseFloat(cart?.subTotal) + parseFloat(cart?.shipping.value)
            ).toFixed(2),
            customerInformation: customer,
            cart: cart
          })
        }
        return response
      } catch (err) {
        await handlePaymentError(err)
        throw err
      }
    }

    try {
      const commonPaymentData = {
        ...dataPayments,
        split,
        customerInformation: customer,
        cart
      }

      if (!products[0]?.recurrent) {
        const installmentCount =
          paymentMethod.toUpperCase() === 'CARD' && installments > 1
            ? installments
            : 0
        const installmentValueProcessed =
          paymentMethod.toUpperCase() === 'CARD' ? installmentValue : total

        const newDataPay = {
          ...commonPaymentData,
          authorizeOnly: true,
          totalValue: total,
          installmentCount,
          installmentValue: installmentValueProcessed,
          value: total
        }

        payment = await processPayment(newDataPay, false)
      } else {
        payment = await processPayment(commonPaymentData, true)
      }

      const state: any = {
        id,
        customer: customer,
        payment: payment.data,
        cart: cart
      }

      await firestore
        .collection('orders')
        .doc(id)
        .set({ ...state, createdAt: timestamp })

      const cards = {
        id: FuseUtils.generateGUID(),
        paymentDefault: true,
        billingType: paymentMethod.toUpperCase(),
        creditCard: {
          holderName: cart?.cardName,
          number: cart?.cardNumber,
          expiry: cart?.cardExpiry,
          ccv: cart?.cardCCV
        },
        creditCardHolderInfo: {
          name: customer.name,
          email: customer.email,
          cpfCnpj: customer.cpfCnpj,
          postalCode: customer.postalCode,
          addressNumber: customer.addressNumber,
          phone: customer.phone
        }
      }

      await firestore
        .collection('customers')
        .doc(customer.customerId)
        .update({
          updatedAt: timestamp,
          customerId: customer.id,
          received: [payment.data],
          paymentMethods: firebase.firestore.FieldValue.arrayUnion(cards),
          orders: firebase.firestore.FieldValue.arrayUnion(id)
        })

      await firestore.collection('abandoned').doc(data.abandonedId).delete()

      return state
    } catch (error) {
      console.error('Error processing payment:', error)
    }
  }
)

export const removeCart = createAsyncThunk(
  'checkoutApp/order/removeCart',
  async (cartId: string, { dispatch, getState }) => {
    if (!firebase.apps.length) {
      return false
    }

    const firestore = firebase.firestore()
    const cartRef = firestore.collection('carts').doc(cartId)

    return new Promise(async (resolve, reject) => {
      await cartRef
        .delete()
        .then(() => {
          resolve('delete com sucesso' as any)
        })
        .catch(error => {
          reject('Erro ao delete os dados')
        })
    })
  }
)

export const createOrderCartToCustomer = createAsyncThunk(
  'checkoutApp/order/createOrderCartToCustomer',
  async (orderData: PartialDeep<OrderDataProps>, { dispatch, getState }) => {
    const AppState = getState() as AppCheckoutStateType
    const { cart } = AppState.checkoutApp

    if (!firebase.apps.length) {
      return false
    }

    const firestore = firebase.firestore()
    const cartRef = firestore.collection('carts')
    const timestamp = firebase.firestore.Timestamp.now()
    const id: string = FuseUtils.generateGUID()

    const { customer, ...cartAlt } = cart

    const data: any = {
      id,
      customer: cart.customer,
      cart: cartAlt
    }

    return new Promise(async (resolve, reject) => {
      await cartRef
        .doc(id)
        .set({ ...data, createdAt: timestamp })
        .then(doc => {
          resolve(data)
        })
        .catch(error => {
          resolve(error)
        })
    })
  }
)

type AppCheckoutStateType = RootStateType<cartSliceType>

export const createOrder = createAsyncThunk(
  'checkoutApp/order/createOrder',
  async (orderData: PartialDeep<OrderDataProps>, { dispatch, getState }) => {
    const AppState = getState() as AppCheckoutStateType
    const { cart } = AppState.checkoutApp
    let installment: any

    if (orderData?.installments) {
      const installmentsSelected =
        orderData?.installmentsOptions[orderData?.installments - 1]
      const installmentTotal = installmentsSelected.total
      const installmentValue = installmentsSelected.value

      installment = {
        installments: orderData?.installments,
        installmentTotal,
        installmentValue
      }
    }
    const customerData = {
      customerId: orderData.customerId,
      avatar: null,
      background: null,
      name: orderData.fullName,
      cpfCnpj: orderData.cpfCnpj,
      emails: [{ email: orderData.email, label: 'default' }],
      phoneNumbers: [
        { country: 'br', phoneNumber: orderData.phone, label: 'default' }
      ],
      title: '',
      company: '',
      birthday: orderData?.birthday,
      email: orderData.email,
      phone: orderData.phone,
      address: orderData.address,
      addressNumber: orderData.addressNumber,
      complement: orderData.complement,
      neighborhood: orderData.neighborhood,
      city: orderData.city,
      state: orderData.state,
      postalCode: orderData.zipcode,
      invoiceAddress: orderData.invoiceAddress,
      shippingAddress: orderData.shippingAddress,
      notes: '',
      tags: []
    }
    const params = {
      email: orderData.email,
      cpfCnpj: orderData.cpfCnpj
    }
    const cartData = {
      ...cart,
      paymentMethod: orderData.paymentMethod,
      cardName: orderData?.nameOnCard,
      cardNumber: orderData?.cardNumber,
      cardExpiry: orderData?.expiryDate,
      cardDocument: orderData?.cardDocument,
      cardCCV: orderData?.cvv,
      observations: 'SISTEMA CHECKOUT DE PAGAMENTO',
      ...installment
    }

    async function sendClient(data: any) {
      await axios.post(`https://ick.richeli.dev/api/checkout/customer`, data)
    }

    await axios
      .get(`${API_BACKEND}customers`, { params })
      .then(async customer => {
        const order: any = {
          customer: {
            ...customerData,
            id: customer.data.id,
            blingId: customer.data?.blingId ? customer.data.blingId : ''
          },
          cart: cartData,
          abandonedId: orderData?.abandonedId
        }

        sendClient(customerData)

        return await dispatch(sendOrderToAsaas(order)).then(
          async ({ payload }) => payload
        )
      })
      .catch(async err => {
        if (err?.response.status === 404 || err?.response.status === 500) {
          const customer = await axios.post(
            `${API_BACKEND}customers`,
            customerData
          )

          sendClient(customerData)

          const order: any = {
            customer: {
              ...customerData,
              id: customer.data.id,
              blingId: customer.data?.blingId ? customer.data.blingId : ''
            },
            cart: cartData,
            abandonedId: orderData?.abandonedId
          }

          return await dispatch(sendOrderToAsaas(order)).then(
            async ({ payload }) => payload
          )
        } else {
          console.error(`err:`, err)
        }
      })
  }
)

const orderSlice = createSlice({
  name: 'checkoutApp/order',
  initialState: null,
  reducers: {
    resetOrder: () => null,
    refreshOrder: (state, action) => {
      return action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(createOrderCartToCustomer.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(sendOrderToAsaas.fulfilled, (state, action) => {
        return action.payload
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        return null
      })
      .addCase(getOrder.pending, (state, action) => {
        return action.payload
      })
  }
})

export const { resetOrder, refreshOrder } = orderSlice.actions
export const selectOrder = ({ checkoutApp }) => checkoutApp.order
export default orderSlice.reducer
export type orderSliceType = typeof orderSlice
