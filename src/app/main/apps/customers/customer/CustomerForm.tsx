import Button from '@mui/material/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import history from '@history';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import CustomerEmailSelector from './email-selector/CustomerEmailSelector';
import PhoneNumberSelector from './phone-number-selector/PhoneNumberSelector';
import {
	useCreateCustomersItemMutation,
	useDeleteCustomersItemMutation,
	useGetCustomersItemQuery,
	useGetCustomersTagsQuery,
	useUpdateCustomersItemMutation,
	Customer,
	Tag
} from '../CustomersApi';
import CustomerModel from '../models/CustomerModel';

function BirtdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

type FormType = Customer;

/**
 * Form Validation Schema
 */

// Zod schema for CustomerEmail
const CustomerEmailSchema = z.object({
	email: z.string().optional(),
	type: z.string().optional()
});

// Zod schema for CustomerPhoneNumber
const CustomerPhoneNumberSchema = z.object({
	number: z.string().optional(),
	type: z.string().optional()
});

const schema = z.object({
	avatar: z.string().optional(),
	background: z.string().optional(),
	name: z.string().min(1, { message: 'Name is required' }),
	emails: z.array(CustomerEmailSchema).optional(),
	phoneNumbers: z.array(CustomerPhoneNumberSchema).optional(),
	title: z.string().optional(),
	company: z.string().optional(),
	birthday: z.string().optional(),
	address: z.string().optional(),
	notes: z.string().optional(),
	tags: z.array(z.string()).optional()
});

/**
 * The customer form.
 */
