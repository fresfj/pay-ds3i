import { apiService as api } from 'app/store/apiService'
import { createSelector } from '@reduxjs/toolkit'
import FuseUtils from '@fuse/utils'
import { PartialDeep } from 'type-fest'
import { selectSearchText } from './store/searchTextSlice'
import CouponModel from './campaign/models/CouponModel'

export const addTagTypes = [
  'trigger_contact',
  'trigger_contacts',
  'trigger_campaigns',
  'trigger_campaign'
] as const

const ECommerceApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getContacts: build.query<GetContactsApiResponse, GetContactsApiArg>({
        query: () => ({ url: `/mock-api/trigger/contacts` }),
        providesTags: ['trigger_contacts']
      }),
      createContact: build.mutation<
        CreateContactApiResponse,
        CreateContactApiArg
      >({
        query: newCoupon => ({
          url: `/mock-api/trigger/contacts`,
          method: 'POST',
          data: CouponModel(newCoupon)
        }),
        invalidatesTags: ['trigger_contacts', 'trigger_contact']
      }),
      updateContact: build.mutation<
        UpdateContactApiResponse,
        UpdateContactApiArg
      >({
        query: contact => ({
          url: `/mock-api/trigger/contact/${contact.id}`,
          method: 'PUT',
          data: contact
        }),
        invalidatesTags: ['trigger_contact', 'trigger_contacts']
      }),
      deleteContact: build.mutation<
        DeleteContactApiResponse,
        DeleteContactApiArg
      >({
        query: contactId => ({
          url: `/mock-api/trigger/contact/${contactId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['trigger_contact', 'trigger_contact']
      }),
      getContact: build.query<GetContactApiResponse, GetContactApiArg>({
        query: contactId => ({
          url: `/mock-api/trigger/contact/${contactId}`
        }),
        providesTags: ['trigger_contact', 'trigger_contact']
      }),
      deleteContacts: build.mutation<
        DeleteContactsApiResponse,
        DeleteContactsApiArg
      >({
        query: contactsId => ({
          url: `/mock-api/trigger/contacts`,
          method: 'DELETE',
          data: contactsId
        }),
        invalidatesTags: ['trigger_contact', 'trigger_contacts']
      }),

      getCampaigns: build.query<GetCampaignsApiResponse, GetCampaignsApiArg>({
        query: () => ({ url: `/mock-api/trigger/campaigns` }),
        providesTags: ['trigger_campaigns']
      }),
      createCampaign: build.mutation<
        CreateCampaignApiResponse,
        CreateCampaignApiArg
      >({
        query: newCoupon => ({
          url: `/mock-api/trigger/campaigns`,
          method: 'POST',
          data: CouponModel(newCoupon)
        }),
        invalidatesTags: ['trigger_campaigns', 'trigger_campaign']
      }),
      updateCampaign: build.mutation<
        UpdateCampaignApiResponse,
        UpdateCampaignApiArg
      >({
        query: campaign => ({
          url: `/mock-api/trigger/campaign/${campaign.id}`,
          method: 'PUT',
          data: campaign
        }),
        invalidatesTags: ['trigger_campaign', 'trigger_campaigns']
      }),
      deleteCampaign: build.mutation<
        DeleteCampaignApiResponse,
        DeleteCampaignApiArg
      >({
        query: campaignId => ({
          url: `/mock-api/trigger/campaign/${campaignId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['trigger_campaign', 'trigger_campaign']
      }),
      getCampaign: build.query<GetCampaignApiResponse, GetCampaignApiArg>({
        query: campaignId => ({
          url: `/mock-api/trigger/campaign/${campaignId}`
        }),
        providesTags: ['trigger_campaign', 'trigger_campaign']
      }),
      deleteCampaigns: build.mutation<
        DeleteCampaignsApiResponse,
        DeleteCampaignsApiArg
      >({
        query: campaignsId => ({
          url: `/mock-api/trigger/campaigns`,
          method: 'DELETE',
          data: campaignsId
        }),
        invalidatesTags: ['trigger_campaign', 'trigger_campaigns']
      })
    }),
    overrideExisting: false
  })

export default ECommerceApi

export type GetCampaignsApiResponse = /** status 200 OK */ EcommerceProduct[]
export type GetCampaignsApiArg = void

export type DeleteCampaignsApiResponse = unknown
export type DeleteCampaignsApiArg = string[] /** Product ids */

export type GetCampaignApiResponse = /** status 200 OK */ EcommerceCoupon
export type GetCampaignApiArg = string

export type CreateCampaignApiResponse = /** status 200 OK */ EcommerceCoupon
export type CreateCampaignApiArg = PartialDeep<EcommerceCoupon>

