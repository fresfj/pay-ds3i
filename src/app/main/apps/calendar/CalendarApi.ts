import { apiService as api } from 'app/store/apiService';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { createSelector } from '@reduxjs/toolkit';
import { Dictionary } from '@fullcalendar/core/internal';
import { selectSelectedLabels, setSelectedLabels } from './store/selectedLabelsSlice';

export const addTagTypes = ['calendar_events', 'calendar_event', 'calendar_labels', 'calendar_label'] as const;

const CalendarApi = api
	.enhanceEndpoints({
		addTagTypes
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getCalendarEvents: build.query<GetCalendarEventsApiResponse, GetCalendarEventsApiArg>({
				query: () => ({ url: `/mock-api/calendar/events` }),
				providesTags: ['calendar_events']
			}),
			createCalendarEvent: build.mutation<CreateCalendarEventApiResponse, CreateCalendarEventApiArg>({
				query: (queryArg) => ({
					url: `/mock-api/calendar/events`,
					method: 'POST',
					data: queryArg.Event
				}),
				invalidatesTags: ['calendar_events']
			}),
			updateCalendarEvent: build.mutation<UpdateCalendarEventApiResponse, UpdateCalendarEventApiArg>({
				query: (Event) => ({
					url: `/mock-api/calendar/events/${Event.id}`,
					method: 'PUT',
					data: Event
				}),
				invalidatesTags: ['calendar_event', 'calendar_events']
			}),
			deleteCalendarEvent: build.mutation<DeleteCalendarEventApiResponse, DeleteCalendarEventApiArg>({
				query: (id) => ({
					url: `/mock-api/calendar/events/${id}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['calendar_event', 'calendar_events']
			}),
			getCalendarLabels: build.query<GetCalendarLabelsApiResponse, GetCalendarLabelsApiArg>({
				query: () => ({ url: `/mock-api/calendar/labels` }),
				providesTags: ['calendar_labels'],
				async onQueryStarted(id, { dispatch, queryFulfilled }) {
					try {
						const { data: labels } = await queryFulfilled;
						dispatch(setSelectedLabels(labels.map((item) => item.id)));
					} catch (err) {
						dispatch(showMessage({ message: 'Error loading Labels!' }));
					}
				}
			}),
			createCalendarLabel: build.mutation<CreateCalendarLabelApiResponse, CreateCalendarLabelApiArg>({
				query: (Label) => {
					return {
						url: `/mock-api/calendar/labels`,
						method: 'POST',
						data: Label
					};
				},
				invalidatesTags: ['calendar_label', 'calendar_labels']
			}),
			updateCalendarLabel: build.mutation<UpdateCalendarLabelApiResponse, UpdateCalendarLabelApiArg>({
				query: (Label) => ({
					url: `/mock-api/calendar/labels/${Label.id}`,
					method: 'PUT',
					data: Label
				}),
				invalidatesTags: ['calendar_labels']
			}),
			deleteCalendarLabel: build.mutation<DeleteCalendarLabelApiResponse, DeleteCalendarLabelApiArg>({
				query: (id) => ({
					url: `/mock-api/calendar/labels/${id}`,
					method: 'DELETE'
				}),
				invalidatesTags: ['calendar_events', 'calendar_labels']
			})
		}),
		overrideExisting: false
	});

export type GetCalendarEventsApiResponse = /** status 200 OK */ Event[];
export type GetCalendarEventsApiArg = void;

export type CreateCalendarEventApiResponse = /** status 200 OK */ Event;
export type CreateCalendarEventApiArg = {
	Event: Event;
};

export type UpdateCalendarEventApiResponse = /** status 200 OK */ Event;
export type UpdateCalendarEventApiArg = Event;

export type DeleteCalendarEventApiResponse = unknown;
export type DeleteCalendarEventApiArg = string;

export type GetCalendarLabelsApiResponse = /** status 200 OK */ Label[];
export type GetCalendarLabelsApiArg = void;

export type CreateCalendarLabelApiResponse = /** status 200 OK */ Label;
export type CreateCalendarLabelApiArg = Label;

export type UpdateCalendarLabelApiResponse = /** status 200 OK */ Label;
export type UpdateCalendarLabelApiArg = Label;

export type DeleteCalendarLabelApiResponse = unknown;
export type DeleteCalendarLabelApiArg = string;

export type Event = {
	id: string;
	title: string;
	allDay: boolean;
	start: string;
	end: string;
	extendedProps?: Dictionary;
};
export type Label = {
	id: string;
	title: string;
	color: string;
};
export const {
	useGetCalendarEventsQuery,
	useCreateCalendarEventMutation,
	useUpdateCalendarEventMutation,
	useDeleteCalendarEventMutation,
	useGetCalendarLabelsQuery,
	useCreateCalendarLabelMutation,
	useUpdateCalendarLabelMutation,
	useDeleteCalendarLabelMutation
} = CalendarApi;

export default CalendarApi;

export type CalendarApiType = {
	[CalendarApi.reducerPath]: ReturnType<typeof CalendarApi.reducer>;
};

export const selectFilteredEvents = (events: Event[]) =>
	createSelector([selectSelectedLabels], (selectedLabels) => {
		return events.filter((item) => selectedLabels.includes(item?.extendedProps?.label as string));
	});
