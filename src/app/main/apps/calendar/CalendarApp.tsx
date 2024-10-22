import { styled } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import googleCalendarPlugin from '@fullcalendar/google-calendar';

import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useAppDispatch } from 'app/store/store';
import {
	DateSelectArg,
	DatesSetArg,
	EventAddArg,
	EventChangeArg,
	EventClickArg,
	EventContentArg,
	EventDropArg,
	EventRemoveArg
} from '@fullcalendar/core';
import FuseLoading from '@fuse/core/FuseLoading';
import withReducer from 'app/store/withReducer';
import CalendarHeader from './CalendarHeader';
import EventDialog from './dialogs/event/EventDialog';
import { openEditEventDialog, openNewEventDialog } from './store/eventDialogSlice';
import CalendarAppSidebar from './CalendarAppSidebar';
import CalendarAppEventContent from './CalendarAppEventContent';
import { Event, useGetCalendarEventsQuery, useUpdateCalendarEventMutation } from './CalendarApi';
import ApiCalendar from 'react-google-calendar-api';

const googleClientId = '1050503771215-lsi40tbdsaasuic72dggicm4sl2ngiru.apps.googleusercontent.com'
const googleApiKey = 'AIzaSyDjN_urRdFrtB8tjx4YqabsAUtDMb0_Cmw'
const SCOPES = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar";

const config = {
	"clientId": googleClientId,
	"apiKey": googleApiKey,
	"scope": "https://www.googleapis.com/auth/calendar",
	"discoveryDocs": [
		"https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"
	]
}

const apiCalendar = new ApiCalendar(config)
import reducer from './store';
import { selectSelectedLabels } from './store/selectedLabelsSlice';
import { useSelector } from 'react-redux';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& a': {
		color: `${theme.palette.text.primary}!important`,
		textDecoration: 'none!important'
	},
	'&  .fc-media-screen': {
		minHeight: '100%',
		width: '100%'
	},
	'& .fc-scrollgrid, & .fc-theme-standard td, & .fc-theme-standard th': {
		borderColor: `${theme.palette.divider}!important`
	},
	'&  .fc-scrollgrid-section > td': {
		border: 0
	},
	'& .fc-daygrid-day': {
		'&:last-child': {
			borderRight: 0
		}
	},
	'& .fc-col-header-cell': {
		borderWidth: '0 1px 0 1px',
		padding: '8px 0 0 0',
		'& .fc-col-header-cell-cushion': {
			color: theme.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			textTransform: 'uppercase'
		}
	},
	'& .fc-view ': {
		'& > .fc-scrollgrid': {
			border: 0
		}
	},
	'& .fc-daygrid-day.fc-day-today': {
		backgroundColor: 'transparent!important',
		'& .fc-daygrid-day-number': {
			borderRadius: '100%',
			backgroundColor: `${theme.palette.secondary.main}!important`,
			color: `${theme.palette.secondary.contrastText}!important`
		}
	},
	'& .fc-daygrid-day-top': {
		justifyContent: 'center',

		'& .fc-daygrid-day-number': {
			color: theme.palette.text.secondary,
			fontWeight: 500,
			fontSize: 12,
			display: 'inline-flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: 26,
			height: 26,
			margin: '4px 0',
			borderRadius: '50%',
			float: 'none',
			lineHeight: 1
		}
	},
	'& .fc-h-event': {
		background: 'initial'
	},
	'& .fc-event': {
		border: 0,
		padding: '0 ',
		fontSize: 12,
		margin: '0 6px 4px 6px!important'
	}
}));

/**
 * The calendar app.
 */
