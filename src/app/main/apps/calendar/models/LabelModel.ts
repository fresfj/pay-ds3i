import _ from '@lodash';
import { PartialDeep } from 'type-fest';
import { Label } from '../CalendarApi';

/**
 * The label model.
 */
function LabelModel(data?: PartialDeep<Label>) {
	data = data || {};

	return _.defaults(data, {
		id: _.uniqueId(),
		title: '',
		color: '#e75931'
	});
}

export default LabelModel;
