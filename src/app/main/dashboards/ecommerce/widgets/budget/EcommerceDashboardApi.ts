import { apiService as api } from 'app/store/apiService'

export const addTagTypes = [
  'ecommerce_dashboard_widgets',
  'ecommerce_dashboard_projects',
  'ecommerce_dashboard_coupons'
] as const
const EcommerceDashboardApi = api
  .enhanceEndpoints({
    addTagTypes
  })
  .injectEndpoints({
    endpoints: build => ({
      getEcommerceDashboardWidgets: build.query<
        GetEcommerceDashboardWidgetsApiResponse,
        GetEcommerceDashboardWidgetsApiArg
      >({
        query: () => ({ url: `/mock-api/dashboards/e-commerce/widgets` }),
        providesTags: ['ecommerce_dashboard_widgets']
      }),
      getEcommerceDashboardProjects: build.query<
        GetEcommerceDashboardProjectsApiResponse,
        GetEcommerceDashboardProjectsApiArg
      >({
        query: () => ({ url: `/mock-api/dashboards/e-commerce/projects` }),
        providesTags: ['ecommerce_dashboard_projects']
      }),
      getEcommerceDashboardCoupons: build.query<
        GetEcommerceDashboardCouponsApiResponse,
        GetEcommerceDashboardCouponsApiArg
      >({
        query: () => ({ url: `/mock-api/dashboards/e-commerce/coupons` }),
        providesTags: ['ecommerce_dashboard_coupons']
      })
    }),
    overrideExisting: false
  })
export default EcommerceDashboardApi

export type GetEcommerceDashboardWidgetsApiResponse =
  /** status 200 OK */ object
export type GetEcommerceDashboardWidgetsApiArg = void

export type GetEcommerceDashboardProjectsApiResponse =
  /** status 200 OK */ ProjectType[]
export type GetEcommerceDashboardProjectsApiArg = void

export type GetEcommerceDashboardCouponsApiResponse =
  /** status 200 OK */ object
export type GetEcommerceDashboardCouponsApiArg = void
export type ProjectType = {
  id: number
  name: string
}

export const {
  useGetEcommerceDashboardWidgetsQuery,
  useGetEcommerceDashboardProjectsQuery,
  useGetEcommerceDashboardCouponsQuery
} = EcommerceDashboardApi

export type EcommerceDashboardApiType = {
  [EcommerceDashboardApi.reducerPath]: ReturnType<
    typeof EcommerceDashboardApi.reducer
  >
}

export const selectWidget =
  <T>(id: string) =>
  (state: EcommerceDashboardApiType) => {
    const widgets =
      EcommerceDashboardApi.endpoints.getEcommerceDashboardWidgets.select()(
        state
      )?.data
    return widgets?.[id] as T
  }