function CustomerForm() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const routeParams = useParams();
	const { id: customerId } = routeParams as { id: string };
	const { data: customer, isError } = useGetCustomersItemQuery(customerId, {
		skip: !customerId
	});

	const [createCustomer] = useCreateCustomersItemMutation();
	const [updateCustomer] = useUpdateCustomersItemMutation();
	const [deleteCustomer] = useDeleteCustomersItemMutation();

	const { data: tags } = useGetCustomersTagsQuery();

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	useEffect(() => {
		if (customerId === 'new') {
			reset(CustomerModel({}));
		} else {
			reset({ ...customer });
		}
	}, [customer, reset, routeParams]);

	/**
	 * Form Submit
	 */
	function onSubmit(data: Customer) {
		if (customerId === 'new') {
			createCustomer({ customer: data })
				.unwrap()
				.then((action) => {
					navigate(`/apps/customers/${action.id}`);
				});
		} else {
			updateCustomer({ id: customer.id, ...data });
		}
	}

	function handleRemoveCustomer() {
		if (!customer) {
			return;
		}

		deleteCustomer(customer.id).then(() => {
			navigate('/apps/customers');
		});
	}

	const background = watch('background');
	const name = watch('name');

	if (isError && customerId !== 'new') {
		setTimeout(() => {
			navigate('/apps/customers');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (_.isEmpty(form)) {
		return <FuseLoading className="min-h-screen" />;
	}

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{background && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={background}
						alt="user background"
					/>
				)}
			</Box>

			<div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
				<div className="w-full">
					<div className="flex flex-auto items-end -mt-64">
						<Controller
							control={control}
							name="avatar"
							render={({ field: { onChange, value } }) => (
								<Box
									sx={{
										borderWidth: 4,
										borderStyle: 'solid',
										borderColor: 'background.paper'
									}}
									className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
								>
									<div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
									<div className="absolute inset-0 flex items-center justify-center z-20">
										<div>
											<label
												htmlFor="button-avatar"
												className="flex p-8 cursor-pointer"
											>
												<input
													accept="image/*"
													className="hidden"
													id="button-avatar"
													type="file"
													onChange={async (e) => {
														function readFileAsync() {
															return new Promise((resolve, reject) => {
																const file = e?.target?.files?.[0];

																if (!file) {
																	return;
																}

																const reader: FileReader = new FileReader();

																reader.onload = () => {
																	if (typeof reader.result === 'string') {
																		resolve(
																			`data:${file.type};base64,${btoa(
																				reader.result
																			)}`
																		);
																	} else {
																		reject(
																			new Error(
																				'File reading did not result in a string.'
																			)
																		);
																	}
																};

																reader.onerror = reject;

																reader.readAsBinaryString(file);
															});
														}

														const newImage = await readFileAsync();

														onChange(newImage);
													}}
												/>
												<FuseSvgIcon className="text-white">
													heroicons-outline:camera
												</FuseSvgIcon>
											</label>
										</div>
										<div>
											<IconButton
												onClick={() => {
													onChange('');
												}}
											>
												<FuseSvgIcon className="text-white">heroicons-solid:trash</FuseSvgIcon>
											</IconButton>
										</div>
									</div>
									<Avatar
										sx={{
											backgroundColor: 'background.default',
											color: 'text.secondary'
										}}
										className="object-cover w-full h-full text-64 font-bold"
										src={value}
										alt={name}
									>
										{name?.charAt(0)}
									</Avatar>
								</Box>
							)}
						/>
					</div>
				</div>
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Name"
							placeholder="Name"
							id="name"
							error={!!errors.name}
							helperText={errors?.name?.message}
							variant="outlined"
							required
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:user-circle</FuseSvgIcon>
									</InputAdornment>
								)
							}}
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
							getOptionLabel={(option) => option?.title}
							renderOption={(_props, option, { selected }) => (
								<li {..._props}>
									<Checkbox
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									{option?.title}
								</li>
							)}
							value={value ? value?.map((id) => _.find(tags, { id })) : ([] as Tag[])}
							onChange={(event, newValue) => {
								onChange(newValue?.map((item) => item?.id));
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

				<Controller
					control={control}
					name="title"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Title"
							placeholder="Job title"
							id="title"
							error={!!errors.title}
							helperText={errors?.title?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:briefcase</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>

				<Controller
					control={control}
					name="company"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Company"
							placeholder="Company"
							id="company"
							error={!!errors.company}
							helperText={errors?.company?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:office-building</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name="emails"
					render={({ field }) => (
						<CustomerEmailSelector
							className="mt-32"
							{...field}
							value={field?.value}
							onChange={(val) => field.onChange(val)}
						/>
					)}
				/>

				<Controller
					control={control}
					name="phoneNumbers"
					render={({ field }) => (
						<PhoneNumberSelector
							className="mt-32"
							{...field}
							error={!!errors.phoneNumbers}
							helperText={errors?.phoneNumbers?.message}
							value={field.value}
							onChange={(val) => field.onChange(val)}
						/>
					)}
				/>

				<Controller
					control={control}
					name="address"
					render={({ field }) => (
						<TextField
							className="mt-32"
							{...field}
							label="Address"
							placeholder="Address"
							id="address"
							error={!!errors.address}
							helperText={errors?.address?.message}
							variant="outlined"
							fullWidth
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon size={20}>heroicons-solid:location-marker</FuseSvgIcon>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>
				<Controller
					control={control}
					name="birthday"
					render={({ field: { value, onChange } }) => (
						<DateTimePicker
							value={new Date(value)}
							onChange={(val) => {
								onChange(val?.toString());
							}}
							className="mt-32 mb-16 w-full"
							slotProps={{
								textField: {
									id: 'birthday',
									label: 'Birthday',
									InputLabelProps: {
										shrink: true
									},
									fullWidth: true,
									variant: 'outlined',
									error: !!errors.birthday,
									helperText: errors?.birthday?.message
								},
								actionBar: {
									actions: ['clear', 'today']
								}
							}}
							slots={{
								openPickerIcon: BirtdayIcon
							}}
						/>
					)}
				/>
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
			<Box
				className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
				sx={{ backgroundColor: 'background.default' }}
			>
				{customerId !== 'new' && (
					<Button
						color="error"
						onClick={handleRemoveCustomer}
					>
						Delete
					</Button>
				)}
				<Button
					className="ml-auto"
					onClick={() => history.back()}
				>
					Cancel
				</Button>
				<Button
					className="ml-8"
					variant="contained"
					color="secondary"
					disabled={_.isEmpty(dirtyFields) || !isValid}
					onClick={handleSubmit(onSubmit)}
				>
					Save
				</Button>
			</Box>
		</>
	);
}

export default CustomerForm;
