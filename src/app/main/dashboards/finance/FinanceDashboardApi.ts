import { apiService as api } from 'app/store/apiService'

export const addTagTypes = [
  'finance_dashboard_widgets',
  'finance_dashboard_subscriptions',
  'finance_dashboard'
] as const

const FinanceDashboardApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getFinanceDashboardWidgets: build.query<
        GetFinanceDashboardWidgetsApiResponse,
        GetFinanceDashboardWidgetsApiArg
      >({
        query: () => ({ url: `/mock-api/dashboards/finance/widgets` }),
        providesTags: ['finance_dashboard_widgets']
      }),
      getFinanceDashboardSubscriptions: build.query<
        GetFinanceDashboardSubscriptionsApiResponse,
        GetFinanceDashboardSubscriptionsApiArg
      >({
        query: () => ({ url: `/mock-api/dashboards/finance/subscriptions` }),
        providesTags: ['finance_dashboard_subscriptions']
      }),
      getFinanceDashboard: build.query<
        GetFinanceDashboardApiResponse,
        GetFinanceDashboardApiArg
      >({
        query: () => ({ url: `/mock-api/dashboards/finance` }),
        providesTags: ['finance_dashboard']
      })
    }),
    overrideExisting: false
  })

type CustomerProps = {
  name: string
  cpfCnpj: string
}
type SubscriptionProps = {
  value: number
}
type SubscriptionsProps = {
  dueDate: string
  status: string
}

export type Subscriptions = {
  customer: CustomerProps
  subscription: SubscriptionProps
  subscriptions: SubscriptionsProps[]
}
export default FinanceDashboardApi

export type GetFinanceDashboardWidgetsApiResponse = /** status 200 OK */ object
export type GetFinanceDashboardWidgetsApiArg = void

export type GetFinanceDashboardSubscriptionsApiResponse =
  /** status 200 OK */ Subscriptions[]
export type GetFinanceDashboardSubscriptionsApiArg = void

export type GetFinanceDashboardApiResponse =
  /** status 200 OK */ Subscriptions[]
export type GetFinanceDashboardApiArg = void

export const {
  useGetFinanceDashboardWidgetsQuery,
  useGetFinanceDashboardSubscriptionsQuery,
  useGetFinanceDashboardQuery
} = FinanceDashboardApi

export type FinanceDashboardApiType = {
  [FinanceDashboardApi.reducerPath]: ReturnType<
    typeof FinanceDashboardApi.reducer
  >
}

export const selectWidget =
  <T>(id: string) =>
  (state: FinanceDashboardApiType) => {
    const widgets =
      FinanceDashboardApi.endpoints.getFinanceDashboardWidgets.select()(
        state
      )?.data
    return widgets?.[id] as T
  }
