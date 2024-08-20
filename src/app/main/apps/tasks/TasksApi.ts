import { apiService as api } from 'app/store/apiService';
import { createSelector } from '@reduxjs/toolkit';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';

export const addTagTypes = ['tasks_list', 'tasks_item', 'tasks_tags'] as const;

const TasksApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getTasks: build.query<GetTasksApiResponse, GetTasksApiArg>({
				query: () => ({ url: `/mock-api/tasks` }),
				providesTags: ['tasks_list']
			}),
			reorderTasks: build.mutation<ReorderTasksApiResponse, ReorderTasksApiArg>({
				query: ({ startIndex, endIndex }) => ({
					url: `/mock-api/tasks/reorder`,
					method: 'POST',
					data: { startIndex, endIndex }
				}),
				invalidatesTags: ['tasks_list'],
				async onQueryStarted(_, { dispatch, queryFulfilled }) {
					try {
						await queryFulfilled;
						dispatch(
							showMessage({
								message: 'List Order Saved',
								autoHideDuration: 2000,
								anchorOrigin: {
									vertical: 'top',
									horizontal: 'right'
								}
							})
						);
					} catch (err) {
						dispatch(showMessage({ message: 'Error saving list order' }));
					}
				}
			}),
			createTasksItem: build.mutation<CreateTasksItemApiResponse, CreateTasksItemApiArg>({
				query: (task) => ({
					url: `/mock-api/tasks`,
					method: 'POST',
					data: task
				}),
				invalidatesTags: ['tasks_list']
			}),
			getTasksItem: build.query<GetTasksItemApiResponse, GetTasksItemApiArg>({
				query: (taskId) => ({ url: `/mock-api/tasks/${taskId}` }),
				providesTags: ['tasks_item']
			}),
			deleteTasksItem: build.mutation<DeleteTasksItemApiResponse, DeleteTasksItemApiArg>({
				query: (taskId) => ({
					url: `/mock-api/tasks/${taskId}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['tasks_list']
			}),
			updateTasksItem: build.mutation<UpdateTasksItemApiResponse, UpdateTasksItemApiArg>({
				query: (task) => ({
					url: `/mock-api/tasks/${task.id}`,
					method: 'PUT',
					data: task
				}),
				invalidatesTags: ['tasks_item', 'tasks_list']
			}),
			getTasksTags: build.query<GetTasksTagsApiResponse, GetTasksTagsApiArg>({
				query: () => ({ url: `/mock-api/tasks/tags` }),
				providesTags: ['tasks_tags']
			}),
			createTasksTag: build.mutation<CreateTasksTagApiResponse, CreateTasksTagApiArg>({
				query: (tag) => ({
					url: `/mock-api/tasks/tags`,
					method: 'POST',
					data: tag
				}),
				invalidatesTags: ['tasks_tags']
			})
		}),
		overrideExisting: false
	});
export { TasksApi };

export type GetTasksApiResponse = /** status 200 OK */ Task[];
export type GetTasksApiArg = void;

export type ReorderTasksApiResponse = /** status 200 OK */ Task[];
export type ReorderTasksApiArg = { startIndex: number; endIndex: number };

export type CreateTasksItemApiResponse = /** status 201 Created */ Task;
export type CreateTasksItemApiArg = Task;

export type GetTasksItemApiResponse = /** status 200 OK */ Task;
export type GetTasksItemApiArg = string;

export type DeleteTasksItemApiResponse = unknown;
export type DeleteTasksItemApiArg = string;

export type UpdateTasksItemApiResponse = /** status 200 OK */ Task;
export type UpdateTasksItemApiArg = Task;

export type GetTasksTagsApiResponse = /** status 200 OK */ Tag[];
export type GetTasksTagsApiArg = void;

export type CreateTasksTagApiResponse = /** status 200 OK */ Tag;
export type CreateTasksTagApiArg = Tag;

export type Task = {
	id: string;
	type: string;
	title: string;
	notes: string;
	completed: boolean;
	dueDate?: string | null;
	priority: number;
	tags: string[];
	assignedTo?: null | string;
	subTasks: {
		id: string;
		title: string;
		completed: boolean;
	}[];
	order: number;
};

export type Tag = {
	id: string;
	title: string;
};

export const {
	useGetTasksQuery,
	useCreateTasksItemMutation,
	useGetTasksItemQuery,
	useDeleteTasksItemMutation,
	useUpdateTasksItemMutation,
	useGetTasksTagsQuery,
	useCreateTasksTagMutation,
	useReorderTasksMutation
} = TasksApi;

export type TasksApiType = {
	[TasksApi.reducerPath]: ReturnType<typeof TasksApi.reducer>;
};

export const selectTasksList = (state: TasksApiType) => TasksApi.endpoints.getTasks.select()(state)?.data ?? [];

export const selectRemainingTasks = createSelector([selectTasksList], (tasks) => {
	return tasks.filter((item) => item.type === 'task' && !item.completed).length;
});
