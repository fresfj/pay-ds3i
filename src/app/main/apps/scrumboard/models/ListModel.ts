import _ from '@lodash';
import { ScrumboardList } from '../ScrumboardApi';

/**
 * The list model.
 */
function ListModel(data: Partial<ScrumboardList>): ScrumboardList {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		boardId: '',
		title: ''
	});
}

export default ListModel;
