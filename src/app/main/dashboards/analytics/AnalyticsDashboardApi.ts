import { apiService as api } from 'app/store/apiService';
import { appSelector } from 'app/store/store';

export const addTagTypes = ['analytics_dashboard_widgets'] as const;

const AnalyticsDashboardApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAnalyticsDashboardWidgets: build.query<
				GetAnalyticsDashboardWidgetsApiResponse,
				GetAnalyticsDashboardWidgetsApiArg
			>({
				query: () => ({ url: `/mock-api/dashboards/analytics/widgets` }),
				providesTags: ['analytics_dashboard_widgets']
			})
		}),
		overrideExisting: false
	});
export default AnalyticsDashboardApi;

export type GetAnalyticsDashboardWidgetsApiResponse = object;
export type GetAnalyticsDashboardWidgetsApiArg = void;

export const { useGetAnalyticsDashboardWidgetsQuery } = AnalyticsDashboardApi;

export type AnalyticsDashboardApiType = {
	[AnalyticsDashboardApi.reducerPath]: ReturnType<typeof AnalyticsDashboardApi.reducer>;
};

export const selectWidget = <T>(id: string) =>
	appSelector((state: AnalyticsDashboardApiType) => {
		const widgets = AnalyticsDashboardApi.endpoints.getAnalyticsDashboardWidgets.select()(state)?.data;
		return widgets?.[id] as T;
	});
