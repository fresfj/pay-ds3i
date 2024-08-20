import { apiService as api } from 'app/store/apiService'
import { createSelector } from '@reduxjs/toolkit'
import { selectSearchText } from './store/searchTextSlice'
import FuseUtils from '@fuse/utils/FuseUtils'
import { EcommerceOrder } from '../e-commerce/ECommerceApi'

export const addTagTypes = [
  'account_address',
  'account_payment',
  'account_plan',
  'account_security',
  'account_item',
  'account',
  'profile_photos_videos',
  'profile_timeline',
  'profile_about',
  'account_orders',
  'account_order'
] as const

const AccountApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getAccountsOrders: build.query<
        GetAccountsOrdersApiResponse,
        GetAccountsOrdersApiArg
      >({
        query: account => ({
          url: `/mock-api/account/orders`,
          params: { account }
        }),
        providesTags: ['account_orders']
      }),
      getAccountsOrder: build.query<
        GetAccountsOrderApiResponse,
        GetAccountsOrderApiArg
      >({
        query: orderId => ({ url: `/mock-api/account/orders/${orderId}` }),
        providesTags: ['account_order']
      }),
      deleteAccountsAddress: build.mutation<
        DeleteAccountsAddressApiResponse,
        DeleteAccountsAddressApiArg
      >({
        query: account => ({
          url: `/mock-api/account/address/${account.customerId}`,
          method: 'DELETE',
          data: account
        }),
        invalidatesTags: ['account_address']
      }),
      deleteAccountsPayment: build.mutation<
        DeleteAccountsPaymentApiResponse,
        DeleteAccountsPaymentApiArg
      >({
        query: account => ({
          url: `/mock-api/account/payment/${account.customerId}`,
          method: 'DELETE',
          data: account
        }),
        invalidatesTags: ['account_payment']
      }),
      updateAccountAddress: build.mutation<
        UpdateAccountAddressApiResponse,
        UpdateAccountAddressApiArg
      >({
        query: account => ({
          url: `/mock-api/account/address/${account.customerId}`,
          method: 'PUT',
          data: account
        }),
        invalidatesTags: ['account_address', 'account']
      }),
      updateAccountPayment: build.mutation<
        UpdateAccountPaymentApiResponse,
        UpdateAccountPaymentApiArg
      >({
        query: account => ({
          url: `/mock-api/account/payment/${account.customerId}`,
          method: 'PUT',
          data: account
        }),
        invalidatesTags: ['account_payment', 'account']
      }),
      createAccountAddress: build.mutation<
        CreateAccountAddressApiResponse,
        CreateAccountAddressApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/account/address`,
          method: 'POST',
          data: queryArg
        }),
        invalidatesTags: ['account_address']
      }),
      createAccountPayment: build.mutation<
        CreateAccountPaymentApiResponse,
        CreateAccountPaymentApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/account/payment`,
          method: 'POST',
          data: queryArg
        }),
        invalidatesTags: ['account_payment']
      }),
      updateAccountPlan: build.mutation<
        UpdateAccountPlanApiResponse,
        UpdateAccountPlanApiArg
      >({
        query: account => ({
          url: `/mock-api/account/plan/${account.id}`,
          method: 'PUT',
          data: account
        }),
        invalidatesTags: ['account_plan', 'account']
      }),
      updateAccountSecurity: build.mutation<
        UpdateAccountSecurityApiResponse,
        UpdateAccountSecurityApiArg
      >({
        query: account => ({
          url: `/mock-api/account/security/${account.id}`,
          method: 'PUT',
          data: account
        }),
        invalidatesTags: ['account_security', 'account']
      }),
      updateAccountsItem: build.mutation<
        UpdateAccountsItemApiResponse,
        UpdateAccountsItemApiArg
      >({
        query: account => ({
          url: `/mock-api/account/${account.id}`,
          method: 'PUT',
          data: account
        }),
        invalidatesTags: ['account_item', 'account']
      }),
      deleteAccountsItem: build.mutation<
        DeleteAccountsItemApiResponse,
        DeleteAccountsItemApiArg
      >({
        query: accountId => ({
          url: `/mock-api/account/${accountId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['account']
      }),
      getAccountPhotosVideos: build.query<
        GetAccountPhotosVideosApiResponse,
        GetAccountPhotosVideosApiArg
      >({
        query: () => ({ url: `/mock-api/profile/photos-videos` }),
        providesTags: ['profile_photos_videos']
      }),
      getAccountTimeline: build.query<
        GetAccountTimelineApiResponse,
        GetAccountTimelineApiArg
      >({
        query: () => ({ url: `/mock-api/profile/timeline` }),
        providesTags: ['profile_timeline']
      }),
      getAccountAbout: build.query<
        GetAccountAboutApiResponse,
        GetAccountAboutApiArg
      >({
        query: () => ({ url: `/mock-api/profile/about` }),
        providesTags: ['profile_about']
      })
    }),
    overrideExisting: false
  })

export default AccountApi
export type DeleteAccountsAddressApiResponse =
  /** status 200 Customer Deleted */ Account
export type DeleteAccountsAddressApiArg = {
  customerId: string
  addressId: string
}

export type DeleteAccountsPaymentApiResponse =
  /** status 200 Customer Deleted */ Account
export type DeleteAccountsPaymentApiArg = {
  customerId: string
  addressId: string
}

export type UpdateAccountAddressApiResponse =
  /** status 200 Customer Updated */ Account
export type UpdateAccountAddressApiArg = {
  customerId: string
  addressId: string
}

export type UpdateAccountPaymentApiResponse =
  /** status 200 Customer Updated */ Account
export type UpdateAccountPaymentApiArg = {
  customerId: string
  paymentId: string
}

export type CreateAccountAddressApiResponse = /** status 201 Created */ Account
export type CreateAccountAddressApiArg = {
  data: any
  addressFormatted: any
  customerId: string
  uid: string
}

export type CreateAccountPaymentApiResponse = /** status 201 Created */ Account
export type CreateAccountPaymentApiArg = any

export type UpdateAccountPlanApiResponse =
  /** status 200 Customer Updated */ Account
export type UpdateAccountPlanApiArg = Account

export type GetAccountsOrdersApiResponse = /** status 200 OK */ EcommerceOrder[]
export type GetAccountsOrdersApiArg = any

export type GetAccountsOrderApiResponse = /** status 200 OK */ EcommerceOrder
export type GetAccountsOrderApiArg = string // Order id

export type UpdateAccountSecurityApiResponse =
  /** status 200 Customer Updated */ Account
export type UpdateAccountSecurityApiArg = Account

export type UpdateAccountsItemApiResponse =
  /** status 200 Customer Updated */ Account
export type UpdateAccountsItemApiArg = Account

export type DeleteAccountsItemApiResponse = unknown
export type DeleteAccountsItemApiArg = string

export type GetAccountPhotosVideosApiResponse =
  /** status 200 OK */ AccountPhotosVideos[]
export type GetAccountPhotosVideosApiArg = void

export type GetAccountTimelineApiResponse = /** status 200 OK */ AccountTimeline
export type GetAccountTimelineApiArg = void

export type GetAccountAboutApiResponse = /** status 200 OK */ AccountAbout
export type GetAccountAboutApiArg = void

export type PasswordChange = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export type Account = {
  id: string
  displayName?: string
  foodPreferences?: string[]
  photoURL?: string
  size?: string
  avatar?: string
  background?: string
  identification?: string
  name: string
  email?: string
  phoneNumber?: string
  phoneCountry?: string
  country: string
  gender?: string
  label?: string
  title?: string
  company?: string
  birthday?: string
  address?: string
  about?: string
  tags?: string[]
}

export type AccountPhotosVideos = {
  id?: string
  name?: string
  info?: string
  media?: {
    type?: string
    title?: string
    preview?: string
  }[]
}

export type Activity = {
  id?: string
  user?: {
    name?: string
    avatar?: string
  }
  message?: string
  time?: string
}

export type Post = {
  id?: string
  user?: {
    name?: string
    avatar?: string
  }
  message?: string
  time?: string
  type?: string
  like?: number
  share?: number
  media?: {
    type?: string
    preview?: string
  }
  comments?: {
    id?: string
    user?: {
      name?: string
      avatar?: string
    }
    time?: string
    message?: string
  }[]
  article?: {
    title?: string
    subtitle?: string
    excerpt?: string
    media?: {
      type?: string
      preview?: string
    }
  }
}

export type AccountTimeline = {
  activities?: Activity[]
  posts?: Post[]
}

export type AccountAbout = {
  general?: {
    gender?: string
    birthday?: string
    locations?: string[]
    about?: string
  }
  work?: {
    occupation?: string
    skills?: string
    jobs?: {
      company?: string
      date?: string
    }[]
  }
  contact?: {
    address?: string
    tel?: string[]
    websites?: string[]
    emails?: string[]
  }
  groups?: {
    id?: string
    name?: string
    category?: string
    members?: string
  }[]
  friends?: {
    id?: string
    name?: string
    avatar?: string
  }[]
}

export const {
  useGetAccountsOrdersQuery,
  useGetAccountsOrderQuery,
  useDeleteAccountsAddressMutation,
  useDeleteAccountsPaymentMutation,
  useUpdateAccountAddressMutation,
  useUpdateAccountPaymentMutation,
  useCreateAccountAddressMutation,
  useCreateAccountPaymentMutation,
  useUpdateAccountPlanMutation,
  useUpdateAccountSecurityMutation,
  useUpdateAccountsItemMutation,
  useDeleteAccountsItemMutation,
  useGetAccountPhotosVideosQuery,
  useGetAccountTimelineQuery,
  useGetAccountAboutQuery
} = AccountApi

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
