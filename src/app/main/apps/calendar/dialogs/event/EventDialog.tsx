import { Controller, useForm } from 'react-hook-form';
import FuseUtils from '@fuse/utils/FuseUtils';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { MouseEvent, useCallback, useEffect } from 'react';
import _ from '@lodash';
import { Autocomplete, Box, Checkbox, FormControl, InputLabel, MenuItem, Popover, Select } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppDispatch } from 'app/store/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { closeEditEventDialog, closeNewEventDialog, selectEventDialog } from '../../store/eventDialogSlice';
import EventLabelSelect, { EventLabelSelectProps } from '../../EventLabelSelect';
import EventModel from '../../models/EventModel';
import {
	Event,
	useCreateCalendarEventMutation,
	useDeleteCalendarEventMutation,
	useGetCalendarLabelsQuery,
	useUpdateCalendarEventMutation
} from '../../CalendarApi';

const defaultValues = EventModel();

/**
 * Form Validation Schema
 */
const schema = z.object({
	id: z.string().nonempty('You must enter an id'),
	title: z.string().nonempty('You must enter a title'),
	start: z.string().nonempty('Please enter start date'),
	end: z.string().optional(),
	allDay: z.boolean().optional(),
	extendedProps: z
		.object({
			desc: z.string().optional(),
			label: z.string().optional()
		})
		.optional()
	// scheduleMessage: z.boolean().optional(),
	// instance: z.array(z.string()).optional(),
	// contacts: z.array(z.string()).optional()
});
const instances = [{ id: 1, title: "Instance 1" }, { id: 2, title: "Instance 2" }, { id: 3, title: "Instance 3" }];
const contacts = [{ id: 1, title: "Contact 1" }, { id: 2, title: "Contact 2" }, { id: 3, title: "Contact 3" }];
/**
 * The event dialog.
 */
