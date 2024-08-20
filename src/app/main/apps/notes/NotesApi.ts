import { apiService as api } from 'app/store/apiService';
import { AppRootStateType } from './store';

export const addTagTypes = [
	'notes_list',
	'notes_item',
	'notes_labels',
	'notes_label',
	'notes_archived_items',
	'notes_reminder_items'
] as const;

const NotesApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getNotesList: build.query<GetNotesListApiResponse, GetNotesListApiArg>({
				query: (routeParams) => {
					const { filter, id } = routeParams;
					let url = '';

					if (filter === 'labels') {
						url = `/mock-api/notes/labels/${id}`;
					}

					if (filter === 'archive') {
						url = `/mock-api/notes/archive`;
					}

					if (filter === 'reminders') {
						url = `/mock-api/notes/reminders`;
					}

					if (!filter) {
						url = `/mock-api/notes`;
					}

					return {
						url
					};
				},
				providesTags: ['notes_list']
			}),
			createNotesItem: build.mutation<CreateNotesItemApiResponse, CreateNotesItemApiArg>({
				query: (note) => ({
					url: `/mock-api/notes`,
					method: 'POST',
					data: note
				}),
				invalidatesTags: ['notes_list', 'notes_item']
			}),
			getNotesItem: build.query<GetNotesItemApiResponse, GetNotesItemApiArg>({
				query: (queryArg) => ({ url: `/mock-api/notes/${queryArg.noteId}` }),
				providesTags: ['notes_item']
			}),
			updateNotesItem: build.mutation<UpdateNotesItemApiResponse, UpdateNotesItemApiArg>({
				query: (note) => ({
					url: `/mock-api/notes/${note.id}`,
					method: 'PUT',
					data: note
				}),
				invalidatesTags: ['notes_item', 'notes_list']
			}),
			deleteNotesItem: build.mutation<DeleteNotesItemApiResponse, DeleteNotesItemApiArg>({
				query: (noteId) => ({
					url: `/mock-api/notes/${noteId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['notes_list']
			}),
			getNotesLabels: build.query<GetNotesLabelsApiResponse, GetNotesLabelsApiArg>({
				query: () => ({ url: `/mock-api/notes/labels` }),
				providesTags: ['notes_labels']
			}),
			createNotesLabel: build.mutation<CreateNotesLabelApiResponse, CreateNotesLabelApiArg>({
				query: (noteLabel) => ({
					url: `/mock-api/notes/labels`,
					method: 'POST',
					data: noteLabel
				}),
				invalidatesTags: ['notes_label', 'notes_labels']
			}),
			getNotesLabel: build.query<GetNotesLabelApiResponse, GetNotesLabelApiArg>({
				query: (queryArg) => ({ url: `/mock-api/notes/labels/${queryArg.labelId}` }),
				providesTags: ['notes_label']
			}),
			updateNotesLabel: build.mutation<UpdateNotesLabelApiResponse, UpdateNotesLabelApiArg>({
				query: (notesLabel) => ({
					url: `/mock-api/notes/labels/${notesLabel.id}`,
					method: 'PUT',
					data: notesLabel
				}),
				invalidatesTags: ['notes_labels']
			}),
			deleteNotesLabel: build.mutation<DeleteNotesLabelApiResponse, DeleteNotesLabelApiArg>({
				query: (labelId) => ({
					url: `/mock-api/notes/labels/${labelId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['notes_labels']
			}),
			getNotesArchivedItems: build.query<GetNotesArchivedItemsApiResponse, GetNotesArchivedItemsApiArg>({
				query: () => ({ url: `/mock-api/notes/archive` }),
				providesTags: ['notes_archived_items']
			}),
			getNotesReminderItems: build.query<GetNotesReminderItemsApiResponse, GetNotesReminderItemsApiArg>({
				query: () => ({ url: `/mock-api/notes/reminder` }),
				providesTags: ['notes_reminder_items']
			})
		}),
		overrideExisting: false
	});
export { NotesApi };

export type RouteParams = Partial<{
	filter: string;
	id: string;
}>;

export type GetNotesListApiResponse = /** status 200 OK */ NotesNote[];
export type GetNotesListApiArg = RouteParams;

export type CreateNotesItemApiResponse = unknown;
export type CreateNotesItemApiArg = NotesNote;

export type GetNotesItemApiResponse = /** status 200 OK */ NotesNote;
export type GetNotesItemApiArg = {
	/** note id */
	noteId: string;
};

export type UpdateNotesItemApiResponse = unknown;
export type UpdateNotesItemApiArg = NotesNote;

export type DeleteNotesItemApiResponse = unknown;
export type DeleteNotesItemApiArg = string;

export type GetNotesLabelsApiResponse = /** status 200 OK */ NotesLabel[];
export type GetNotesLabelsApiArg = void;

export type CreateNotesLabelApiResponse = unknown;
export type CreateNotesLabelApiArg = NotesLabel;

export type GetNotesLabelApiResponse = /** status 200 OK */ NotesLabel;
export type GetNotesLabelApiArg = {
	/** label id */
	labelId: string;
};

export type UpdateNotesLabelApiResponse = unknown;
export type UpdateNotesLabelApiArg = NotesLabel;

export type DeleteNotesLabelApiResponse = unknown;
export type DeleteNotesLabelApiArg = string;

export type GetNotesArchivedItemsApiResponse = /** status 200 OK */ NotesNote[];
export type GetNotesArchivedItemsApiArg = void;

export type GetNotesReminderItemsApiResponse = /** status 200 OK */ NotesNote[];
export type GetNotesReminderItemsApiArg = void;

export type NoteListItemType = {
	id: string;
	content: string;
	completed: boolean;
};

export type NotesNote = {
	id: string;
	title: string;
	content: string;
	tasks?: NoteListItemType[];
	image?: string | null;
	reminder?: string | null;
	labels: string[];
	archived: boolean;
	createdAt: string;
	updatedAt?: string | null;
};

export type NotesLabel = {
	id: string;
	title: string;
};

export const {
	useGetNotesListQuery,
	useCreateNotesItemMutation,
	useGetNotesItemQuery,
	useUpdateNotesItemMutation,
	useDeleteNotesItemMutation,
	useGetNotesLabelsQuery,
	useCreateNotesLabelMutation,
	useGetNotesLabelQuery,
	useUpdateNotesLabelMutation,
	useDeleteNotesLabelMutation,
	useGetNotesArchivedItemsQuery,
	useGetNotesReminderItemsQuery
} = NotesApi;

export type NotesApiType = {
	[NotesApi.reducerPath]: ReturnType<typeof NotesApi.reducer>;
};

export const selectNoteList = (routeParams: RouteParams) => (state: AppRootStateType) =>
	NotesApi.endpoints.getNotesList.select(routeParams)(state)?.data ?? [];
