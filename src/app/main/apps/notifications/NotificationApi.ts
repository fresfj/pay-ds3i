import { apiService as api } from 'app/store/apiService';

export const addTagTypes = ['notifications', 'notification'] as const;

const NotificationApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getAllNotifications: build.query<GetAllNotificationsApiResponse, GetAllNotificationsApiArg>({
				query: () => ({ url: `/mock-api/notifications` }),
				providesTags: ['notifications']
			}),
			createNotification: build.mutation<CreateNotificationApiResponse, CreateNotificationApiArg>({
				query: (notification) => ({
					url: `/mock-api/notifications`,
					method: 'POST',
					data: notification
				}),
				invalidatesTags: ['notifications']
			}),
			deleteAllNotifications: build.mutation<DeleteAllNotificationsApiResponse, DeleteAllNotificationsApiArg>({
				query: () => ({ url: `/mock-api/notifications`, method: 'DELETE' }),
				invalidatesTags: ['notifications']
			}),
			getNotification: build.query<GetNotificationApiResponse, GetNotificationApiArg>({
				query: (notificationId) => ({
					url: `/mock-api/notifications/${notificationId}`
				}),
				providesTags: ['notification']
			}),
			deleteNotification: build.mutation<DeleteNotificationApiResponse, DeleteNotificationApiArg>({
				query: (notificationId) => ({
					url: `/mock-api/notifications/${notificationId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['notifications']
			})
		}),
		overrideExisting: false
	});
export default NotificationApi;

export type GetAllNotificationsApiResponse = /** status 200 OK */ Notification[];
export type GetAllNotificationsApiArg = void;

export type CreateNotificationApiResponse = unknown;
export type CreateNotificationApiArg = Notification;

export type DeleteAllNotificationsApiResponse = unknown;
export type DeleteAllNotificationsApiArg = void;

export type GetNotificationApiResponse = /** status 200 OK */ Notification;
export type GetNotificationApiArg = string; /** notification id */

export type DeleteNotificationApiResponse = unknown;
export type DeleteNotificationApiArg = string; /** notification id */

export type Notification = {
	id?: string;
	icon?: string;
	title?: string;
	description?: string;
	time?: string;
	read?: boolean;
	link?: string;
	useRouter?: boolean;
};

export const {
	useGetAllNotificationsQuery,
	useCreateNotificationMutation,
	useDeleteAllNotificationsMutation,
	useGetNotificationQuery,
	useDeleteNotificationMutation
} = NotificationApi;
