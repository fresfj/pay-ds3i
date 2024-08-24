import { apiService as api } from 'app/store/apiService'
import { createSelector } from '@reduxjs/toolkit'
import FuseUtils from '@fuse/utils'
import { PartialDeep } from 'type-fest'
import { selectSearchText } from './store/searchTextSlice'
import ProductModel from './product/models/ProductModel'
import { selectFilters } from './store/filtersSlice'
import _ from '@lodash'
import { orderBy } from '@fuse/utils/helper'

export const addTagTypes = ['shop_products', 'shop_product'] as const

const ShopApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getShopProducts: build.query<
        GetShopProductsApiResponse,
        GetShopProductsApiArg
      >({
        query: () => ({ url: `/mock-api/ecommerce/shop/products` }),
        providesTags: ['shop_products']
      }),
      getShopPlans: build.query<
        GetShopProductsApiResponse,
        GetShopProductsApiArg
      >({
        query: () => ({ url: `/mock-api/ecommerce/shop/plans` }),
        providesTags: ['shop_products']
      }),
      deleteShopProducts: build.mutation<
        DeleteShopProductsApiResponse,
        DeleteShopProductsApiArg
      >({
        query: productIds => ({
          url: `/mock-api/ecommerce/products`,
          method: 'DELETE',
          data: productIds
        }),
        invalidatesTags: ['shop_products']
      }),
      getShopProduct: build.query<
        GetShopProductApiResponse,
        GetShopProductApiArg
      >({
        query: productId => ({
          url: `/mock-api/ecommerce/products/${productId}`
        }),
        providesTags: ['shop_product', 'shop_products']
      }),
      createShopProduct: build.mutation<
        CreateShopProductApiResponse,
        CreateShopProductApiArg
      >({
        query: newProduct => ({
          url: `/mock-api/ecommerce/products`,
          method: 'POST',
          data: ProductModel(newProduct)
        }),
        invalidatesTags: ['shop_products', 'shop_product']
      }),
      updateShopProduct: build.mutation<
        UpdateShopProductApiResponse,
        UpdateShopProductApiArg
      >({
        query: product => ({
          url: `/mock-api/ecommerce/products/${product.id}`,
          method: 'PUT',
          data: product
        }),
        invalidatesTags: ['shop_product', 'shop_products']
      }),
      deleteShopProduct: build.mutation<
        DeleteShopProductApiResponse,
        DeleteShopProductApiArg
      >({
        query: productId => ({
          url: `/mock-api/ecommerce/products/${productId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['shop_product', 'shop_products']
      })
    }),
    overrideExisting: false
  })

export default ShopApi

export type GetShopProductsApiResponse = /** status 200 OK */ EcommerceProduct[]
export type GetShopProductsApiArg = void

export type DeleteShopProductsApiResponse = unknown
export type DeleteShopProductsApiArg = string[] /** Product ids */

export type GetShopCouponsApiResponse = /** status 200 OK */ EcommerceProduct[]
export type GetShopCouponsApiArg = void

export type DeleteShopCouponsApiResponse = unknown
export type DeleteShopCouponsApiArg = string[] /** Product ids */

export type GetShopCouponApiResponse = /** status 200 OK */ EcommerceCoupon
export type GetShopCouponApiArg = string

export type CreateShopCouponApiResponse = /** status 200 OK */ EcommerceCoupon
export type CreateShopCouponApiArg = PartialDeep<EcommerceCoupon>

export type UpdateShopCouponApiResponse = unknown
export type UpdateShopCouponApiArg = EcommerceCoupon // Coupon

export type DeleteShopCouponApiResponse = unknown
export type DeleteShopCouponApiArg = string // Order id

export type GetShopProductApiResponse = /** status 200 OK */ EcommerceProduct
export type GetShopProductApiArg = string

export type CreateShopProductApiResponse = /** status 200 OK */ EcommerceProduct
export type CreateShopProductApiArg = PartialDeep<EcommerceProduct>

export type UpdateShopProductApiResponse = unknown
export type UpdateShopProductApiArg = EcommerceProduct // Product

export type DeleteShopProductApiResponse = unknown
export type DeleteShopProductApiArg = string // Product id

export type GetShopOrdersApiResponse = /** status 200 OK */ EcommerceOrder[]
export type GetShopOrdersApiArg = void

export type GetShopOrderApiResponse = /** status 200 OK */ EcommerceOrder
export type GetShopOrderApiArg = string // Order id

export type UpdateShopOrderApiResponse = unknown
export type UpdateShopOrderApiArg = EcommerceOrder // Order

export type DeleteShopOrderApiResponse = unknown
export type DeleteShopOrderApiArg = string // Order id

export type DeleteShopOrdersApiResponse = unknown
export type DeleteShopOrdersApiArg = string[] // Orders id

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
  gender?: string
  colors?: string[]
  sizes?: string[]
  rating?: string
  category?: string
  price?: number
  priceRange?: string
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
  createdAt: Date
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
  label?: {
    color:
      | 'inherit'
      | 'default'
      | 'primary'
      | 'secondary'
      | 'info'
      | 'success'
      | 'warning'
      | 'error'
      | string
    content: string
    enabled: boolean
  }
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
  useGetShopProductsQuery,
  useGetShopPlansQuery,
  useDeleteShopProductsMutation,
  useGetShopProductQuery,
  useUpdateShopProductMutation,
  useDeleteShopProductMutation,
  useCreateShopProductMutation
} = ShopApi

export type ShopApiType = {
  [ShopApi.reducerPath]: ReturnType<typeof ShopApi.reducer>
}

/**
 * Select products
 */
/**
 * Select filtered products
 */
export const selectFilteredProducts = (
  products: EcommerceProduct[],
  sortBy: string
) =>
  createSelector(
    [selectSearchText, selectFilters],
    (searchText = '', filters) => {
      // Filtragem por texto de busca
      let filteredProducts =
        searchText.length === 0
          ? products
          : FuseUtils.filterArrayByString<EcommerceProduct>(
              products,
              searchText
            )
      // Filtragem por gênero
      if (filters.gender.length > 0 && filteredProducts !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          filters.gender.includes(product.gender)
        )
      }

      // Filtragem por cores
      if (filters.colors.length > 0 && filteredProducts !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          filters.colors.some(color => product.colors.includes(color))
        )
      }

      // // Filtragem por classificação
      // if (filters.rating) {
      //   filteredProducts = filteredProducts.filter(
      //     product =>
      //       product.rating >= parseInt(filters.rating.replace('up', ''))
      //   )
      // }

      // Filtragem por categoria
      if (filters.category !== 'all' && filteredProducts !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
          product.categories.includes(filters.category)
        )
      }

      // Filtragem por faixa de preço
      const [minPrice, maxPrice] = filters.priceRange
      if (filteredProducts !== undefined) {
        filteredProducts = filteredProducts.filter(
          product =>
            product?.priceTaxIncl >= minPrice &&
            product?.priceTaxIncl <= maxPrice
        )
      }

      // Ordenação dos produtos
      if (sortBy === 'featured' && filteredProducts !== undefined) {
        filteredProducts = orderBy(
          filteredProducts,
          ['comparedPrice'],
          ['desc']
        )
      }

      if (sortBy === 'newest' && filteredProducts !== undefined) {
        filteredProducts = orderBy(filteredProducts, ['createdAt'], ['desc'])
      }

      if (sortBy === 'priceDesc' && filteredProducts !== undefined) {
        filteredProducts = orderBy(filteredProducts, ['priceTaxIncl'], ['desc'])
      }

      if (sortBy === 'priceAsc' && filteredProducts !== undefined) {
        filteredProducts = orderBy(filteredProducts, ['priceTaxIncl'], ['asc'])
      }
      return filteredProducts
    }
  )
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
