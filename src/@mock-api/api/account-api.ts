import mockApi from '../mock-api.json'
import _ from '@lodash'
import { TimelineResponseDataType } from '../../app/main/apps/profile/tabs/timeline/TimelineTab'
import {
  ProfileAbout,
  ProfilePhotosVideos
} from '../../app/main/apps/profile/ProfileApi'
import firebase from 'firebase/compat/app'
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter'
import axios from 'axios'
const API_BACKEND = import.meta.env.VITE_API_BACKEND
const timelineApi = mockApi.components.examples.profile_timeline
  .value as TimelineResponseDataType
const photosVideosApi = mockApi.components.examples.profile_photos_videos
  .value as ProfilePhotosVideos
const aboutApi = mockApi.components.examples.profile_about.value as ProfileAbout

export const accountApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onDelete('/account/address/:id').reply(config => {
    const { id } = config.params as Params
    const customer = JSON.parse(config.data as string) as any
    const customerRef = firebase
      .firestore()
      .collection('customers')
      .doc(customer.customerId)
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await customerRef.get()
        if (doc.exists) {
          const addresses = doc.data().addresses || []
          const updatedAddresses = addresses.filter(
            address => address.id !== customer.addressId
          )

          await customerRef.update({
            updatedAt: firebase.firestore.Timestamp.now(),
            addresses: updatedAddresses
          })

          resolve([200, customer])
        } else {
          throw new Error('Documento do cliente não encontrado')
        }
      } catch (error) {
        reject(error)
      }
    })
  })
  mock.onPut('/account/address/:id').reply(config => {
    const { id } = config.params as Params
    const customer = JSON.parse(config.data as string) as any
    delete customer.updatedAt
    const customerRef = firebase
      .firestore()
      .collection('customers')
      .doc(customer.customerId)

    return new Promise(async (resolve, reject) => {
      customerRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const addresses = doc.data().addresses || []
            const updatedAddresses = addresses.map(address => {
              if (address.addressDefault && address.id !== customer.addressId) {
                return {
                  ...address,
                  addressDefault: false
                }
              } else if (address.id === customer.addressId) {
                return {
                  ...address,
                  addressDefault: true
                }
              } else {
                return address
              }
            })
            return customerRef.update({
              updatedAt: firebase.firestore.Timestamp.now(),
              addresses: updatedAddresses
            })
          } else {
            throw new Error('Documento do cliente não encontrado')
          }
        })
        .then(() => {
          resolve([200, customer])
        })
        .catch(error => {
          reject(error)
        })
    })
  })
  mock.onPost('/account/address').reply(({ data }) => {
    const customer = { ...JSON.parse(data as string) } as any
    delete customer.updatedAt
    const customerRef = firebase
      .firestore()
      .collection('customers')
      .doc(customer.customerId)

    return new Promise(async (resolve, reject) => {
      customerRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const addresses = doc.data().addresses || []
            const updatedAddresses = addresses.map(address => {
              if (address.addressDefault && customer.data.addressDefault) {
                return {
                  ...address,
                  addressDefault: false
                }
              } else {
                return address
              }
            })
            updatedAddresses.push({
              ...customer.data,
              addressFormatted: customer.addressFormatted
            })
            return customerRef.update({
              updatedAt: firebase.firestore.Timestamp.now(),
              addresses: updatedAddresses
            })
          } else {
            throw new Error('Documento do cliente não encontrado')
          }
        })
        .then(() => {
          resolve([200, customer])
        })
        .catch(error => {
          reject(error)
        })
    })
  })
  mock.onPut('/account/payment/:id').reply(config => {
    const { id } = config.params as Params
    const customer = JSON.parse(config.data as string) as any
    delete customer.updatedAt
    const customerRef = firebase
      .firestore()
      .collection('customers')
      .doc(customer.customerId)

    return new Promise(async (resolve, reject) => {
      customerRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const payment = doc.data().paymentMethods || []
            const updatedPayment = payment.map(payment => {
              if (payment.paymentDefault && payment.id !== customer.paymentId) {
                return {
                  ...payment,
                  paymentDefault: false
                }
              } else if (payment.id === customer.paymentId) {
                return {
                  ...payment,
                  paymentDefault: true
                }
              } else {
                return payment
              }
            })
            return customerRef.update({
              updatedAt: firebase.firestore.Timestamp.now(),
              paymentMethods: updatedPayment
            })
          } else {
            throw new Error('Documento do cliente não encontrado')
          }
        })
        .then(() => {
          resolve([200, customer])
        })
        .catch(error => {
          reject(error)
        })
    })
  })
  mock.onPost('/account/payment').reply(({ data }) => {
    const customer = { ...JSON.parse(data as string) } as any
    delete customer.updatedAt
    const customerRef = firebase
      .firestore()
      .collection('customers')
      .doc(customer.customerId)

    return new Promise(async (resolve, reject) => {
      customerRef
        .get()
        .then(doc => {
          if (doc.exists) {
            const payment = doc.data().paymentMethods || []
            const updatedPayment = payment.map(address => {
              if (address.addressDefault && customer.data.paymentDefault) {
                return {
                  ...address,
                  paymentDefault: false
                }
              } else {
                return address
              }
            })
            updatedPayment.push({
              ...customer.data
            })
            return customerRef.update({
              updatedAt: firebase.firestore.Timestamp.now(),
              paymentMethods: updatedPayment
            })
          } else {
            throw new Error('Documento do cliente não encontrado')
          }
        })
        .then(() => {
          resolve([200, customer])
        })
        .catch(error => {
          reject(error)
        })
    })
  })
  mock.onPut('/account/:id').reply(config => {
    const { id } = config.params as Params
    const customer = JSON.parse(config.data as string) as any
    delete customer.createdAt
    const customerRef = firebase.firestore().collection('customers').doc(id)
    return new Promise(async (resolve, reject) => {
      customerRef
        .get()
        .then(doc => {
          if (doc.exists) {
            return customerRef.update({
              ...customer,
              updatedAt: firebase.firestore.Timestamp.now()
            })
          } else {
            throw new Error('Documento do cliente não encontrado')
          }
        })
        .then(() => {
          resolve([200, customer])
        })
        .catch(error => {
          reject(error)
        })
    })
  })
  mock.onDelete('/account/:id').reply(config => {
    const { id } = config.params as Params

    return [200, id]
  })
  mock.onPut('/account/plan/:id').reply(async config => {
    const data = JSON.parse(config.data as string) as any
    const subscription = await axios.put(`${API_BACKEND}subscriptions`, data)

    if (subscription.status !== 200) {
      return [500, 'Error in subscription']
    }

    return new Promise(async (resolve, reject) => {
      firebase
        .firestore()
        .collection(`customers`)
        .doc(data.customerId)
        .update({
          received: [subscription.data],
          updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        })
        .then(() => {
          resolve([200, subscription.data])
        })
        .catch(err => {
          reject([200, err])
        })
    })
  })

  mock.onGet('/account/timeline').reply(() => {
    return [200, timelineApi]
  })

  mock.onGet('/account/photos-videos').reply(() => {
    return [200, photosVideosApi]
  })

  mock.onGet('/account/about').reply(() => {
    return [200, aboutApi]
  })

  mock.onGet('/account/orders').reply(config => {
    const { account }: any = config.params as Params

    const ordersRef = firebase
      .firestore()
      .collection('orders')
      .where('customer.email', '==', account.data.email)

    return new Promise(async (resolve, reject) => {
      await ordersRef
        .get()
        .then(async querySnapshot => {
          const newData = querySnapshot.docs.map(doc => {
            const products = []
            doc.data().cart.products.map((itens: any) => {
              products.push({
                id: itens.id,
                name: itens.name ? itens.name : itens.title,
                price: itens.value,
                quantity: itens.quantity,
                total: itens.value,
                image: itens.image
              })
            })

            const ordeAdd = {
              reference: doc.data().payment?.invoiceNumber
                ? doc.data().payment?.invoiceNumber
                : doc.data().payment?.id
                  ? doc.data().payment?.id.replace('sub_', '')
                  : doc.data().id,
              id: doc.data().id,
              subtotal: doc.data().cart.subTotal,
              tax: '0',
              discount: doc.data().cart.discount.value,
              total: doc.data().cart?.total,
              date: new Date(doc.data().createdAt.toDate()),
              customer: {
                id: doc.data().customer?.id,
                firstName: doc.data().customer?.firstName
                  ? doc.data().customer?.firstName
                  : doc.data().customer?.name,
                cpfCnpj: doc.data().customer?.cpfCnpj,
                email: doc.data().customer?.email,
                phone: doc.data().customer?.phone,
                invoiceAddress: {
                  address: doc.data().customer?.invoiceAddress?.address,
                  lat: doc.data().customer?.invoiceAddress?.lat,
                  lng: doc.data().customer?.invoiceAddress?.lng
                },
                shippingAddress: {
                  address: doc.data().customer?.shippingAddress?.address,
                  lat: doc.data().customer?.shippingAddress?.lat,
                  lng: doc.data().customer?.shippingAddress?.lng
                }
              },
              products,
              status: [
                {
                  id: 1,
                  name: doc.data().payment.status,
                  date: doc.data().payment.dueDate
                }
              ],
              payment: {
                transactionId: doc.data().payment.id,
                creditCard: doc.data().payment?.creditCard,
                amount: doc.data().payment.value,
                method: doc.data().payment.billingType,
                date: doc.data().payment.dueDate
              },
              shopping: doc.data().cart?.shopping,
              shippingDetails: [
                {
                  tracking: '',
                  carrier: '',
                  weight: '',
                  fee: '',
                  date: ''
                }
              ]
            }
            return { ...ordeAdd, id: doc.id }
          })

          resolve([200, newData])
        })
        .catch(error => {
          resolve([404, 'Requested order do not exist.'])
        })
    })
  })

  mock.onGet('/account/referral').reply(config => {
    const { account }: any = config.params as Params

    const ordersRef = firebase
      .firestore()
      .collection('orders')
      .where('cart.referral.id', '==', account.data.customer.id)

    return new Promise(async (resolve, reject) => {
      await ordersRef
        .get()
        .then(async querySnapshot => {
          const newData = querySnapshot.docs.map(doc => {
            const products = []
            doc.data().cart.products.map((itens: any) => {
              products.push({
                id: itens.id,
                name: itens.name ? itens.name : itens.title,
                price: itens.value,
                quantity: itens.quantity,
                total: itens.value,
                image: itens.image
              })
            })

            const ordeAdd = {
              reference: doc.data().payment?.invoiceNumber
                ? doc.data().payment?.invoiceNumber
                : doc.data().payment?.id
                  ? doc.data().payment?.id.replace('sub_', '')
                  : doc.data().id,
              id: doc.data().id,
              subtotal: doc.data().cart.subTotal,
              tax: '0',
              discount: doc.data().cart.discount.value,
              total: doc.data().cart?.total,
              date: new Date(doc.data().createdAt.toDate()),
              customer: {
                id: doc.data().customer?.id,
                firstName: doc.data().customer?.firstName
                  ? doc.data().customer?.firstName
                  : doc.data().customer?.name,
                cpfCnpj: doc.data().customer?.cpfCnpj,
                email: doc.data().customer?.email,
                phone: doc.data().customer?.phone,
                invoiceAddress: {
                  address: doc.data().customer?.invoiceAddress?.address,
                  lat: doc.data().customer?.invoiceAddress?.lat,
                  lng: doc.data().customer?.invoiceAddress?.lng
                },
                shippingAddress: {
                  address: doc.data().customer?.shippingAddress?.address,
                  lat: doc.data().customer?.shippingAddress?.lat,
                  lng: doc.data().customer?.shippingAddress?.lng
                }
              },
              products,
              status: [
                {
                  id: 1,
                  name: doc.data().payment.status,
                  date: doc.data().payment.dueDate
                }
              ],
              payment: {
                transactionId: doc.data().payment.id,
                creditCard: doc.data().payment?.creditCard,
                amount: doc.data().payment.value,
                method: doc.data().payment.billingType,
                date: doc.data().payment.dueDate
              },
              shopping: doc.data().cart?.shopping,
              shippingDetails: [
                {
                  tracking: '',
                  carrier: '',
                  weight: '',
                  fee: '',
                  date: ''
                }
              ]
            }
            return { ...ordeAdd, id: doc.id }
          })

          resolve([200, newData])
        })
        .catch(error => {
          resolve([404, 'Requested order do not exist.'])
        })
    })
  })

  mock.onGet('/account/orders/:id').reply(config => {
    const { id } = config.params as Params
    const ordersRef = firebase.firestore().collection('orders').doc(id)

    return new Promise(async (resolve, reject) => {
      await ordersRef
        .get()
        .then(doc => {
          const products = []
          doc.data().cart.products.map((itens: any) => {
            products.push({
              id: itens.id,
              sku: itens.sku,
              name: itens.name ? itens.name : itens.title,
              price: itens.value,
              quantity: itens.quantity,
              total: itens.value,
              image: itens.image
                ? itens.image
                : _.find(itens.images, { id: itens.featuredImageId })?.url
            })
          })

          const order = {
            id: doc.data().uid,
            reference: doc.data().id
              ? doc.data().id
              : doc.data().payment?.id
                ? doc.data().payment?.id.replace('sub_', '')
                : doc.data().payment?.invoiceNumber,
            subtotal: doc.data().cart.subTotal,
            tax: '0',
            discount: doc.data().cart.discount.value,
            coupon: {
              applied: doc.data().cart.discount.applied,
              code: doc.data().cart.discount.code
            },
            total: doc.data().payment.value,
            date: doc.data().createdAt.toDate(),
            customer: {
              id: doc.data().customer?.id ? doc.data().customer?.id : 1,
              blingId: doc.data().customer?.blingId
                ? doc.data().customer?.blingId
                : '',
              firstName: doc.data().customer?.firstName
                ? doc.data().customer?.firstName
                : doc.data().customer?.name,
              lastName: '',
              avatar: '',
              company: '',
              jobTitle: '',
              cpfCnpj: doc.data().customer?.cpfCnpj,
              email: doc.data().customer?.email,
              phone: doc.data().customer?.phone,
              address: doc.data().customer?.address,
              addressNumber: doc.data().customer?.addressNumber,
              complement: doc.data().customer?.complement,
              neighborhood: doc.data().customer?.neighborhood
                ? doc.data().customer?.neighborhood
                : '',
              city: doc.data().customer?.city ? doc.data().customer?.city : '',
              state: doc.data().customer?.state
                ? doc.data().customer?.state
                : '',
              invoiceAddress: {
                address: doc.data().customer?.invoiceAddress?.address,
                lat: doc.data().customer?.invoiceAddress?.lat,
                lng: doc.data().customer?.invoiceAddress?.lng
              },
              shippingAddress: {
                address: doc.data().customer?.shippingAddress?.address,
                lat: doc.data().customer?.shippingAddress?.lat,
                lng: doc.data().customer?.shippingAddress?.lng
              }
            },
            products,
            status: [
              {
                id: 1,
                name: doc.data().payment.status,
                date: new Date(doc.data().createdAt.toDate())
              }
            ],
            payment: {
              transactionId: doc.data().payment.id,
              creditCard: doc.data().payment?.creditCard,
              amount: doc.data().payment.value,
              method: doc.data().payment.billingType,
              date: doc.data().payment.dueDate
                ? doc.data().payment.dueDate
                : doc.data().payment.dateCreated
            },
            shipping: doc.data().cart?.shipping,
            shippingDetails: [
              {
                tracking: '',
                carrier: '',
                weight: '',
                fee: '',
                date: ''
              }
            ]
          }

          resolve([200, order])
        })
        .catch(error => {
          resolve([404, 'Requested order do not exist.'])
        })
    })
  })
}
