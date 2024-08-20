import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['icons_list'] as const;
const IconsApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getIconsList: build.query<GetIconsListApiResponse, GetIconsListApiArg>({
				query: (url) => ({ url }),
				providesTags: ['icons_list']
			})
		}),
		overrideExisting: false
	});
export default IconsApi;

export type GetIconsListApiResponse = /** status 200 OK */ string[];
export type GetIconsListApiArg = string;

export const { useGetIconsListQuery } = IconsApi;
