import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import format from 'date-fns/format';
import { WithRouterProps } from '@fuse/core/withRouter/withRouter';
import { useDebounce } from '@fuse/hooks';
import FuseLoading from '@fuse/core/FuseLoading';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSelector } from 'react-redux';
import NoteFormList from './tasks/NoteFormList';
import NoteFormLabelMenu from './NoteFormLabelMenu';
import NoteFormReminder from './NoteFormReminder';
import NoteFormUploadImage from './NoteFormUploadImage';
import NoteModel from '../models/NoteModel';
import NoteReminderLabel from '../NoteReminderLabel';
import NoteLabel from '../NoteLabel';
import {
	NotesNote,
	useCreateNotesItemMutation,
	useDeleteNotesItemMutation,
	useUpdateNotesItemMutation
} from '../NotesApi';
import { selectDialogNote } from '../store/dialogsSlice';

/**
 * Form Validation Schema
 */
const tasksSchema = z.object({
	id: z.string().nonempty('ID is required'),
	content: z.string().nonempty('Content is required'),
	completed: z.boolean()
});

const schema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	content: z.string().optional(),
	tasks: z.array(tasksSchema).default([]).optional(),
	labels: z.array(z.string()).default([]).optional(),
	image: z.string().nullable().optional(),
	reminder: z.string().nullable().optional(),
	archived: z.boolean().optional(),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),
	oneOfThemRequired: z
		.boolean()
		.optional()
		.refine(
			// eslint-disable-next-line func-names
			function (
				this: {
					parent: NotesNote;
				},
				value
			) {
				if (value === true) {
					// Now `this` is explicitly typed with `RefineContext`
					const { title, content, image, tasks } = this.parent;
					return title || content || image || (tasks && tasks.length > 0);
				}

				return true;
			},
			{
				message: 'At least one of the fields is required.'
			}
		)
});

type NoteFormProps = WithRouterProps & {
	variant?: 'new' | 'edit';
	note?: NotesNote;
	onClose?: () => void;
};

/**
 * The note form.
 */
