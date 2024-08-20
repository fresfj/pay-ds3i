import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import Axios, { AxiosError, AxiosRequestConfig } from 'axios';

const axiosBaseQuery =
	(): BaseQueryFn<AxiosRequestConfig<unknown>, unknown, AxiosError> =>
	async ({ url, method, data, params }) => {
		try {
			Axios.defaults.baseURL = '/api';
			const result = await Axios({
				url,
				method,
				data,
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				params
			});
			return { data: result.data };
		} catch (axiosError) {
			const error = axiosError as AxiosError;
			return {
				error
			};
		}
	};

export const apiService = createApi({
	baseQuery: axiosBaseQuery(),
	endpoints: () => ({}),
	reducerPath: 'apiService'
});

export default apiService;
