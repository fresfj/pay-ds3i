import { apiService as api } from 'app/store/apiService'
import { createSelector } from '@reduxjs/toolkit'
import FuseUtils from '@fuse/utils'
import { PartialDeep } from 'type-fest'
import { selectSearchText } from './store/searchTextSlice'

export const addTagTypes = [
  'invoice_products',
  'invoice_product',
  'invoice_coupon',
  'invoice_coupons',
  'invoice_orders',
  'invoice_order'
] as const

const InvoiceApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getInvoiceSubscriptions: build.query<
        GetInvoiceSubscriptionsApiResponse,
        GetInvoiceSubscriptionsApiArg
      >({
        query: () => ({ url: `/mock-api/invoice/subscriptions` }),
        providesTags: ['invoice_products']
      }),
      getInvoiceCoupons: build.query<
        GetInvoiceCouponsApiResponse,
        GetInvoiceCouponsApiArg
      >({
        query: () => ({ url: `/mock-api/ecommerce/coupons` }),
        providesTags: ['invoice_coupons']
      }),
      deleteInvoiceSubscriptions: build.mutation<
        DeleteInvoiceSubscriptionsApiResponse,
        DeleteInvoiceSubscriptionsApiArg
      >({
        query: productIds => ({
          url: `/mock-api/ecommerce/products`,
          method: 'DELETE',
          data: productIds
        }),
        invalidatesTags: ['invoice_products']
      }),
      updateInvoiceCoupon: build.mutation<
        UpdateInvoiceCouponApiResponse,
        UpdateInvoiceCouponApiArg
      >({
        query: coupon => ({
          url: `/mock-api/ecommerce/coupons/${coupon.id}`,
          method: 'PUT',
          data: coupon
        }),
        invalidatesTags: ['invoice_coupon', 'invoice_coupons']
      }),
      deleteInvoiceCoupon: build.mutation<
        DeleteInvoiceCouponApiResponse,
        DeleteInvoiceCouponApiArg
      >({
        query: productId => ({
          url: `/mock-api/ecommerce/coupons/${productId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['invoice_product', 'invoice_coupons']
      }),
      getInvoiceCoupon: build.query<
        GetInvoiceCouponApiResponse,
        GetInvoiceCouponApiArg
      >({
        query: couponId => ({
          url: `/mock-api/ecommerce/coupon/${couponId}`
        }),
        providesTags: ['invoice_coupon', 'invoice_coupons']
      }),
      getInvoiceProduct: build.query<
        GetInvoiceProductApiResponse,
        GetInvoiceProductApiArg
      >({
        query: productId => ({
          url: `/mock-api/ecommerce/products/${productId}`
        }),
        providesTags: ['invoice_product', 'invoice_products']
      }),
      updateInvoiceProduct: build.mutation<
        UpdateInvoiceProductApiResponse,
        UpdateInvoiceProductApiArg
      >({
        query: product => ({
          url: `/mock-api/ecommerce/products/${product.id}`,
          method: 'PUT',
          data: product
        }),
        invalidatesTags: ['invoice_product', 'invoice_products']
      }),
      deleteInvoiceProduct: build.mutation<
        DeleteInvoiceProductApiResponse,
        DeleteInvoiceProductApiArg
      >({
        query: productId => ({
          url: `/mock-api/ecommerce/products/${productId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['invoice_product', 'invoice_products']
      }),
      getInvoiceOrders: build.query<
        GetInvoiceOrdersApiResponse,
        GetInvoiceOrdersApiArg
      >({
        query: () => ({ url: `/mock-api/ecommerce/orders` }),
        providesTags: ['invoice_orders']
      }),
      getInvoiceOrder: build.query<
        GetInvoiceOrderApiResponse,
        GetInvoiceOrderApiArg
      >({
        query: order => ({
          url: `/mock-api/invoice/orders/${order.subscription}`,
          method: 'GET',
          data: order
        }),
        providesTags: ['invoice_order']
      }),
      updateInvoiceOrder: build.mutation<
        UpdateInvoiceOrderApiResponse,
        UpdateInvoiceOrderApiArg
      >({
        query: order => ({
          url: `/mock-api/ecommerce/orders/${order.id}`,
          method: 'PUT',
          data: order
        }),
        invalidatesTags: ['invoice_order', 'invoice_orders']
      }),
      deleteInvoiceOrder: build.mutation<
        DeleteInvoiceOrderApiResponse,
        DeleteInvoiceOrderApiArg
      >({
        query: orderId => ({
          url: `/mock-api/ecommerce/orders/${orderId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['invoice_order', 'invoice_orders']
      }),
      deleteInvoiceOrders: build.mutation<
        DeleteInvoiceOrdersApiResponse,
        DeleteInvoiceOrdersApiArg
      >({
        query: ordersId => ({
          url: `/mock-api/ecommerce/orders`,
          method: 'DELETE',
          data: ordersId
        }),
        invalidatesTags: ['invoice_order', 'invoice_orders']
      }),
      deleteInvoiceCoupons: build.mutation<
        DeleteInvoiceCouponsApiResponse,
        DeleteInvoiceCouponsApiArg
      >({
        query: couponsId => ({
          url: `/mock-api/ecommerce/coupons`,
          method: 'DELETE',
          data: couponsId
        }),
        invalidatesTags: ['invoice_coupon', 'invoice_coupons']
      })
    }),
    overrideExisting: false
  })

export default InvoiceApi

export type GetInvoiceSubscriptionsApiResponse =
  /** status 200 OK */ EcommerceProduct[]
export type GetInvoiceSubscriptionsApiArg = void

export type DeleteInvoiceSubscriptionsApiResponse = unknown
export type DeleteInvoiceSubscriptionsApiArg = string[] /** Product ids */

export type GetInvoiceCouponsApiResponse =
  /** status 200 OK */ EcommerceProduct[]
export type GetInvoiceCouponsApiArg = void

export type DeleteInvoiceCouponsApiResponse = unknown
export type DeleteInvoiceCouponsApiArg = string[] /** Product ids */

export type GetInvoiceCouponApiResponse = /** status 200 OK */ EcommerceCoupon
export type GetInvoiceCouponApiArg = string

export type CreateInvoiceCouponApiResponse =
  /** status 200 OK */ EcommerceCoupon
export type CreateInvoiceCouponApiArg = PartialDeep<EcommerceCoupon>

export type UpdateInvoiceCouponApiResponse = unknown
export type UpdateInvoiceCouponApiArg = EcommerceCoupon // Coupon

export type DeleteInvoiceCouponApiResponse = unknown
export type DeleteInvoiceCouponApiArg = string // Order id

export type GetInvoiceProductApiResponse = /** status 200 OK */ EcommerceProduct
export type GetInvoiceProductApiArg = string

export type CreateInvoiceProductApiResponse =
  /** status 200 OK */ EcommerceProduct
export type CreateInvoiceProductApiArg = PartialDeep<EcommerceProduct>

export type UpdateInvoiceProductApiResponse = unknown
export type UpdateInvoiceProductApiArg = EcommerceProduct // Product

export type DeleteInvoiceProductApiResponse = unknown
export type DeleteInvoiceProductApiArg = string // Product id

export type GetInvoiceOrdersApiResponse = /** status 200 OK */ EcommerceOrder[]
export type GetInvoiceOrdersApiArg = void

export type GetInvoiceOrderApiResponse = /** status 200 OK */ EcommerceOrder
export type GetInvoiceOrderApiArg = {
  subscription: string
  customer: string
} // Order id

export type UpdateInvoiceOrderApiResponse = unknown
export type UpdateInvoiceOrderApiArg = EcommerceOrder // Order

export type DeleteInvoiceOrderApiResponse = unknown
export type DeleteInvoiceOrderApiArg = string // Order id

export type DeleteInvoiceOrdersApiResponse = unknown
export type DeleteInvoiceOrdersApiArg = string[] // Orders id

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
  status?: boolean
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
    name: string
    firstName: string
    lastName: string
    avatar: string
    company: string
    jobTitle: string
    email: string
    cpfCnpj: string
    phone: string
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
  useGetInvoiceSubscriptionsQuery,
  useDeleteInvoiceSubscriptionsMutation,
  useDeleteInvoiceCouponsMutation,
  useGetInvoiceCouponsQuery,
  useGetInvoiceCouponQuery,
  useGetInvoiceProductQuery,
  useUpdateInvoiceProductMutation,
  useDeleteInvoiceProductMutation,
  useDeleteInvoiceCouponMutation,
  useUpdateInvoiceCouponMutation,
  useGetInvoiceOrdersQuery,
  useGetInvoiceOrderQuery,
  useUpdateInvoiceOrderMutation,
  useDeleteInvoiceOrderMutation,
  useDeleteInvoiceOrdersMutation
} = InvoiceApi

export type InvoiceApiType = {
  [InvoiceApi.reducerPath]: ReturnType<typeof InvoiceApi.reducer>
}

/**
 * Select products
 */
/**
 * Select filtered products
 */
export const selectFilteredSubscriptions = (products: EcommerceProduct[]) =>
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
    if (searchText.length === 0) {
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
