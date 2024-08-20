import { createSlice } from '@reduxjs/toolkit';
import { RootStateType } from 'app/store/types';
import { DeepPartial } from 'react-hook-form';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import formatISO from 'date-fns/formatISO';
import { appSelector } from 'app/store/store';
import { CalendarApiType, Event } from '../CalendarApi';

type AppRootStateType = RootStateType<eventDialogSliceType> & CalendarApiType;

export const dateFormat = 'YYYY-MM-DDTHH:mm:ss.sssZ';

export type EventDialogType = {
	type: 'new' | 'edit';
	props: {
		open: boolean;
		anchorPosition?: { top: number; left: number };
	};
	data?: DeepPartial<Event> | null;
};

const initialState: EventDialogType = {
	type: 'new',
	props: {
		open: false,
		anchorPosition: { top: 200, left: 400 }
	},
	data: null
};

/**
 * The Calendar App events slice.
 */
export const eventDialogSlice = createSlice({
	name: 'calendarApp/eventDialog',
	initialState,
	reducers: {
		openNewEventDialog: {
			prepare: (selectInfo: Partial<DateSelectArg>) => {
				const { start, end, jsEvent } = selectInfo;
				const payload: EventDialogType = {
					type: 'new',
					props: {
						open: true,
						anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX }
					},
					data: {
						start: formatISO(start),
						end: formatISO(end)
					}
				};
				return { payload, meta: undefined, error: null };
			},
			reducer: (state, action) => action.payload as EventDialogType
		},
		openEditEventDialog: {
			prepare: (clickInfo: EventClickArg) => {
				const { jsEvent, event } = clickInfo;
				const { id, title, allDay, start, end, extendedProps } = event;

				const payload: EventDialogType = {
					type: 'edit',
					props: {
						open: true,
						anchorPosition: { top: jsEvent.pageY, left: jsEvent.pageX }
					},
					data: {
						id,
						title,
						allDay,
						extendedProps,
						start: formatISO(start),
						end: formatISO(end)
					}
				};
				return { payload, meta: undefined, error: null };
			},
			reducer: (state, action) => action.payload as EventDialogType
		},
		closeNewEventDialog: (_state) => initialState,
		closeEditEventDialog: (_state) => ({
			...initialState,
			type: 'edit'
		})
	}
});

export const { openNewEventDialog, closeNewEventDialog, openEditEventDialog, closeEditEventDialog } =
	eventDialogSlice.actions;

export const selectEventDialog = appSelector((state: AppRootStateType) => state.calendarApp.eventDialog);

export type eventDialogSliceType = typeof eventDialogSlice;

export default eventDialogSlice.reducer;
