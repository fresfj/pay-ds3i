import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../mock-api.json';
import ExtendedMockAdapter, { Params } from '../ExtendedMockAdapter';
import { NotesLabel, NotesNote } from '../../app/main/apps/notes/NotesApi';

const notesDB = mockApi.components.examples.notes_notes.value as NotesNote[];
const labelsDB = mockApi.components.examples.notes_labels.value as NotesLabel[];

export const notesApiMocks = (mock: ExtendedMockAdapter) => {
	mock.onGet('/notes').reply(() => {
		return [200, _.filter(notesDB, { archived: false })];
	});

	mock.onPost('/notes').reply(({ data }) => {
		const newNote = { id: FuseUtils.generateGUID(), ...JSON.parse(data as string) } as NotesNote;

		notesDB.push(newNote);

		return [200, newNote];
	});

	mock.onGet('/notes/archive').reply(() => {
		return [200, _.filter(notesDB, { archived: true })];
	});

	mock.onGet('/notes/reminders').reply(() => {
		return [200, _.filter(notesDB, (item) => item.reminder && !item.archived)];
	});

	mock.onGet('/notes/labels').reply(() => {
		return [200, labelsDB];
	});

	mock.onPost('/notes/labels').reply(({ data }) => {
		const newLabel = { id: FuseUtils.generateGUID(), ...JSON.parse(data as string) } as NotesLabel;

		labelsDB.push(newLabel);

		return [200, newLabel];
	});

	mock.onDelete('/notes/labels/:id').reply((config) => {
		const { id } = config.params as Params;

		_.remove(labelsDB, { id });

		return [200, id];
	});

	mock.onPut('/notes/labels/:id').reply((config) => {
		const { id } = config.params as Params;

		const data = JSON.parse(config.data as string) as NotesLabel;

		_.assign(_.find(labelsDB, { id }), data);

		return [200, data];
	});

	mock.onGet('/notes/labels/:id').reply((config) => {
		const { id } = config.params as Params;

		const response = _.filter(notesDB, (item) => item.labels.includes(id) && !item.archived);

		if (response) {
			return [200, response];
		}

		return [404, 'Requested notes do not exist.'];
	});

	mock.onGet('/notes/:id').reply((config) => {
		const { id } = config.params as Params;

		const note = _.find(notesDB, { id });

		if (note) {
			return [200, note];
		}

		return [404, 'Requested task do not exist.'];
	});

	mock.onPut('/notes/:id').reply((config) => {
		const { id } = config.params as Params;

		const data = JSON.parse(config.data as string) as NotesNote;

		_.assign(_.find(notesDB, { id }), data);

		return [200, data];
	});

	mock.onDelete('/notes/:id').reply((config) => {
		const { id } = config.params as Params;

		_.remove(notesDB, { id });

		return [200, id];
	});
};
