import _ from '@lodash';
import { DeepPartial } from 'react-hook-form';
import formatISO from 'date-fns/formatISO';
import { Event } from '../CalendarApi';

/**
 * The event model.
 */
const EventModel = (data?: DeepPartial<Event>): Event =>
	_.defaults(data || {}, {
		id: _.uniqueId(),
		title: '',
		allDay: true,
		start: formatISO(new Date()),
		end: formatISO(new Date()),
		extendedProps: { desc: '', label: '', Dictionary: '' }
	});

export default EventModel;
