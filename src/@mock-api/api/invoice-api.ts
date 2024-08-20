import _ from '@lodash'
import FuseUtils from '@fuse/utils'
import mockApi from '../mock-api.json'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'
import {
  EcommerceCoupon,
  EcommerceOrder,
  EcommerceProduct
} from '../../app/main/apps/e-commerce/ECommerceApi'

import firebase from 'firebase/compat/app'
import axios from 'axios'
import format from 'date-fns/format'
import { addMonths, endOfMonth, startOfMonth, subDays } from 'date-fns'
const API_BACKEND = import.meta.env.VITE_API_BACKEND

let productsDB = mockApi.components.examples.ecommerce_products
  .value as EcommerceProduct[]
let ordersDB = mockApi.components.examples.ecommerce_orders
  .value as EcommerceOrder[]

export const invoiceApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onGet('/invoice/subscriptions').reply(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${API_BACKEND}finance`, {
          params: {
            sort: 'dateCreated',
            status: 'ACTIVE',
            offset: 0,
            limit: 100
          }
        })
        resolve([200, data])
      } catch (error) {
        resolve([404, 'Requested product do not exist.'])
      }
    })
  })

  mock.onGet('/invoice/orders/:id').reply(async config => {
    const { id } = config.params as Params
    const data = { ...JSON.parse(config.data as string) } as any

    const ordersRef = firebase
      .firestore()
      .collection('orders')
      .where('payment.id', '==', `sub_${id}`)
      .where('payment.customer', '==', `cus_${data.customer}`)

    return new Promise(async (resolve, reject) => {
      await ordersRef
        .get()
        .then(querySnapshot => {
          const order = []
          querySnapshot.forEach(doc => {
            order.push(doc.data())
          })

          resolve([200, order[0]])
        })
        .catch(error => {
          resolve([404, 'Requested order do not exist.'])
        })
    })
  })
}
