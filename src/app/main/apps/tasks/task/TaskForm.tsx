import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useAppDispatch } from 'app/store/store';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import IconButton from '@mui/material/IconButton';
import { useDeepCompareEffect } from '@fuse/hooks';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import TaskPrioritySelector from './TaskPrioritySelector';
import FormActionsMenu from './FormActionsMenu';
import {
	Tag,
	Task,
	useCreateTasksItemMutation,
	useGetTasksItemQuery,
	useGetTasksTagsQuery,
	useUpdateTasksItemMutation
} from '../TasksApi';
import SectionModel from '../models/SectionModel';
import TaskModel from '../models/TaskModel';

/**
 * Form Validation Schema
 */

const subTaskSchema = z.object({
	id: z.string().nonempty(),
	title: z.string().nonempty(),
	completed: z.boolean()
});

const schema = z.object({
	id: z.string().optional(),
	type: z.string().nonempty(),
	title: z.string().nonempty('You must enter a title'),
	notes: z.string().nullable().optional(),
	completed: z.boolean(),
	dueDate: z.string().nullable().optional(),
	priority: z.number(),
	tags: z.array(z.string()),
	assignedTo: z.string().nullable().optional(),
	subTasks: z.array(subTaskSchema).optional(),
	order: z.number()
});

/**
 * The task form.
 */
function TaskForm() {
	const routeParams = useParams();
	const taskId = routeParams?.id;
	const taskType = routeParams?.type;

	const { data: task, isError } = useGetTasksItemQuery(routeParams.id, {
		skip: !taskId || taskId === 'new'
	});
	const { data: tags } = useGetTasksTagsQuery();

	const [updateTask] = useUpdateTasksItemMutation();
	const [createTask] = useCreateTasksItemMutation();

	const dispatch = useAppDispatch();
	const navigate = useNavigate();

	const { control, watch, reset, handleSubmit, formState } = useForm<Task>({
		mode: 'onChange',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();
	/**
	 * Update Task
	 */
	useDeepCompareEffect(() => {
		if (!(!isValid || _.isEmpty(form) || !task || routeParams.id === 'new') && !_.isEqual(task, form)) {
			onSubmit(form);
		}
	}, [form, isValid]);

	useEffect(() => {
		if (taskId === 'new') {
			if (taskType === 'section') {
				reset(SectionModel({}));
			}

			if (taskType === 'task') {
				reset(TaskModel({}));
			}
		} else {
			reset({ ...task });
		}
	}, [task, reset, taskId, taskType]);

	/**
	 * Form Submit
	 */
	function onSubmit(data: Task) {
		updateTask(data);
	}

	function onSubmitNew(data: Task) {
		createTask(data)
			.unwrap()
			.then((newTask) => {
				navigate(`/apps/tasks/${newTask?.id}`);
			})
			.catch((rejected) => {
				dispatch(showMessage({ message: `Error creating task item ${rejected}`, variant: 'error' }));
			});
	}

	if (isError && taskId !== 'new') {
		setTimeout(() => {
			navigate('/apps/tasks');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (_.isEmpty(form)) {
		return <FuseLoading />;
	}

	return (
		<>
			<div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
				<div className="flex items-center justify-between border-b-1 w-full py-24 mt-16 mb-32">
					<Controller
						control={control}
						name="completed"
						render={({ field: { value, onChange } }) => (
							<Button
								className="font-semibold"
								onClick={() => onChange(!value)}
							>
								<Box sx={{ color: value ? 'secondary.main' : 'text.disabled' }}>
									<FuseSvgIcon>heroicons-outline:check-circle</FuseSvgIcon>
								</Box>
								<span className="mx-8">
									{task?.completed ? 'MARK AS INCOMPLETE' : 'MARK AS COMPLETE'}
								</span>
							</Button>
						)}
					/>
					<div className="flex items-center">
						{routeParams?.id !== 'new' && <FormActionsMenu taskId={task?.id} />}
						<IconButton
							component={NavLinkAdapter}
							to="/apps/tasks"
							size="large"
						>
							<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
						</IconButton>
					</div>
				</div>

				<Controller
					control={control}
					name="title"
					render={({ field }) => (
						<TextField
							className="mt-32 max-h-auto"
							{...field}
							label={`${_.upperFirst(form.type)} title`}
							placeholder="Job title"
							id="title"
							error={!!errors.title}
							helperText={errors?.title?.message}
							variant="outlined"
							fullWidth
							multiline
							minRows={3}
							maxRows={10}
						/>
					)}
				/>

				<Controller
					control={control}
					name="tags"
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							multiple
							id="tags"
							className="mt-32"
							options={tags || []}
							disableCloseOnSelect
							getOptionLabel={(option: Tag) => option?.title}
							renderOption={(_props, option: Tag, { selected }) => (
								<li {..._props}>
									<Checkbox
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option?.title}
								</li>
							)}
							value={value ? value.map((id) => _.find(tags, { id })) : []}
							onChange={(event, newValue) => {
								onChange(newValue.map((item: Tag) => item.id));
							}}
							fullWidth
							renderInput={(params) => (
								<TextField
									{...params}
									label="Tags"
									placeholder="Tags"
								/>
							)}
						/>
					)}
				/>
				<div className="flex w-full space-x-16 mt-32 mb-16 items-center">
					<Controller
						control={control}
						name="priority"
						render={({ field }) => <TaskPrioritySelector {...field} />}
					/>

					<Controller
						control={control}
						name="dueDate"
						render={({ field: { value, onChange } }) => (
							<DateTimePicker
								className="w-full"
								value={new Date(value)}
								onChange={onChange}
								slotProps={{
									textField: {
										id: 'due-date',
										label: 'Due date',
										InputLabelProps: {
											shrink: true
										},
										fullWidth: true,
										variant: 'outlined'
									},
									actionBar: {
										actions: ['clear', 'today']
									}
								}}
							/>
						)}
					/>
				</div>

				<Controller
					control={control}
					name="notes"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Notes"
							placeholder="Notes"
							id="notes"
							error={!!errors.notes}
							helperText={errors?.notes?.message}
							variant="outlined"
							fullWidth
							multiline
							minRows={5}
							maxRows={10}
							InputProps={{
								className: 'max-h-min h-min items-start',
								startAdornment: (
									<InputAdornment
										className="mt-16"
										position="start"
									>
										<FuseSvgIcon size={20}>heroicons-solid:menu-alt-2</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>
			</div>
			{routeParams.id === 'new' && (
				<Box
					className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
					sx={{ backgroundColor: 'background.default' }}
				>
					<Button
						onClick={() => {
							navigate(-1);
						}}
						className="ml-auto"
					>
						Cancel
					</Button>
					<Button
						className="ml-8"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						onClick={handleSubmit(onSubmitNew)}
					>
						Create
					</Button>
				</Box>
			)}
		</>
	);
}

export default TaskForm;
