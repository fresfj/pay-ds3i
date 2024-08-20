import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import { Task, Tag } from 'src/app/main/apps/tasks/TasksApi';
import mockApi from '../mock-api.json';
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter';

let tasksDB = mockApi.components.examples.tasks.value as Task[];
const tagsDB = mockApi.components.examples.tasks_tags.value as Tag[];

export const tasksApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/tasks').reply(() => {
		return [200, tasksDB];
	});

	mock.onPost('/tasks/reorder').reply(({ data }) => {
		const { startIndex, endIndex } = JSON.parse(data as string) as { startIndex: number; endIndex: number };
		const ordered = _.merge([], tasksDB);

		const [removed] = ordered.splice(startIndex, 1) as Task[];

		ordered.splice(endIndex, 0, removed);

		tasksDB = ordered;

		return [200, tasksDB];
	});

	mock.onPost('/tasks').reply(({ data }) => {
		const newTaskData = JSON.parse(data as string) as Task;

		const newtask = {
			id: FuseUtils.generateGUID(),
			...newTaskData
		};

		tasksDB.unshift(newtask);

		return [200, newtask];
	});

	mock.onGet('/tasks/tags').reply(() => {
		return [200, tagsDB];
	});

	mock.onGet('/tasks/:id').reply((config) => {
		const { id } = config.params as Params;

		const task = _.find(tasksDB, { id });

		if (task) {
			return [200, task];
		}

		return [404, 'Requested task do not exist.'];
	});

	mock.onPut('/tasks/:id').reply((config) => {
		const { id } = config.params as Params;

		_.assign(_.find(tasksDB, { id }), JSON.parse(config.data as string));

		return [200, _.find(tasksDB, { id })];
	});

	mock.onDelete('/tasks/:id').reply((config) => {
		const { id } = config.params as Params;

		_.remove(tasksDB, { id });

		return [200, id];
	});
};