function NoteForm(props: NoteFormProps) {
	const { variant = 'edit', onClose } = props;
	const [showList, setShowList] = useState(false);
	const routeParams = useParams();

	const [updateNote] = useUpdateNotesItemMutation();
	const [removeNote] = useDeleteNotesItemMutation();
	const [createNote] = useCreateNotesItemMutation();

	const note = useSelector(selectDialogNote(routeParams));

	const { formState, handleSubmit, getValues, watch, reset, setValue, control } = useForm<NotesNote>({
		mode: 'onChange',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	const watchedNoteForm = watch();

	const resetForm = useCallback(() => {
		if (variant === 'edit' && note) {
			reset(note);
		}

		if (variant === 'new' && _.isEmpty(watchedNoteForm)) {
			reset(
				NoteModel(
					_.merge(
						routeParams.labelId ? { labels: [routeParams.labelId] } : null,
						routeParams.id === 'archive' ? { archived: true } : null
					)
				)
			);
		}
	}, [variant, routeParams, note]);

	useEffect(() => {
		resetForm();
	}, [resetForm]);

	/**
	 * Create New Note
	 */
	function handleNewNote(data: NotesNote) {
		createNote(data);
		resetForm();
	}

	/**
	 * On Change Handler
	 */
	const handleOnChange = useDebounce((_note: NotesNote) => {
		updateNote(_note);
	}, 600);

	/**
	 * Update Note
	 */
	useEffect(() => {
		if (variant === 'edit' && !_.isEmpty(dirtyFields)) {
			if (!_.isEqual(note, watchedNoteForm)) {
				handleOnChange(watchedNoteForm);
			}
		}
	}, [watchedNoteForm, note, variant, handleOnChange, dirtyFields]);

	/**
	 * Delete  Note
	 */
	function handleOnRemove() {
		removeNote(note?.id);
		onClose?.();
	}

	if (_.isEmpty(watchedNoteForm)) {
		return <FuseLoading />;
	}

	return (
		<div className="flex flex-col w-full">
			<FuseScrollbars className="flex flex-auto w-full max-h-640">
				<div className="w-full">
					<Controller
						name="image"
						control={control}
						defaultValue=""
						render={({ field: { onChange, value } }) => {
							if (!value || value === '') {
								return <span />;
							}

							return (
								<div className="relative">
									<img
										src={value}
										className="w-full block"
										alt="note"
									/>
									<Fab
										className="absolute right-0 bottom-0 m-8"
										variant="extended"
										size="small"
										color="secondary"
										aria-label="Delete Image"
										type="button"
										onClick={() => onChange('')}
									>
										<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
									</Fab>
								</div>
							);
						}}
					/>

					<div className="px-20 my-16">
						<Controller
							name="title"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									className="font-semibold text-14"
									placeholder="Title"
									type="text"
									disableUnderline
									fullWidth
								/>
							)}
						/>
					</div>
					<div className="px-20 my-16">
						<Controller
							name="content"
							control={control}
							render={({ field }) => (
								<Input
									{...field}
									placeholder="Take a note..."
									multiline
									rows="4"
									disableUnderline
									fullWidth
								/>
							)}
						/>
					</div>

					<Controller
						name="tasks"
						control={control}
						defaultValue={[]}
						render={({ field: { onChange, value } }) => {
							if ((value?.length === 0 && !showList) || (!value && !showList)) {
								return <span />;
							}

							return (
								<div className="px-16">
									<NoteFormList
										tasks={value || []}
										onCheckListChange={(val) => onChange(val)}
									/>
								</div>
							);
						}}
					/>

					{(watchedNoteForm.labels || watchedNoteForm.reminder || watchedNoteForm.createdAt) && (
						<div className="flex flex-wrap w-full px-20 my-16 -mx-4">
							{watchedNoteForm.reminder && (
								<NoteReminderLabel
									className="mt-4 mx-4"
									date={watchedNoteForm.reminder}
									onDelete={() => {
										setValue('reminder', undefined);
									}}
								/>
							)}

							<Controller
								name="labels"
								control={control}
								defaultValue={[]}
								render={({ field: { onChange, value } }) => {
									if (!value) {
										return <span />;
									}

									return (
										<>
											{value.map((id) => (
												<NoteLabel
													id={id}
													key={id}
													className="mt-4 mx-4"
													onDelete={() => onChange(value.filter((_id) => _id !== id))}
												/>
											))}
										</>
									);
								}}
							/>

							{watchedNoteForm.createdAt && (
								<Typography
									color="text.secondary"
									className="text-12 mt-8 mx-4"
								>
									Edited: {format(new Date(watchedNoteForm.createdAt), 'MMM dd yy, h:mm')}
								</Typography>
							)}
						</div>
					)}
				</div>
			</FuseScrollbars>

			<div className="flex flex-auto justify-between items-center px-16 pb-12">
				<div className="flex items-center">
					<Tooltip
						title="Remind me"
						placement="bottom"
					>
						<div>
							<Controller
								name="reminder"
								control={control}
								render={({ field: { onChange, value } }) => (
									<NoteFormReminder
										reminder={value}
										onChange={onChange}
									/>
								)}
							/>
						</div>
					</Tooltip>

					<Tooltip
						title="Add image"
						placement="bottom"
					>
						<div>
							<NoteFormUploadImage
								onChange={(val: string) =>
									setValue('image', val, { shouldDirty: true, shouldValidate: true })
								}
							/>
						</div>
					</Tooltip>

					<Tooltip
						title="Add tasks"
						placement="bottom"
					>
						<IconButton
							className="w-32 h-32 mx-4 p-0"
							onClick={() => setShowList(!showList)}
							size="large"
						>
							<FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
						</IconButton>
					</Tooltip>

					<Tooltip
						title="Change labels"
						placement="bottom"
					>
						<div>
							<NoteFormLabelMenu
								note={watchedNoteForm}
								onChange={(labels: string[]) => setValue('labels', labels)}
							/>
						</div>
					</Tooltip>

					<Controller
						name="archived"
						control={control}
						defaultValue={false}
						render={({ field: { onChange, value } }) => (
							<Tooltip
								title={value ? 'Unarchive' : 'Archive'}
								placement="bottom"
							>
								<div>
									<IconButton
										className="w-32 h-32 mx-4 p-0"
										// disabled={newFormButtonDisabled()}
										onClick={() => {
											onChange(!value);

											if (variant === 'new') {
												setTimeout(() => handleNewNote(getValues()));
											}
										}}
										size="large"
									>
										<FuseSvgIcon size={20}>
											{value ? 'heroicons-solid:archive' : 'heroicons-outline:archive'}
										</FuseSvgIcon>
									</IconButton>
								</div>
							</Tooltip>
						)}
					/>
				</div>

				<div className="flex items-center">
					{variant === 'new' ? (
						<Button
							className="m-4 p-8"
							type="submit"
							variant="contained"
							color="secondary"
							size="small"
							onClick={handleSubmit(handleNewNote)}
							disabled={_.isEmpty(dirtyFields) || !isValid}
						>
							Create
						</Button>
					) : (
						<>
							<Tooltip
								title="Delete Note"
								placement="bottom"
							>
								<IconButton
									className="w-32 h-32 mx-4 p-0"
									onClick={handleOnRemove}
									size="large"
								>
									<FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
								</IconButton>
							</Tooltip>
							<Button
								className="m-4"
								onClick={onClose}
								variant="text"
							>
								Close
							</Button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default withRouter(NoteForm);