export type UpdateCampaignApiResponse = unknown
export type UpdateCampaignApiArg = EcommerceCoupon // Coupon

export type DeleteCampaignApiResponse = unknown
export type DeleteCampaignApiArg = string // Order id

export type GetContactsApiResponse = /** status 200 OK */ EcommerceProduct[]
export type GetContactsApiArg = void

export type DeleteContactsApiResponse = unknown
export type DeleteContactsApiArg = string[] /** Product ids */

export type GetContactApiResponse = /** status 200 OK */ EcommerceCoupon
export type GetContactApiArg = string

export type CreateContactApiResponse = /** status 200 OK */ EcommerceCoupon
export type CreateContactApiArg = PartialDeep<EcommerceCoupon>

export type UpdateContactApiResponse = unknown
export type UpdateContactApiArg = EcommerceCoupon // Coupon

export type DeleteContactApiResponse = unknown
export type DeleteContactApiArg = string // Order id

export type EcommerceProductImageType = {
  id: string
  url: string
  type: string
}
export type CreditCardType = {
  creditCardNumber: string
  creditCardBrand: string
}
export type EcommerceCoupon = {
  id: string
  value: string
  code: string
  name?: string
  description: string
  quantity: number
  status?: string
  closedAt?: string
  amount?: {
    applied: string
    type: boolean
    value: string
  }
}
export type EcommerceProduct = {
  uid?: string
  id: string
  name: string
  handle: string
  description: string
  categories: string[]
  tags: string[]
  payments: string[]
  colors: string[]
  gender: string[]
  sizes: string[]
  flavors: string[]
  label: {
    content: string
    enabled: boolean
  }
  featuredImageId: string
  images: EcommerceProductImageType[]
  priceTaxExcl: number
  priceTaxIncl: number
  taxRate: number
  comparedPrice: number
  quantity: number
  sku: string
  width: string
  height: string
  depth: string
  weight: string
  extraShippingFee: number
  active: boolean
  coupon: boolean
  publish: boolean
  isSubscription: boolean
  subscriptionOptions: any[]
}

export type EcommerceOrder = {
  uid?: string
  id: string
  reference: string
  subtotal: string
  tax: string
  discount: string
  total: string
  date: string
  customer: {
    id: string
    firstName: string
    lastName: string
    avatar: string
    company: string
    jobTitle: string
    email: string
    cpfCnpj: string
    phone: string
    address: string
    addressNumber: string
    complement: string
    neighborhood: string
    state: string
    invoiceAddress: {
      address: string
      lat: number
      lng: number
    }
    shippingAddress: {
      address: string
      lat: number
      lng: number
    }
  }
  coupon: {
    applied: string
    code: string
  }
  products: Partial<EcommerceProduct & { image: string; price: string }>[]
  status: {
    id: string
    name: string
    color: string
    date?: string
  }[]
  payment: {
    transactionId: string
    creditCard?: CreditCardType
    amount: string
    method: string
    date: string
  }
  shipping?: {
    title?: string
    delivery?: boolean
    value?: string
  }
  shippingDetails: {
    tracking: string
    carrier: string
    weight: string
    fee: string
    date: string
  }[]
}

export const {
  useGetContactsQuery,
  useGetContactQuery,
  useCreateContactMutation,
  useDeleteContactMutation,
  useDeleteContactsMutation,
  useUpdateContactMutation,

  useGetCampaignsQuery,
  useGetCampaignQuery,
  useCreateCampaignMutation,
  useDeleteCampaignMutation,
  useDeleteCampaignsMutation,
  useUpdateCampaignMutation
} = ECommerceApi

export type ECommerceApiType = {
  [ECommerceApi.reducerPath]: ReturnType<typeof ECommerceApi.reducer>
}

/**
 * Select products
 */
/**
 * Select filtered products
 */
export const selectFilteredProducts = (products: EcommerceProduct[]) =>
  createSelector([selectSearchText], searchText => {
    if (searchText.length === 0) {
      return products
    }

    return FuseUtils.filterArrayByString<EcommerceProduct>(products, searchText)
  })
/**
 * Select coupons
 */
/**
 * Select filtered coupons
 */
export const selectFilteredCoupons = (coupons: EcommerceProduct[]) =>
  createSelector([selectSearchText], searchText => {
    if (searchText?.length === 0) {
      return coupons
    }

    return FuseUtils.filterArrayByString<EcommerceProduct>(coupons, searchText)
  })
/**
 * Select filtered orders
 */
export const selectFilteredOrders = (orders: EcommerceOrder[]) =>
  createSelector([selectSearchText], searchText => {
    if (searchText.length === 0) {
      return orders
    }

    return FuseUtils.filterArrayByString<EcommerceOrder>(orders, searchText)
  })
