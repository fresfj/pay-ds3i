import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['crypto_dashboard_widgets'] as const;

const CryptoDashboardApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getCryptoDashboardWidgets: build.query<
				GetCryptoDashboardWidgetsApiResponse,
				GetCryptoDashboardWidgetsApiArg
			>({
				query: () => ({ url: `/mock-api/dashboards/crypto/widgets` }),
				providesTags: ['crypto_dashboard_widgets']
			})
		}),
		overrideExisting: false
	});
export default CryptoDashboardApi;

export type GetCryptoDashboardWidgetsApiResponse = /** status 200 OK */ object;
export type GetCryptoDashboardWidgetsApiArg = void;

export const { useGetCryptoDashboardWidgetsQuery } = CryptoDashboardApi;

export type CryptoDashboardApiType = {
	[CryptoDashboardApi.reducerPath]: ReturnType<typeof CryptoDashboardApi.reducer>;
};

export const selectWidget =
	<T>(id: string) =>
	(state: CryptoDashboardApiType) => {
		const widgets = CryptoDashboardApi.endpoints.getCryptoDashboardWidgets.select()(state)?.data;
		return widgets?.[id] as T;
	};