function CalendarApp() {
	const [currentDate, setCurrentDate] = useState<DatesSetArg>();
	const dispatch = useAppDispatch();
	const { data: calendarData, isLoading } = useGetCalendarEventsQuery();
	const selectedLabels = useSelector(selectSelectedLabels);
	const calendarRef = useRef<FullCalendar>(null);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);
	const [updateEvent] = useUpdateCalendarEventMutation();
	const [events, setEvents] = useState<any[]>([]);
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [googleEvents, setGoogleEvents] = useState<any[]>([]);

	const filterEventsByLabels = useCallback(
		(events) => events.filter((event) => selectedLabels.includes(event?.extendedProps?.label as string)),
		[selectedLabels]
	);

	useEffect(() => {
		if (!isLoading) {
			const allEvents = [...(calendarData || []), ...googleEvents];
			const filteredEvents = filterEventsByLabels(allEvents);
			setEvents(filteredEvents);
		}
	}, [calendarData, googleEvents, selectedLabels, isLoading, filterEventsByLabels]);

	useEffect(() => {
		const script = document.createElement('script');
		script.async = true;
		script.defer = true;
		script.src = 'https://apis.google.com/js/api.js';
		script.onload = () => {
			window.gapi.load('client:auth2', () => {
				if (calendarData && !isLoading) {
					initClient()
				}
			});
		};
		document.body.appendChild(script);
	}, [calendarData, isLoading]);

	const initClient = useCallback(() => {
		const startOfMonth = new Date(new Date().setDate(1)).toISOString();
		const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString();

		if (!localStorage.getItem('access_token')) {
			handleGoogleLogin();
		} else {
			fetchGoogleCalendarEvents(startOfMonth, endOfMonth);
		}
	}, []);

	const fetchGoogleCalendarEvents = (startOfMonth: string, endOfMonth: string) => {
		fetch(
			`https://www.googleapis.com/calendar/v3/calendars/primary/events?key=${googleApiKey}&orderBy=startTime&singleEvents=true&timeMin=${startOfMonth}&timeMax=${endOfMonth}`,
			{ headers: { Authorization: `Bearer ${localStorage.getItem('access_token')}` } }
		)
			.then((res) => {
				if (res.status !== 401) {
					return res.json();
				} else {
					localStorage.removeItem('access_token');
					handleGoogleLogin();
				}
			})
			.then((data) => {
				if (data?.items) {
					const googleEvents = formatEvents(data.items);
					setGoogleEvents(googleEvents);
					setIsSignedIn(true);
				}
			});
	};

	const formatEvents = useCallback(
		(list) =>
			list.map((event) => ({
				id: event.id,
				extendedProps: {
					desc: event.description,
					label: '1b13d7a7f529',
				},
				allDay: false,
				title: event.summary,
				start: event.start.dateTime || event.start.date,
				end: event.end.dateTime || event.end.date,
			})),
		[]
	);

	const listUpcomingEvents = () => {
		window.gapi.client.calendar.events
			.list({
				calendarId: "primary",
				showDeleted: true,
				singleEvents: true,
			})
			.then(function (response) {
				let events = response.result.items;

				if (events.length > 0) {
					const googleEvents = formatEvents(events);
					setGoogleEvents(googleEvents);
				}
			});
	};

	const openSignInPopup = () => {
		window.gapi.auth2.authorize(
			{ client_id: googleClientId, scope: SCOPES },
			(res) => {
				if (res && res.access_token) {
					localStorage.setItem('access_token', res.access_token);
					window.gapi.client.load('calendar', 'v3', listUpcomingEvents);
				}
			}
		);
	};

	const loadEventsForCurrentMonth = () => {
		const calendarApi = calendarRef.current?.getApi();
		if (!calendarApi) return;
		const view = calendarApi?.view;
		const startOfMonth = new Date(view.currentStart).toISOString();
		const endOfMonth = new Date(view.currentEnd).toISOString();
		fetchGoogleCalendarEvents(startOfMonth, endOfMonth);
	};

	const handleGoogleLogin = () => {
		apiCalendar.handleAuthClick().then((response: any) => {
			localStorage.setItem("access_token", response.access_token);
		});
	};

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	useEffect(() => {
		// Correct calendar dimentions after sidebar toggles
		setTimeout(() => {
			calendarRef.current?.getApi()?.updateSize();
		}, 300);
	}, [leftSidebarOpen]);

	const handleDateSelect = (selectInfo: DateSelectArg) => {
		dispatch(openNewEventDialog(selectInfo));
	};

	const handleEventDrop = (eventDropInfo: EventDropArg): void => {
		const { id, title, allDay, start, end, extendedProps } = eventDropInfo.event;
		updateEvent({
			id,
			title,
			allDay,
			instance: '',
			contacts: [],
			start: start?.toISOString() ?? '',
			end: end?.toISOString() ?? '',
			extendedProps
		});
	};

	const handleEventClick = (clickInfo: EventClickArg) => {
		clickInfo.jsEvent.preventDefault();
		dispatch(openEditEventDialog(clickInfo));
	};

	const handleDates = (rangeInfo: DatesSetArg) => {
		setCurrentDate(rangeInfo);
		loadEventsForCurrentMonth();
	};

	const handleEventAdd = (addInfo: EventAddArg) => {
		// eslint-disable-next-line no-console
		console.info(addInfo);
	};

	const handleEventChange = (changeInfo: EventChangeArg) => {
		// eslint-disable-next-line no-console
		console.info(changeInfo);
	};

	const handleEventRemove = (removeInfo: EventRemoveArg) => {
		// eslint-disable-next-line no-console
		console.info(removeInfo);
	};

	function handleToggleLeftSidebar() {
		setLeftSidebarOpen(!leftSidebarOpen);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<>
			<Root
				header={
					<CalendarHeader
						calendarRef={calendarRef}
						currentDate={currentDate}
						onToggleLeftSidebar={handleToggleLeftSidebar}
					/>
				}
				content={
					<FullCalendar
						plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, googleCalendarPlugin]}
						headerToolbar={false}
						initialView="dayGridMonth"
						editable
						selectable
						selectMirror
						dayMaxEvents
						weekends
						datesSet={handleDates}
						select={handleDateSelect}
						events={events}
						// eslint-disable-next-line react/no-unstable-nested-components
						eventContent={(eventInfo: EventContentArg & { event: Event }) => (
							<CalendarAppEventContent eventInfo={eventInfo} />
						)}
						eventClick={handleEventClick}
						eventAdd={handleEventAdd}
						eventChange={handleEventChange}
						eventRemove={handleEventRemove}
						eventDrop={handleEventDrop}
						initialDate={new Date()}
						ref={calendarRef}
					/>
				}
				leftSidebarContent={<CalendarAppSidebar handleGoogleLogin={handleGoogleLogin} isSignedIn={isSignedIn} />}
				leftSidebarOpen={leftSidebarOpen}
				leftSidebarOnClose={() => setLeftSidebarOpen(false)}
				leftSidebarWidth={240}
				scroll="content"
			/>
			<EventDialog />
		</>
	);
}

export default withReducer('calendarApp', reducer)(CalendarApp);