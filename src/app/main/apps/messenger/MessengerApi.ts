import { apiService as api } from 'app/store/apiService';
import { PartialObjectDeep } from 'type-fest/source/partial-deep';

export const addTagTypes = [
	'messenger_contacts',
	'messenger_contact',
	'messenger_chats',
	'messenger_chat',
	'messenger_user_profile'
] as const;

const MessengerApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getMessengerContacts: build.query<GetMessengerContactsApiResponse, GetMessengerContactsApiArg>({
				query: () => ({ url: `/mock-api/messenger/contacts` }),
				providesTags: ['messenger_contacts']
			}),
			getMessengerContact: build.query<GetMessengerContactApiResponse, GetMessengerContactApiArg>({
				query: (queryArg) => ({ url: `/mock-api/messenger/contacts/${queryArg}` }),
				providesTags: ['messenger_contact']
			}),
			updateMessengerContact: build.mutation<UpdateMessengerContactApiResponse, UpdateMessengerContactApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/messenger/contacts/${queryArg.id}`,
					method: 'PUT',
					data: queryArg
				}),
				invalidatesTags: ['messenger_contact']
			}),
			deleteMessengerContact: build.mutation<DeleteMessengerContactApiResponse, DeleteMessengerContactApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/messenger/contacts/${queryArg}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['messenger_contact']
			}),
			getMessengerChats: build.query<GetMessengerChatsApiResponse, GetMessengerChatsApiArg>({
				query: () => ({ url: `/mock-api/messenger/chats` }),
				providesTags: ['messenger_chats']
			}),
			getMessengerChat: build.query<GetMessengerChatApiResponse, GetMessengerChatApiArg>({
				query: (queryArg) => ({ url: `/mock-api/messenger/chats/${queryArg}` }),
				providesTags: ['messenger_chat']
			}),
			deleteMessengerChat: build.mutation<DeleteMessengerChatApiResponse, DeleteMessengerChatApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/messenger/chats/${queryArg}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['messenger_chats']
			}),
			sendMessengerMessage: build.mutation<SendMessengerMessageApiResponse, SendMessengerMessageApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/messenger/chats/${queryArg.contactId}`,
					method: 'POST',
					data: queryArg.message
				}),
				invalidatesTags: ['messenger_chat', 'messenger_chats']
			}),
			getMessengerUserProfile: build.query<GetMessengerUserProfileApiResponse, GetMessengerUserProfileApiArg>({
				query: () => ({ url: `/mock-api/messenger/profile` }),
				providesTags: ['messenger_user_profile']
			}),
			updateMessengerUserProfile: build.mutation<
				UpdateMessengerUserProfileApiResponse,
				UpdateMessengerUserProfileApiArg
			>({
				query: (queryArg) => ({
					url: `/mock-api/messenger/profile`,
					method: 'PUT',
					data: queryArg
				}),
				invalidatesTags: ['messenger_user_profile']
			})
		}),
		overrideExisting: false
	});
export default MessengerApi;

export type GetMessengerContactsApiResponse = /** status 200 OK */ Contact[];
export type GetMessengerContactsApiArg = void;

export type GetMessengerContactApiResponse = /** status 200 OK */ Contact;
export type GetMessengerContactApiArg = string;

export type UpdateMessengerContactApiResponse = unknown;
export type UpdateMessengerContactApiArg = Contact;

export type DeleteMessengerContactApiResponse = unknown;
export type DeleteMessengerContactApiArg = string;

export type GetMessengerChatsApiResponse = /** status 200 OK */ Chat[];
export type GetMessengerChatsApiArg = void;

export type GetMessengerChatApiResponse = /** status 200 OK */ Message[];
export type GetMessengerChatApiArg = string;

export type DeleteMessengerChatApiResponse = unknown;
export type DeleteMessengerChatApiArg = string;

export type SendMessengerMessageApiArg = {
	contactId: string;
	message: string;
};
export type SendMessengerMessageApiResponse = Message[];

export type GetMessengerUserProfileApiResponse = Profile;
export type GetMessengerUserProfileApiArg = void;

export type UpdateMessengerUserProfileApiResponse = Profile;
export type UpdateMessengerUserProfileApiArg = PartialObjectDeep<Profile, object>;

export type ContactStatusType = 'online' | 'do-not-disturb' | 'away' | 'offline';

export type Contact = {
	id: string;
	avatar?: string | null;
	name: string;
	about: string;
	details: {
		emails: {
			email: string;
			label: string;
		}[];
		phoneNumbers: {
			country: string;
			phoneNumber: string;
			label: string;
		}[];
		title?: string;
		company: string;
		birthday: string;
		address: string;
	};
	attachments: {
		media: string[];
		docs: string[];
		links: string[];
	};
	status: ContactStatusType;
};

export type Chat = {
	id: string;
	contactId: string;
	unreadCount: number;
	muted: boolean;
	lastMessage: string;
	lastMessageAt: string;
};

export type Message = {
	id: string;
	chatId: string;
	contactId: string;
	value: string;
	createdAt: string;
};

export type Task = {
	id: string;
	type: string;
	title: string;
	notes: string;
	completed: boolean;
	dueDate?: string | null;
	priority: number;
	tags: string[];
	assignedTo?: string;
	subTasks: {
		id: string;
		title: string;
		completed: boolean;
	}[];
	order: number;
};

export type Profile = {
	id: string;
	name: string;
	email: string;
	avatar: string;
	about: string;
};

export const {
	useGetMessengerContactsQuery,
	useGetMessengerContactQuery,
	useUpdateMessengerContactMutation,
	useDeleteMessengerContactMutation,
	useGetMessengerChatsQuery,
	useGetMessengerChatQuery,
	useDeleteMessengerChatMutation,
	useGetMessengerUserProfileQuery,
	useUpdateMessengerUserProfileMutation,
	useSendMessengerMessageMutation
} = MessengerApi;
