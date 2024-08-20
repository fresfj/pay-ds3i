import { createSelector } from '@reduxjs/toolkit'
import { apiService as api } from 'app/store/apiService'
import FuseUtils from '@fuse/utils'
import { selectSearchText } from './store/searchTextSlice'
import { AppRootStateType } from './store'

export const addTagTypes = [
  'customers_item',
  'customers',
  'customers_tag',
  'customers_tags',
  'countries'
] as const

const CustomersApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getCustomersList: build.query<
        GetCustomersListApiResponse,
        GetCustomersListApiArg
      >({
        query: () => ({ url: `/mock-api/customers` }),
        providesTags: ['customers']
      }),
      createCustomersItem: build.mutation<
        CreateCustomersItemApiResponse,
        CreateCustomersItemApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/customers`,
          method: 'POST',
          data: queryArg.customer
        }),
        invalidatesTags: ['customers']
      }),
      getCustomersParams: build.query<
        GetCustomersParamsApiResponse,
        GetCustomersParamsApiArg
      >({
        query: params => ({
          url: `/mock-api/customer`,
          params
        }),
        providesTags: ['customers_item']
      }),
      getCustomersItem: build.query<
        GetCustomersItemApiResponse,
        GetCustomersItemApiArg
      >({
        query: customerId => ({ url: `/mock-api/customers/${customerId}` }),
        providesTags: ['customers_item']
      }),
      updateCustomersItem: build.mutation<
        UpdateCustomersItemApiResponse,
        UpdateCustomersItemApiArg
      >({
        query: customer => ({
          url: `/mock-api/customers/${customer.id}`,
          method: 'PUT',
          data: customer
        }),
        invalidatesTags: ['customers_item', 'customers']
      }),
      deleteCustomersItem: build.mutation<
        DeleteCustomersItemApiResponse,
        DeleteCustomersItemApiArg
      >({
        query: customerId => ({
          url: `/mock-api/customers/${customerId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['customers']
      }),
      getCustomersTag: build.query<
        GetCustomersTagApiResponse,
        GetCustomersTagApiArg
      >({
        query: tagId => ({ url: `/mock-api/customers/tags/${tagId}` }),
        providesTags: ['customers_tag']
      }),
      updateCustomersTag: build.mutation<
        UpdateCustomersTagApiResponse,
        UpdateCustomersTagApiArg
      >({
        query: tag => ({
          url: `/mock-api/customers/tags/${tag.id}`,
          method: 'PUT',
          body: tag
        }),
        invalidatesTags: ['customers_tags']
      }),
      deleteCustomersTag: build.mutation<
        DeleteCustomersTagApiResponse,
        DeleteCustomersTagApiArg
      >({
        query: tagId => ({
          url: `/mock-api/customers/tags/${tagId}`,
          method: 'DELETE'
        }),
        invalidatesTags: ['customers_tags']
      }),
      getCustomersTags: build.query<
        GetCustomerTagsApiResponse,
        GetCustomerTagsApiArg
      >({
        query: () => ({ url: `/mock-api/customers/tags` }),
        providesTags: ['customers_tags']
      }),
      getCustomersCountries: build.query<
        GetCustomersCountriesApiResponse,
        GetCustomersCountriesApiArg
      >({
        query: () => ({ url: `/mock-api/countries` }),
        providesTags: ['countries']
      }),
      createCustomersTag: build.mutation<
        CreateCustomersTagApiResponse,
        CreateCustomersTagApiArg
      >({
        query: queryArg => ({
          url: `/mock-api/customers/tags`,
          method: 'POST',
          body: queryArg.tag
        }),
        invalidatesTags: ['customers_tags']
      })
    }),
    overrideExisting: false
  })

export default CustomersApi

export type GetCustomersParamsApiResponse =
  /** status 200 User Found */ Customer[]
export type GetCustomersParamsApiArg = string

export type GetCustomersItemApiResponse = /** status 200 User Found */ Customer
export type GetCustomersItemApiArg = string

export type UpdateCustomersItemApiResponse =
  /** status 200 Customer Updated */ Customer
export type UpdateCustomersItemApiArg = Customer

export type DeleteCustomersItemApiResponse = unknown
export type DeleteCustomersItemApiArg = string

export type GetCustomersListApiResponse = /** status 200 OK */ Customer[]
export type GetCustomersListApiArg = void

export type CreateCustomersItemApiResponse = /** status 201 Created */ Customer
export type CreateCustomersItemApiArg = {
  customer: Customer
}

