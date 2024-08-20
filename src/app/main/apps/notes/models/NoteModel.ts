import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { NotesNote } from '../NotesApi';

/**
 * The note model.
 */
function NoteModel(data: PartialDeep<NotesNote>) {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		title: '',
		content: '',
		tasks: [],
		image: '',
		reminder: '',
		labels: [],
		archived: false,
		createdAt: '',
		updatedAt: ''
	});
}

export default NoteModel;
