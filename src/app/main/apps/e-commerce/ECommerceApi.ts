import { apiService as api } from 'app/store/apiService'
import { createSelector } from '@reduxjs/toolkit'
import FuseUtils from '@fuse/utils'
import { PartialDeep } from 'type-fest'
import { selectSearchText } from './store/searchTextSlice'
import ProductModel from './product/models/ProductModel'
import CouponModel from './coupon/models/CouponModel'

export const addTagTypes = [
  'eCommerce_products',
  'eCommerce_product',
  'eCommerce_coupon',
  'eCommerce_coupons',
  'eCommerce_orders',
  'eCommerce_order'
] as const

const ECommerceApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getECommerceProducts: build.query<
        GetECommerceProductsApiResponse,
        GetECommerceProductsApiArg
      >({
        query: () => ({ url: `/mock-api/ecommerce/products` }),
        providesTags: ['eCommerce_products']
      }),
      getECommerceCoupons: build.query<
        GetECommerceCouponsApiResponse,
        GetECommerceCouponsApiArg
      >({
        query: () => ({ url: `/mock-api/ecommerce/coupons` }),
        providesTags: ['eCommerce_coupons']
      }),
      deleteECommerceProducts: build.mutation<
        DeleteECommerceProductsApiResponse,
        DeleteECommerceProductsApiArg
      >({
        query: productIds => ({
          url: `/mock-api/ecommerce/products`,
          method: 'DELETE',
          data: productIds
        }),
        invalidatesTags: ['eCommerce_products']
      }),
      createECommerceCoupon: build.mutation<
        CreateECommerceCouponApiResponse,
        CreateECommerceCouponApiArg
      >({
        query: newCoupon => ({
          url: `/mock-api/ecommerce/coupons`,
          method: 'POST',
          data: CouponModel(newCoupon)
        }),
        invalidatesTags: ['eCommerce_coupons', 'eCommerce_coupon']
      }),
      updateECommerceCoupon: build.mutation<
        UpdateECommerceCouponApiResponse,
        UpdateECommerceCouponApiArg
      >({
        query: coupon => ({
          url: `/mock-api/ecommerce/coupons/${coupon.id}`,
          method: 'PUT',
          data: coupon
        }),
        invalidatesTags: ['eCommerce_coupon', 'eCommerce_coupons']
      }),
      deleteECommerceCoupon: build.mutation<
        DeleteECommerceCouponApiResponse,
        DeleteECommerceCouponApiArg
      >({
        query: productId => ({
          url: `/mock-api/ecommerce/coupons/${productId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['eCommerce_product', 'eCommerce_coupons']
      }),
      getECommerceCoupon: build.query<
        GetECommerceCouponApiResponse,
        GetECommerceCouponApiArg
      >({
        query: couponId => ({
          url: `/mock-api/ecommerce/coupon/${couponId}`
        }),
        providesTags: ['eCommerce_coupon', 'eCommerce_coupons']
      }),
      getECommerceProduct: build.query<
        GetECommerceProductApiResponse,
        GetECommerceProductApiArg
      >({
        query: productId => ({
          url: `/mock-api/ecommerce/products/${productId}`
        }),
        providesTags: ['eCommerce_product', 'eCommerce_products']
      }),
      createECommerceProduct: build.mutation<
        CreateECommerceProductApiResponse,
        CreateECommerceProductApiArg
      >({
        query: newProduct => ({
          url: `/mock-api/ecommerce/products`,
          method: 'POST',
          data: ProductModel(newProduct)
        }),
        invalidatesTags: ['eCommerce_products', 'eCommerce_product']
      }),
      updateECommerceProduct: build.mutation<
        UpdateECommerceProductApiResponse,
        UpdateECommerceProductApiArg
      >({
        query: product => ({
          url: `/mock-api/ecommerce/products/${product.id}`,
          method: 'PUT',
          data: product
        }),
        invalidatesTags: ['eCommerce_product', 'eCommerce_products']
      }),
      deleteECommerceProduct: build.mutation<
        DeleteECommerceProductApiResponse,
        DeleteECommerceProductApiArg
      >({
        query: productId => ({
          url: `/mock-api/ecommerce/products/${productId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['eCommerce_product', 'eCommerce_products']
      }),
      getECommerceOrders: build.query<
        GetECommerceOrdersApiResponse,
        GetECommerceOrdersApiArg
      >({
        query: () => ({ url: `/mock-api/ecommerce/orders` }),
        providesTags: ['eCommerce_orders']
      }),
      getECommerceOrder: build.query<
        GetECommerceOrderApiResponse,
        GetECommerceOrderApiArg
      >({
        query: orderId => ({ url: `/mock-api/ecommerce/orders/${orderId}` }),
        providesTags: ['eCommerce_order']
      }),
      updateECommerceOrder: build.mutation<
        UpdateECommerceOrderApiResponse,
        UpdateECommerceOrderApiArg
      >({
        query: order => ({
          url: `/mock-api/ecommerce/orders/${order.id}`,
          method: 'PUT',
          data: order
        }),
        invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
      }),
      deleteECommerceOrder: build.mutation<
        DeleteECommerceOrderApiResponse,
        DeleteECommerceOrderApiArg
      >({
        query: orderId => ({
          url: `/mock-api/ecommerce/orders/${orderId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
      }),
      deleteECommerceOrders: build.mutation<
        DeleteECommerceOrdersApiResponse,
        DeleteECommerceOrdersApiArg
      >({
        query: ordersId => ({
          url: `/mock-api/ecommerce/orders`,
          method: 'DELETE',
          data: ordersId
        }),
        invalidatesTags: ['eCommerce_order', 'eCommerce_orders']
      }),
      deleteECommerceCoupons: build.mutation<
        DeleteECommerceCouponsApiResponse,
        DeleteECommerceCouponsApiArg
      >({
        query: couponsId => ({
          url: `/mock-api/ecommerce/coupons`,
          method: 'DELETE',
          data: couponsId
        }),
        invalidatesTags: ['eCommerce_coupon', 'eCommerce_coupons']
      })
    }),
    overrideExisting: false
  })

export default ECommerceApi

export type GetECommerceProductsApiResponse =
  /** status 200 OK */ EcommerceProduct[]
export type GetECommerceProductsApiArg = void

export type DeleteECommerceProductsApiResponse = unknown
export type DeleteECommerceProductsApiArg = string[] /** Product ids */

export type GetECommerceCouponsApiResponse =
  /** status 200 OK */ EcommerceProduct[]
export type GetECommerceCouponsApiArg = void

export type DeleteECommerceCouponsApiResponse = unknown
export type DeleteECommerceCouponsApiArg = string[] /** Product ids */

export type GetECommerceCouponApiResponse = /** status 200 OK */ EcommerceCoupon
export type GetECommerceCouponApiArg = string

export type CreateECommerceCouponApiResponse =
  /** status 200 OK */ EcommerceCoupon
export type CreateECommerceCouponApiArg = PartialDeep<EcommerceCoupon>

export type UpdateECommerceCouponApiResponse = unknown
export type UpdateECommerceCouponApiArg = EcommerceCoupon // Coupon

export type DeleteECommerceCouponApiResponse = unknown
export type DeleteECommerceCouponApiArg = string // Order id

export type GetECommerceProductApiResponse =
  /** status 200 OK */ EcommerceProduct
export type GetECommerceProductApiArg = string

export type CreateECommerceProductApiResponse =
  /** status 200 OK */ EcommerceProduct
export type CreateECommerceProductApiArg = PartialDeep<EcommerceProduct>

export type UpdateECommerceProductApiResponse = unknown
export type UpdateECommerceProductApiArg = EcommerceProduct // Product

export type DeleteECommerceProductApiResponse = unknown
export type DeleteECommerceProductApiArg = string // Product id

export type GetECommerceOrdersApiResponse =
  /** status 200 OK */ EcommerceOrder[]
export type GetECommerceOrdersApiArg = void

export type GetECommerceOrderApiResponse = /** status 200 OK */ EcommerceOrder
export type GetECommerceOrderApiArg = string // Order id

export type UpdateECommerceOrderApiResponse = unknown
export type UpdateECommerceOrderApiArg = EcommerceOrder // Order

export type DeleteECommerceOrderApiResponse = unknown
export type DeleteECommerceOrderApiArg = string // Order id

export type DeleteECommerceOrdersApiResponse = unknown
export type DeleteECommerceOrdersApiArg = string[] // Orders id

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
  useGetECommerceProductsQuery,
  useDeleteECommerceProductsMutation,
  useDeleteECommerceCouponsMutation,
  useGetECommerceCouponsQuery,
  useGetECommerceCouponQuery,
  useGetECommerceProductQuery,
  useUpdateECommerceProductMutation,
  useDeleteECommerceProductMutation,
  useCreateECommerceCouponMutation,
  useDeleteECommerceCouponMutation,
  useUpdateECommerceCouponMutation,
  useGetECommerceOrdersQuery,
  useGetECommerceOrderQuery,
  useUpdateECommerceOrderMutation,
  useDeleteECommerceOrderMutation,
  useDeleteECommerceOrdersMutation,
  useCreateECommerceProductMutation
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