export type GetCustomersTagApiResponse = /** status 200 Tag Found */ Tag
export type GetCustomersTagApiArg = string

export type GetCustomersCountriesApiResponse = /** status 200 */ Country[]
export type GetCustomersCountriesApiArg = void

export type UpdateCustomersTagApiResponse = /** status 200 */ Tag
export type UpdateCustomersTagApiArg = Tag

export type DeleteCustomersTagApiResponse = unknown
export type DeleteCustomersTagApiArg = string

export type GetCustomerTagsApiResponse = /** status 200 OK */ Tag[]
export type GetCustomerTagsApiArg = void

export type CreateCustomersTagApiResponse = /** status 200 OK */ Tag
export type CreateCustomersTagApiArg = {
  tag: Tag
}

export type CustomerPhoneNumber = {
  country: string
  phoneNumber: string
  label?: string
}

export type CustomerEmail = {
  email: string
  label?: string
}
export type CustomerAddress = {
  address?: string
}
export type CustomerSubscriptions = {
  description?: string
  status?: string
  value?: number
  dueDate?: string
  object?: number
  confirmedDate?: string
  subscription?: string
}
export type CustomerCreditCard = {
  creditCardBrand?: string
  creditCardNumber?: string
}
export type CustomerSubscription = {
  description?: string
  billingType?: string
  creditCard?: CustomerCreditCard
  status?: string
  value?: number
  object?: number
  cycle?: number
  subscription?: string
}
export type Customer = {
  id: string
  customerId?: string
  avatar?: string
  cpfCnpj?: string
  background?: string
  invoiceAddress?: CustomerAddress
  shippingAddress?: CustomerAddress
  addressNumber?: string
  neighborhood?: string
  city?: string
  state?: string
  postalCode?: string
  name: string
  email?: string
  phone?: string
  complement?: string
  emails?: CustomerEmail[]
  phoneNumbers?: CustomerPhoneNumber[]
  title?: string
  company?: string
  birthday?: string
  address?: string
  notes?: string
  tags?: string[]
  subscription?: CustomerSubscription
  subscriptions?: CustomerSubscriptions[]
}

export type Tag = {
  id: string
  title: string
}

export type Country = {
  id?: string
  title?: string
  iso?: string
  code?: string
  flagImagePos?: string
}

export type GroupedCustomers = {
  group: string
  children?: Customer[]
}

export type AccumulatorType = {
  [key: string]: GroupedCustomers
}

export const {
  useGetCustomersParamsQuery,
  useGetCustomersItemQuery,
  useUpdateCustomersItemMutation,
  useDeleteCustomersItemMutation,
  useGetCustomersListQuery,
  useCreateCustomersItemMutation,
  useGetCustomersTagQuery,
  useGetCustomersCountriesQuery,
  useUpdateCustomersTagMutation,
  useDeleteCustomersTagMutation,
  useGetCustomersTagsQuery,
  useCreateCustomersTagMutation
} = CustomersApi

export type CustomersApiType = {
  [CustomersApi.reducerPath]: ReturnType<typeof CustomersApi.reducer>
}

export const selectCustomerList = (state: AppRootStateType) =>
  CustomersApi.endpoints.getCustomersList.select()(state)?.data ?? []

/**
 * Select filtered customers
 */
export const selectCustomerById = async (customer: Customer) =>
  CustomersApi.endpoints.getCustomersParams.select(customer as any)

export const selectFilteredCustomerList = (customers: Customer[]) =>
  createSelector([selectSearchText], searchText => {
    if (!customers) {
      return []
    }

    if (searchText.length === 0) {
      return customers
    }

    return FuseUtils.filterArrayByString<Customer>(customers, searchText)
  })

/**
 * Select grouped customers
 */
export const selectGroupedFilteredCustomers = (customers: Customer[]) =>
  createSelector([selectFilteredCustomerList(customers)], customers => {
    if (!customers) {
      return []
    }

    const sortedCustomers = [...customers]?.sort((a, b) =>
      a?.name?.localeCompare(b.name, 'es', { sensitivity: 'base' })
    )

    const groupedObject: {
      [key: string]: GroupedCustomers
    } = sortedCustomers?.reduce<AccumulatorType>((r, e) => {
      // get first letter of name of current element
      const group = e.name[0]

      // if there is no property in accumulator with this letter create it
      if (!r[group]) r[group] = { group, children: [e] }
      // if there is push current element to children array for that letter
      else {
        r[group]?.children?.push(e)
      }

      // return accumulator
      return r
    }, {})

    return groupedObject
  })
