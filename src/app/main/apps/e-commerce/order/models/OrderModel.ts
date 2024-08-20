import _ from '@lodash'
import { PartialDeep } from 'type-fest'
import { EcommerceOrder } from '../../ECommerceApi'

/**
 * The order model.
 */
const OrderModel = (data: PartialDeep<EcommerceOrder>): EcommerceOrder =>
  _.defaults(data || {}, {
    id: _.uniqueId('order-'),
    reference: '',
    subtotal: '',
    tax: '',
    discount: '',
    total: '',
    date: '',
    coupon: {
      applied: '',
      code: ''
    },
    customer: {
      id: null,
      firstName: '',
      lastName: '',
      avatar: '',
      company: '',
      jobTitle: '',
      email: '',
      phone: '',
      address: '',
      addressNumber: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      cpfCnpj: '',
      invoiceAddress: {
        address: '',
        lat: null,
        lng: null
      },
      shippingAddress: {
        address: '',
        lat: null,
        lng: null
      }
    },
    products: [],
    status: [],
    payment: { transactionId: '', amount: '', method: '', date: '' },
    shippingDetails: []
  })

export default OrderModel
