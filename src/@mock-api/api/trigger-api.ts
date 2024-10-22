import _ from '@lodash'
import FuseUtils from '@fuse/utils'
import mockApi from '../mock-api.json'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://lhovnmbmxqbsqgtxxrvw.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxob3ZubWJteHFic3FndHh4cnZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzNzE0NTQsImV4cCI6MjA0NDk0NzQ1NH0.AvPla89NeTnwJcBQeVZ7iKQKpma1Qayt1RPVEG4Qbow'
export const supabase = createClient(supabaseUrl, supabaseKey)

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

export const triggerApiMocks = (mock: ExtendedMockAdapter) => {
  mock.onPut('/trigger/contact/:id').reply(config => {
    const { id } = config.params as Params
    const contact = JSON.parse(config.data as string) as EcommerceCoupon

    const contactRef = firebase.firestore().collection('contacts').doc(id)
    return new Promise(async (resolve, reject) => {
      try {
        let newcontact = {
          ...contact,
          updatedAt: new Date()
        } as EcommerceCoupon

        await contactRef.update(newcontact)
        resolve([200, newcontact])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onDelete('/trigger/contact/:id').reply(config => {
    const { id } = config.params as Params
    const couponRef = firebase.firestore().collection('contacts').doc(id)
    return new Promise(async (resolve, reject) => {
      try {
        await couponRef.delete()
        resolve([200, id])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onDelete('/trigger/contacts').reply(config => {
    const ids = JSON.parse(config.data as string) as string[]
    const couponsRef = firebase.firestore().collection('contacts')
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

  mock.onPost('/trigger/contacts').reply(({ data }) => {
    const uid = FuseUtils.generateGUID()
    const campaign = JSON.parse(data as string)
    const campaignRef = firebase.firestore().collection('contacts').doc(uid)
    return new Promise(async (resolve, reject) => {
      try {
        const campaignNew = {
          ...campaign,
          uid,
          id: uid,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        campaignRef.set(campaignNew)
        resolve([200, campaignNew])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onGet('/trigger/contact/:id').reply(config => {
    const { id } = config.params as Params

    const campaignRef = firebase.firestore().collection('contacts').doc(id)

    return new Promise(async (resolve, reject) => {
      campaignRef
        .get()
        .then(querySnapshot => {
          if (querySnapshot.exists) {
            const campaign = querySnapshot.data()
            resolve([200, campaign])
          } else {
            return [200, null]
          }
        })
        .catch(error => {
          resolve([404, 'Requested coupon do not exist.'])
        })
    })
  })

  mock.onGet('/trigger/contacts').reply(async () => {
    const couponsRef = firebase.firestore().collection('contacts')

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

  mock.onPut('/trigger/campaign/:id').reply(config => {
    const { id } = config.params as Params
    const campaign = JSON.parse(config.data as string) as any
    //
    const campaignRef = firebase.firestore().collection('campaigns').doc(id)
    return new Promise(async (resolve, reject) => {
      try {
        let newcampaign = {
          ...campaign,
          updatedAt: new Date()
        } as EcommerceCoupon
        await campaignRef.update(newcampaign)

        if (campaign?.status !== 'COMPLETED' && campaign?.closedAt) {
          await axios.post(
            'https://webhook2.richeli.dev/webhook/bfb095d3-454d',
            newcampaign
          )
        }

        resolve([200, newcampaign])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onDelete('/trigger/campaign/:id').reply(config => {
    const { id } = config.params as Params
    const couponRef = firebase.firestore().collection('campaigns').doc(id)
    return new Promise(async (resolve, reject) => {
      try {
        await couponRef.delete()
        resolve([200, id])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onDelete('/trigger/campaigns').reply(config => {
    const ids = JSON.parse(config.data as string) as string[]
    const couponsRef = firebase.firestore().collection('campaigns')
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

  mock.onPost('/trigger/campaigns').reply(({ data }) => {
    const uid = FuseUtils.generateGUID()
    const campaign = JSON.parse(data as string)
    const campaignRef = firebase.firestore().collection('campaigns').doc(uid)
    return new Promise(async (resolve, reject) => {
      try {
        const campaignNew = {
          ...campaign,
          uid,
          id: uid,
          createdAt: new Date(),
          updatedAt: new Date()
        }

        await axios.post(
          'https://webhook2.richeli.dev/webhook/bfb095d3-454d',
          campaignNew
        )

        campaignRef.set(campaignNew)
        resolve([200, campaignNew])
      } catch (error) {
        reject(error)
      }
    })
  })

  mock.onGet('/trigger/campaign/:id').reply(config => {
    const { id } = config.params as Params

    const campaignRef = firebase.firestore().collection('campaigns').doc(id)

    return new Promise(async (resolve, reject) => {
      campaignRef
        .get()
        .then(querySnapshot => {
          if (querySnapshot.exists) {
            const campaign = querySnapshot.data()
            resolve([200, campaign])
          } else {
            return [200, null]
          }
        })
        .catch(error => {
          resolve([404, 'Requested coupon do not exist.'])
        })
    })
  })

  mock.onGet('/trigger/campaigns').reply(async () => {
    const couponsRef = firebase.firestore().collection('campaigns')

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
}