function EventDialog() {
	const dispatch = useAppDispatch();
	const eventDialog = useSelector(selectEventDialog);
	const { data: labels } = useGetCalendarLabelsQuery();
	const firstLabelId = labels ? labels[0]?.id : null;
	const [createEvent] = useCreateCalendarEventMutation();
	const [updateEvent] = useUpdateCalendarEventMutation();
	const [deleteEvent] = useDeleteCalendarEventMutation();

	const { reset, formState, watch, control, getValues } = useForm<Event>({
		defaultValues,
		mode: 'onChange',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const start = watch('start');
	const end = watch('end');
	const id = watch('id');

	const form = watch();

	/**
	 * Initialize Dialog with Data
	 */
	const initDialog = useCallback(() => {
		/**
		 * Dialog type: 'edit'
		 */
		if (eventDialog.type === 'edit' && eventDialog.data) {
			reset({ ...eventDialog.data });
		}

		/**
		 * Dialog type: 'new'
		 */
		if (eventDialog.type === 'new') {
			reset({
				...defaultValues,
				...eventDialog.data,
				extendedProps: {
					...defaultValues.extendedProps,
					label: firstLabelId
				},
				id: FuseUtils.generateGUID()
			});
		}
	}, [eventDialog.data, eventDialog.type, reset]);

	/**
	 * On Dialog Open
	 */
	useEffect(() => {
		if (eventDialog.props.open) {
			initDialog();
		}
	}, [eventDialog.props.open, initDialog]);

	/**
	 * Close Dialog
	 */
	function closeComposeDialog() {
		return eventDialog.type === 'edit' ? dispatch(closeEditEventDialog()) : dispatch(closeNewEventDialog());
	}

	/**
	 * Form Submit
	 */
	function onSubmit(ev: MouseEvent<HTMLButtonElement>) {
		ev.preventDefault();
		const data = getValues();

		if (eventDialog.type === 'new') {
			createEvent({ Event: data });
		} else {
			updateEvent({ ...eventDialog.data, ...data });
		}

		closeComposeDialog();
	}

	/**
	 * Remove Event
	 */
	function handleRemove() {
		deleteEvent(id);
		closeComposeDialog();
	}

	return (
		<Popover
			{...eventDialog.props}
			open={eventDialog.props.open}
			anchorReference="anchorPosition"
			anchorOrigin={{
				vertical: 'center',
				horizontal: 'right'
			}}
			transformOrigin={{
				vertical: 'center',
				horizontal: 'left'
			}}
			onClose={closeComposeDialog}
			component="form"
		>
			<div className="flex flex-col max-w-full p-24 pt-32 sm:pt-40 sm:p-32 w-480">
				<div className="flex sm:space-x-24 mb-16">
					<FuseSvgIcon
						className="hidden sm:inline-flex mt-16"
						color="action"
					>
						heroicons-outline:pencil-alt
					</FuseSvgIcon>
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								id="title"
								label="Title"
								className="flex-auto"
								error={!!errors.title}
								helperText={errors?.title?.message}
								InputLabelProps={{
									shrink: true
								}}
								variant="outlined"
								autoFocus
								required
								fullWidth
							/>
						)}
					/>
				</div>
				<div className="flex sm:space-x-24 mb-16">
					<FormControlLabel
						label="Schedule Message"
						control={
							<Controller
								name="scheduleMessage"
								control={control}
								render={({ field: { onChange, value } }) => (
									<Switch onChange={(ev) => { onChange(ev.target.checked); }} checked={value} name="scheduleMessage" />
								)}
							/>
						}
					/>
				</div>
				{form.scheduleMessage && (
					<>
						<div className="flex sm:space-x-24 mb-16">
							<FuseSvgIcon
								className="hidden sm:inline-flex mt-16"
								color="action"
							>
								heroicons-outline:chat-alt-2
							</FuseSvgIcon>
							<Controller
								name="instance"
								control={control}
								render={({ field }) => (
									<FormControl sx={{ mt: 2 }}
										className="mt-8 mb-16 w-full"
									>
										<InputLabel htmlFor="max-width">Instance</InputLabel>
										<Select
											labelId="select-instances"
											id="label-instances"
											{...field}
											label="Instance"
											variant="outlined"
											fullWidth
											classes={{ select: 'flex items-center space-x-12' }}
										>
											{instances?.map((label) => (
												<MenuItem
													value={label.id}
													key={label.id}
													className="space-x-12"
												>
													<span>{label.title}</span>
												</MenuItem>
											))}
										</Select>
									</FormControl>
								)}
							/>
						</div>
						<div className="flex sm:space-x-24 mb-16">
							<FuseSvgIcon
								className="hidden sm:inline-flex mt-16"
								color="action"
							>
								heroicons-outline:users
							</FuseSvgIcon>
							<Controller
								name="contacts"
								control={control}
								render={({ field: { onChange, value } }) => (
									<Autocomplete
										multiple
										id="tags"
										className="mt-8 mb-16 w-full"
										options={contacts || []}
										disableCloseOnSelect
										getOptionLabel={(option: any) => option?.title}
										renderOption={(_props, option: any, { selected }) => (
											<li {..._props}>
												<Checkbox
													style={{ marginRight: 8 }}
													checked={selected}
												/>
												{option?.title}
											</li>
										)}
										value={value ? value.map((id) => _.find(contacts, { id })) : []}
										onChange={(event, newValue) => {
											onChange(newValue.map((item: any) => item.id));
										}}
										fullWidth
										renderInput={(params) => (
											<TextField
												{...params}
												label="Schedule Contacts"
												variant="outlined"
												placeholder="Select contacts"
											/>
										)}
									/>
								)}
							/>
						</div>
					</>
				)}

				<div className="flex sm:space-x-24 mb-16">
					<FuseSvgIcon
						className="hidden sm:inline-flex mt-16"
						color="action"
					>
						heroicons-outline:calendar
					</FuseSvgIcon>
					<div className="w-full">
						<div className="flex flex-column sm:flex-row w-full items-center space-x-16">
							<Controller
								name="start"
								control={control}
								render={({ field: { onChange, value } }) => (
									<DateTimePicker
										className="mt-8 mb-16 w-full"
										value={new Date(value)}
										onChange={onChange}
										slotProps={{
											textField: {
												label: 'Start',
												variant: 'outlined'
											}
										}}
										maxDate={end}
									/>
								)}
							/>
							{!form.scheduleMessage && (
								<Controller
									name="end"
									control={control}
									render={({ field: { onChange, value } }) => (
										<DateTimePicker
											className="mt-8 mb-16 w-full"
											value={new Date(value)}
											onChange={onChange}
											slotProps={{
												textField: {
													label: 'End',
													variant: 'outlined'
												}
											}}
											minDate={start}
										/>
									)}
								/>
							)}
						</div>
						{!form.scheduleMessage && (
							<Controller
								name="allDay"
								control={control}
								render={({ field: { onChange, value } }) => (
									<FormControlLabel
										className="mt-8"
										label="All Day"
										control={
											<Switch
												onChange={(ev) => {
													onChange(ev.target.checked);
												}}
												checked={value}
												name="allDay"
											/>
										}
									/>
								)}
							/>
						)}
					</div>
				</div>

				<div className="flex sm:space-x-24 mb-16">
					<FuseSvgIcon
						className="hidden sm:inline-flex mt-16"
						color="action"
					>
						heroicons-outline:tag
					</FuseSvgIcon>

					<Controller
						name="extendedProps.label"
						control={control}
						render={({ field }) => (
							<EventLabelSelect
								className="mt-8 mb-16"
								{...(field as EventLabelSelectProps)}
							/>
						)}
					/>
				</div>

				<div className="flex sm:space-x-24 mb-16">
					<FuseSvgIcon
						className="hidden sm:inline-flex mt-16"
						color="action"
					>
						heroicons-outline:menu-alt-2
					</FuseSvgIcon>

					<Controller
						name="extendedProps.desc"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16"
								id="desc"
								label="Description"
								type="text"
								multiline
								rows={5}
								variant="outlined"
								fullWidth
							/>
						)}
					/>
				</div>

				{eventDialog.type === 'new' ? (
					<div className="flex items-center space-x-8">
						<div className="flex flex-1" />
						<Button
							variant="contained"
							color="primary"
							onClick={onSubmit}
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Add
						</Button>
					</div>
				) : (
					<div className="flex items-center space-x-8">
						<div className="flex flex-1" />
						<IconButton
							onClick={handleRemove}
							size="large"
						>
							<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
						</IconButton>
						<Button
							variant="contained"
							color="primary"
							onClick={onSubmit}
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Save
						</Button>
					</div>
				)}
			</div>
		</Popover>
	);
}

export default EventDialog;
