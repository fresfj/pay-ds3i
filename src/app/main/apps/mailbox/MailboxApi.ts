import { apiService as api } from 'app/store/apiService';
import { createSelector } from '@reduxjs/toolkit';
import _ from '@lodash';
import { AppRootStateType } from './store';
import { LabelColorsType } from './mail/labelColors';

export const addTagTypes = [
	'mailbox_mail',
	'mailbox_mails',
	'mailbox_filters',
	'mailbox_labels',
	'mailbox_label',
	'mailbox_folders'
] as const;

const MailboxApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getMailboxMails: build.query<GetMailboxMailsApiResponse, GetMailboxMailsApiArg>({
				query: (routeParams) => {
					let url = '/mock-api/mailbox/mails/';

					if (routeParams) {
						if (routeParams.folderHandle) {
							url += routeParams.folderHandle;
						}

						if (routeParams.labelHandle) {
							url += `labels/${routeParams.labelHandle}`;
						}

						if (routeParams.filterHandle) {
							url += `filters/${routeParams.filterHandle}`;
						}
					}

					return {
						url
					};
				},
				providesTags: ['mailbox_mails']
			}),
			getMailboxMail: build.query<GetMailboxMailApiResponse, GetMailboxMailApiArg>({
				query: (mailId) => ({
					url: `/mock-api/mailbox/mail/${mailId}`
				}),
				providesTags: ['mailbox_mail']
			}),
			applyMailboxMailAction: build.mutation<ApplyMailboxMailActionApiResponse, ApplyMailboxMailActionApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/mailbox/mails/actions`,
					method: 'POST',
					data: queryArg
				}),
				invalidatesTags: ['mailbox_mails', 'mailbox_mail']
			}),
			createMailboxMail: build.mutation<CreateMailboxMailApiResponse, CreateMailboxMailApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/mailbox/mails/${queryArg.folderSlug}`,
					method: 'POST',
					data: queryArg.mail
				}),
				invalidatesTags: ['mailbox_mails']
			}),
			getMailboxMailsByLabel: build.query<GetMailboxMailsByLabelApiResponse, GetMailboxMailsByLabelApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/mailbox/mails/labels/${queryArg.labelSlug}`
				}),
				providesTags: ['mailbox_mails']
			}),
			getMailboxMailsByFilter: build.query<GetMailboxMailsByFilterApiResponse, GetMailboxMailsByFilterApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/mailbox/mails/filters/${queryArg.filterSlug}`
				}),
				providesTags: ['mailbox_mails']
			}),
			getMailboxFilters: build.query<GetMailboxFiltersApiResponse, GetMailboxFiltersApiArg>({
				query: () => ({ url: `/mock-api/mailbox/filters` }),
				providesTags: ['mailbox_filters']
			}),
			getMailboxLabels: build.query<GetMailboxLabelsApiResponse, GetMailboxLabelsApiArg>({
				query: () => ({ url: `/mock-api/mailbox/labels` }),
				providesTags: ['mailbox_labels']
			}),
			updateMailboxLabel: build.mutation<UpdateMailboxLabelApiResponse, UpdateMailboxLabelApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/mailbox/labels/${queryArg.labelSlug}`,
					method: 'PUT',
					data: queryArg.label
				}),
				invalidatesTags: ['mailbox_label', 'mailbox_labels']
			}),
			getMailboxFolders: build.query<GetMailboxFoldersApiResponse, GetMailboxFoldersApiArg>({
				query: () => ({ url: `/mock-api/mailbox/folders` }),
				providesTags: ['mailbox_folders']
			})
		}),
		overrideExisting: false
	});

export default MailboxApi;

type RouteParams = {
	folderHandle?: string;
	labelHandle?: string;
	filterHandle?: string;
	mailId?: string;
};

export type GetMailboxMailsApiResponse = /** status 200 OK */ MailboxMail[];
export type GetMailboxMailsApiArg = RouteParams;

export type ApplyMailboxMailActionApiResponse = unknown;
export type ApplyMailboxMailActionApiArg = {
	type: MailboxAction;
	ids: string[];
	value: boolean | string | string[];
};

export type CreateMailboxMailApiResponse = unknown;
export type CreateMailboxMailApiArg = {
	/** folder slug */
	folderSlug: string;
	mail: MailboxMail;
};
export type GetMailboxMailsByLabelApiResponse = /** status 200 OK */ MailboxMail[];
export type GetMailboxMailsByLabelApiArg = {
	/** label slug */
	labelSlug: string;
};

export type GetMailboxMailApiResponse = MailboxMail;
export type GetMailboxMailApiArg = string;

export type GetMailboxMailsByFilterApiResponse = /** status 200 OK */ MailboxMail[];
export type GetMailboxMailsByFilterApiArg = {
	/** filter slug */
	filterSlug: string;
};

export type GetMailboxFiltersApiResponse = /** status 200 OK */ MailboxFilter[];
export type GetMailboxFiltersApiArg = void;

export type GetMailboxLabelsApiResponse = /** status 200 OK */ MailboxLabel[];
export type GetMailboxLabelsApiArg = void;

export type UpdateMailboxLabelApiResponse = /** status 200 OK */ MailboxLabel;
export type UpdateMailboxLabelApiArg = {
	/** label slug */
	labelSlug: string;
	label: MailboxLabel;
};

export type GetMailboxFoldersApiResponse = /** status 200 OK */ MailboxFolder[];
export type GetMailboxFoldersApiArg = void;

export type MailboxMailAttachment = {
	type: string;
	name: string;
	size: number;
	preview: string;
	downloadUrl: string;
};

export type MailboxMail = {
	id: string;
	type: string;
	from: {
		avatar: string;
		contact: string;
		email: string;
	};
	to: string;
	cc?: string[];
	bcc?: string[];
	date: string;
	subject: string;
	content: string;
	attachments: MailboxMailAttachment[];
	starred: boolean;
	important: boolean;
	unread: boolean;
	folder: string;
	labels: string[];
};

export type MailboxFilter = {
	id: string;
	title: string;
	slug: string;
	icon: string;
};

export type MailboxLabel = {
	id?: string;
	title?: string;
	slug?: string;
	color?: LabelColorsType;
};

export type MailboxFolder = {
	id: string;
	title: string;
	slug: string;
	icon: string;
};

export type MailboxAction =
	| 'important'
	| 'starred'
	| 'unread'
	| 'folder'
	| 'labels'
	| 'label'
	| 'sent'
	| 'drafts'
	| 'trash'
	| 'spam'
	| 'all';

export const {
	useGetMailboxMailsQuery,
	useApplyMailboxMailActionMutation,
	useCreateMailboxMailMutation,
	useGetMailboxMailsByLabelQuery,
	useGetMailboxMailsByFilterQuery,
	useGetMailboxFiltersQuery,
	useGetMailboxLabelsQuery,
	useUpdateMailboxLabelMutation,
	useGetMailboxFoldersQuery,
	useGetMailboxMailQuery
} = MailboxApi;

export type MailboxApiType = {
	[MailboxApi.reducerPath]: ReturnType<typeof MailboxApi.reducer>;
};

export const selectMails = (routeParams: RouteParams) => (state: AppRootStateType) =>
	MailboxApi.endpoints.getMailboxMails.select(routeParams)(state)?.data ?? [];

export const selectFolders = (state: AppRootStateType) =>
	MailboxApi.endpoints.getMailboxFolders.select()(state)?.data ?? [];

export const selectLabels = (state: AppRootStateType) =>
	MailboxApi.endpoints.getMailboxLabels.select()(state)?.data ?? [];

export const selectLabelById = (id: string) =>
	createSelector([selectLabels], (labels) => {
		return _.find(labels, { id });
	});

export const selectFilters = (state: AppRootStateType) =>
	MailboxApi.endpoints.getMailboxLabels.select()(state)?.data ?? [];

export const selectMailsTitle = (routeParams: RouteParams) =>
	createSelector([selectFolders, selectLabels, selectFilters], (folders, labels, filters) => {
		let title = '';

		if (routeParams.folderHandle) {
			title = _.find(folders, { slug: routeParams.folderHandle })?.title;
		}

		if (routeParams.labelHandle) {
			title = _.find(labels, { slug: routeParams.labelHandle })?.title;
		}

		if (routeParams.filterHandle) {
			title = _.find(filters, { slug: routeParams.filterHandle })?.title;
		}

		return title;
	});
