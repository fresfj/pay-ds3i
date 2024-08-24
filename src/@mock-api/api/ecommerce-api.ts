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
const API_BACKEND = import.meta.env.VITE_API_BACKEND

let productsDB = mockApi.components.examples.ecommerce_products
  .value as EcommerceProduct[]
let ordersDB = mockApi.components.examples.ecommerce_orders
  .value as EcommerceOrder[]

export const eCommerceApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onPost('/ecommerce/conversion-tracking').reply(async ({ data }) => {
    const conversion = JSON.parse(data as string)

    const pixel = JSON.stringify({
      event_name: conversion.event,
      event_time: Math.floor(new Date().getTime() / 1000),
      action_source: 'website',
      event_source_url: conversion.pixel.url,
      user_data: {
        em: [conversion.customer?.email],
        ph: [conversion.customer?.phoneNumbers[0]?.phoneNumber],
        ct: [conversion.customer?.city],
        fn: [conversion.customer?.name],
        db: [conversion.customer?.birthday],
        fbp:
          conversion?.pixel.cookies?._fbp !== 'undefined'
            ? conversion?.pixel.cookies?._fbp
            : '',
        fbc:
          conversion?.pixel.cookies?._fbp !== 'undefined'
            ? conversion?.pixel.cookies?._fbp
            : ''
      },
      custom_data: {
        currency: 'BRL',
        value: conversion.cart.products[0].value,
        content_name: conversion.cart.products[0].name
      }
    })

    return new Promise(async (resolve, reject) => {
      try {
        const { data: response } = await axios.post(
          `${API_BACKEND}pixel`,
          pixel
        )
        resolve([200, response])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onPost('/ecommerce/abandoned').reply(async ({ data }) => {
    const uid = FuseUtils.generateGUID()
    const abandoned = JSON.parse(data as string)
    const abandonedRef = firebase.firestore().collection('abandoned').doc(uid)

    const pixel = JSON.stringify({
      event_name: 'AddPaymentInfo',
      event_time: Math.floor(new Date().getTime() / 1000),
      action_source: 'website',
      event_source_url: abandoned.pixel.url,
      user_data: {
        em: [abandoned.customer.email],
        ph: [abandoned.customer.phoneNumbers[0].phoneNumber],
        ct: [abandoned.customer.city],
        fn: [abandoned.customer.name],
        db: [abandoned.customer.birthday],
        fbp:
          abandoned.pixel.cookies?._fbp !== 'undefined'
            ? abandoned.pixel.cookies?._fbp
            : '',
        fbc:
          abandoned.pixel.cookies?._fbc !== 'undefined'
            ? abandoned.pixel.cookies?._fbc
            : ''
      },
      custom_data: {
        currency: 'BRL',
        value: abandoned.cart.products[0].value,
        content_name: abandoned.cart.products[0].name
      }
    })

    const { data: response } = await axios.post(`${API_BACKEND}pixel`, pixel)

    return new Promise(async (resolve, reject) => {
      try {
        abandonedRef.set({
          ...abandoned,
          abandonedId: uid,
          status: 'PENDING',
          createdAt: new Date()
        })
        resolve([200, uid])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onDelete('/ecommerce/abandoned/:id').reply(config => {
    const { id } = config.params as Params
    const couponRef = firebase.firestore().collection('abandoned').doc(id)

    return new Promise(async (resolve, reject) => {
      try {
        await couponRef.delete()
        resolve([200, id])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onPut('/ecommerce/coupons/:id').reply(config => {
    const { id } = config.params as Params
    const coupon = JSON.parse(config.data as string) as EcommerceCoupon

    const couponRef = firebase.firestore().collection('coupons').doc(id)
    return new Promise(async (resolve, reject) => {
      try {
        let newCoupon = {
          ...coupon,
          amount: {
            applied: '%',
            type: true,
            value: `${coupon.value}%`
          },
          updatedAt: new Date()
        } as EcommerceCoupon

        couponRef.set(newCoupon)
        await couponRef.update(coupon)
        resolve([200, coupon])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onDelete('/ecommerce/coupons/:id').reply(config => {
    const { id } = config.params as Params
    const couponRef = firebase.firestore().collection('coupons').doc(id)
    return new Promise(async (resolve, reject) => {
      try {
        await couponRef.delete()
        resolve([200, id])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onDelete('/ecommerce/coupons').reply(config => {
    const ids = JSON.parse(config.data as string) as string[]
    const couponsRef = firebase.firestore().collection('coupons')
    return new Promise(async (resolve, reject) => {
      try {
        for (const id of ids) {
          await couponsRef.doc(id).delete()
        }
        resolve([200, ids])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onPost('/ecommerce/coupons').reply(({ data }) => {
    const uid = FuseUtils.generateGUID()
    const coupon = JSON.parse(data as string)
    const couponRef = firebase.firestore().collection('coupons').doc(uid)

    return new Promise(async (resolve, reject) => {
      try {
        let newCoupon = {
          ...coupon,
          id: uid,
          amount: {
            applied: '%',
            type: true,
            value: `${coupon.value}%`
          }
        } as EcommerceCoupon

        couponRef.set(newCoupon)
        resolve([200, newCoupon])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onGet('/ecommerce/coupon/:id').reply(config => {
    const { id } = config.params as Params

    const couponsRef = firebase.firestore().collection('coupons').doc(id)

    return new Promise(async (resolve, reject) => {
      couponsRef
        .get()
        .then(querySnapshot => {
          if (querySnapshot.exists) {
            const coupon = querySnapshot.data()
            resolve([200, coupon])
          } else {
            return [200, null]
          }
        })
        .catch(error => {
          resolve([404, 'Requested coupon do not exist.'])
        })
    })
  })

  mock.onGet('/ecommerce/coupons').reply(async () => {
    const couponsRef = firebase
      .firestore()
      .collection('coupons')
      .orderBy('description', 'asc')

    return new Promise(async (resolve, reject) => {
      await couponsRef
        .get()
        .then(async querySnapshot => {
          const couponsDB = querySnapshot.docs.map((doc, index) => {
            return doc.data()
          })
          resolve([200, couponsDB])
        })
        .catch(error => {
          resolve([404, 'Requested product do not exist.'])
        })
    })
  })

  mock.onGet('/ecommerce/shop/plans').reply(async () => {
    const productsRef = firebase
      .firestore()
      .collection('products')
      .where('plan', '==', true)

    return new Promise(async (resolve, reject) => {
      await productsRef
        .get()
        .then(async querySnapshot => {
          const productsDB = querySnapshot.docs.map((doc, index) => {
            return doc.data()
          })

          resolve([200, productsDB])
        })
        .catch(error => {
          resolve([404, 'Requested product do not exist.'])
        })
    })
  })

  mock.onGet('/ecommerce/shop/products').reply(async () => {
    const productsRef = firebase
      .firestore()
      .collection('products')
      .where('publish', '==', true)

    return new Promise(async (resolve, reject) => {
      await productsRef
        .get()
        .then(async querySnapshot => {
          const productsDB = querySnapshot.docs.map((doc, index) => {
            return doc.data()
          })

          resolve([200, productsDB])
        })
        .catch(error => {
          resolve([404, 'Requested product do not exist.'])
        })
    })
  })

  mock.onGet('/ecommerce/products').reply(async () => {
    const productsRef = firebase
      .firestore()
      .collection('products')
      .orderBy('createdAt', 'desc')

    return new Promise(async (resolve, reject) => {
      await productsRef
        .get()
        .then(async querySnapshot => {
          const productsDB = querySnapshot.docs.map((doc, index) => {
            return doc.data()
          })

          resolve([200, productsDB])
        })
        .catch(error => {
          resolve([404, 'Requested product do not exist.'])
        })
    })
  })

  mock.onPost('/ecommerce/products').reply(({ data }) => {
    const uid = FuseUtils.generateGUID()
    const product = JSON.parse(data as string)
    const handle = product.name
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/ /g, '-')
      .toLowerCase()

    const productRef = firebase.firestore().collection('products').doc(uid)
    const storageRef = firebase.storage().ref()

    return new Promise(async (resolve, reject) => {
      try {
        let newProduct = {
          ...product,
          handle,
          uid,
          id: uid
        } as EcommerceProduct
        if (product.images !== undefined && product.images.length > 0) {
          const promises = product.images.map(async (image, index) => {
            if (/^(data:image\/[a-zA-Z]+;base64,)/.test(image.url)) {
              const imagesRef = storageRef.child(`images/${image.id}.jpg`)
              await imagesRef.putString(image.url, 'data_url')
              const url = await imagesRef.getDownloadURL()
              return { id: image.id, type: image.type, url }
            }
          })
          const imgs = await Promise.all(promises)
          newProduct = { ...newProduct, images: imgs } as EcommerceProduct
          productRef.set(newProduct)
          resolve([200, newProduct])
        } else {
          productRef.set(newProduct)
          resolve([200, newProduct])
        }
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onDelete('/ecommerce/products').reply(({ data }) => {
    const ids = JSON.parse(data as string) as string[]
    productsDB = productsDB.filter(item => !ids.includes(item.id))

    return [200, productsDB]
  })

  mock.onGet('/ecommerce/products/:id').reply(config => {
    const { id } = config.params as Params
    const productRef = firebase.firestore().collection('products').doc(id)
    return new Promise(async (resolve, reject) => {
      productRef
        .get()
        .then(async doc => {
          if (doc.exists) {
            const upProducts = []
            await productRef
              .collection('bump')
              .get()
              .then(upSnapshot => {
                upSnapshot.forEach(doc => {
                  upProducts.push({ id: doc.id, ...doc.data() })
                })
              })

            resolve([200, { ...doc.data(), upProducts }])
          } else {
            reject([404, 'Requested product do not exist.'])
          }
        })
        .catch(error => {
          reject([500, error])
        })
    })
  })

  mock.onPut('/ecommerce/products/:id').reply(config => {
    const { id } = config.params as Params

    const product = JSON.parse(config.data as string)
    const handle = product.name
      .normalize('NFD')
      .replace(/[^a-zA-Z0-9\s]/g, '')
      .replace(/ /g, '-')
      .toLowerCase()

    const productRef = firebase.firestore().collection('products').doc(id)
    const storageRef = firebase.storage().ref()

    return new Promise(async (resolve, reject) => {
      try {
        let newProduct = {
          ...product,
          handle,
          updatedAt: new Date()
        } as EcommerceProduct
        if (product.images !== undefined && product.images.length > 0) {
          const promises = product.images.map(async (image, index) => {
            if (/^(data:image\/[a-zA-Z]+;base64,)/.test(image.url)) {
              const imagesRef = storageRef.child(`images/${image.id}.jpg`)
              await imagesRef.putString(image.url, 'data_url')
              const url = await imagesRef.getDownloadURL()
              return { id: image.id, type: image.type, url }
            } else {
              return { id: image.id, type: image.type, url: image.url }
            }
          })

          const imgs = await Promise.all(promises)
          newProduct = { ...newProduct, images: imgs } as EcommerceProduct
          await productRef.update(newProduct)
          resolve([200, newProduct])
        } else {
          productRef.update(newProduct)
          resolve([200, newProduct])
        }
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onDelete('/ecommerce/products/:id').reply(config => {
    const { id } = config.params as Params

    const productRef = firebase.firestore().collection('products').doc(id)
    const storageRef = firebase.storage().ref()

    productRef
      .get()
      .then(doc => {
        if (doc.exists) {
          doc.data().images.map(async (image, index) => {
            storageRef.child(`images/${image.id}.jpg`).delete()
          })
        }
        productRef.delete()
      })
      .catch(error => {
        console.log('Error getting document:', error)
      })

    return [200, id]
  })

  mock.onGet('/ecommerce/orders').reply(() => {
    const ordersRef = firebase
      .firestore()
      .collection('orders')
      .orderBy('createdAt', 'desc')

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

  mock.onPost('/ecommerce/orders').reply(config => {
    const newOrder = {
      id: FuseUtils.generateGUID(),
      ...JSON.parse(config.data as string)
    } as EcommerceOrder

    ordersDB.push(newOrder)

    return [200, newOrder]
  })

  mock.onDelete('/ecommerce/orders').reply(config => {
    const ids = JSON.parse(config.data as string) as string[]
    const ordersRef = firebase.firestore().collection('orders')

    return new Promise(async (resolve, reject) => {
      try {
        for (const id of ids) {
          await ordersRef.doc(id).delete()
        }
        resolve([200, ids])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onGet('/ecommerce/orders/:id').reply(config => {
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

  mock.onPut('/ecommerce/orders/:id').reply(config => {
    const { id } = config.params as Params

    _.assign(
      _.find(ordersDB, { id }),
      JSON.parse(config.data as string) as EcommerceOrder
    )

    return [200, _.find(ordersDB, { id })]
  })

  mock.onDelete('/ecommerce/orders/:id').reply(config => {
    const { id } = config.params as Params

    _.remove(ordersDB, { id })

    return [200, id]
  })
}
