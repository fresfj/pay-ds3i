import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Account, useDeleteAccountsItemMutation, useUpdateAccountsItemMutation } from '../../AccountApi';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import history from '@history';
import _ from '@lodash';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CountryCodeSelector from '../../../contacts/contact/phone-number-selector/CountryCodeSelector';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import CardActions from '@mui/material/CardActions';
import { Image } from '@fuse/components/image'
import { useTranslation } from 'react-i18next'
import { Autocomplete, Checkbox, Grid } from '@mui/material';
import { Tag } from '../../../customers/CustomersApi';

function BirtdayIcon() {
	return <FuseSvgIcon size={20}>heroicons-solid:cake</FuseSvgIcon>;
}

type FormType = Account;

/**
 * Form Validation Schema
 */

const schema = z.object({
	photoURL: z.string().optional(),
	displayName: z.string().min(1, { message: 'Name is required' }),
	email: z.string().email({ message: 'Email is invalid' }),
	birthday: z.string().optional(),
	phoneCountry: z.string().optional(),
	phoneNumber: z.string().optional(),
	identification: z.string().optional(),
	gender: z.string().optional(),
	foodPreferences: z.array(z.string()).optional(),
	size: z.string().optional(),
	about: z.string().optional()
});

/**
 * The general tab.
 */
function GeneralTab(props) {
	const { user, updateAccount, updateUser } = props
	const { t } = useTranslation('accountApp');

	const defaultValues = {
		displayName: user?.data?.displayName || '',
		email: user?.data?.email || '',
		photoURL: user?.data?.photoURL || '',
		phoneCountry: user?.data?.customer?.phoneNumbers[0]?.country || '',
		phoneNumber: user?.data?.customer?.phoneNumbers[0]?.phoneNumber || '',
		birthday: user?.data?.customer?.birthday || '',
		identification: user?.data?.customer?.identification || '',
		foodPreferences: user?.data?.customer?.foodPreferences || '',
		gender: user?.data?.customer?.gender || 'M',
		size: user?.data?.customer?.size || 'G',
		about: user?.data?.customer?.about || '',
	};

	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		defaultValues,
		resolver: zodResolver(schema)
	});


	const { isValid, dirtyFields, errors } = formState;

	const form = watch();
	const background = watch('background');
	const name = watch('name');

	const tags = [
		{
			"id": "1",
			"title": "Onívoro"
		},
		{
			"id": "2",
			"title": "Vegetariano"
		},
		{
			"id": "3",
			"title": "Vegano"
		},
		{
			"id": "4",
			"title": "Pescetariano"
		},
		{
			"id": "5",
			"title": "Crudívoro"
		},
		{
			"id": "6",
			"title": "Sem Glúten"
		},
		{
			"id": "7",
			"title": "Sem Lactose"
		},
		{
			"id": "8",
			"title": "Paleo"
		},
		{
			"id": "9",
			"title": "Keto (Cetogênica)"
		},
		{
			"id": "10",
			"title": "Flexitariano"
		},
		{
			"id": "11",
			"title": "Frugívoro"
		},
		{
			"id": "12",
			"title": "Macrobiótico"
		},
		{
			"id": "13",
			"title": "Ayurvédico"
		},
		{
			"id": "14",
			"title": "Sem Açúcar"
		},
		{
			"id": "15",
			"title": "Orgânico"
		},
		{
			"id": "16",
			"title": "Local/Sazonal"
		},
		{
			"id": "17",
			"title": "Halal"
		},
		{
			"id": "18",
			"title": "Kosher"
		},
		{
			"id": "19",
			"title": "Outro (Especificar)"
		}
	]

	/**
	 * Form Submit
	 */
	function onSubmit(data: Account) {
		if (user.uid !== undefined) {
			const userData = { ...user?.data.customer, ...data, uid: user.uid }
			updateAccount(userData);
			updateUser({
				data: {
					displayName: data.displayName,
					email: data.email,
					photoURL: data.photoURL,
					customer: userData
				}
			});
			reset(data)
		}
	}

	function handleRemoveContact() {
		// deleteContact(contact.id).then(() => {
		// 	navigate('/apps/contacts');
		// });
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	useEffect(() => {
		reset({ ...user.data });
	}, [reset]);

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			<div className="md:flex">
				<div className="flex flex-col md:w-400 md:ltr:pr-48 md:rtl:pl-32">
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
						sx={{ pt: 8, px: 3, textAlign: 'center' }}
					>
						<CardContent className="flex flex-wrap px-32 justify-center">
							<Controller
								control={control}
								name="photoURL"
								render={({ field: { onChange, value } }) => (
									<Box
										sx={{
											borderWidth: 4,
											borderStyle: 'solid',
											borderColor: 'background.paper'
										}}
										className="relative flex items-center justify-center w-160 h-160 rounded-full overflow-hidden"
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

																	if (!file && file.size / 1024 / 1024 > 3) {
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
						</CardContent>
						<Typography
							variant="caption"
							sx={{
								mx: 'auto',
								display: 'block',
								textAlign: 'center',
								color: 'text.secondary',
							}}
						>{t('ALLOWED')} *.jpeg, *.jpg, *.png, *.gif
							<br /> {t('MAX_SIZE_OF')}
						</Typography>
						<Box className="flex items-center justify-center mt-32 mb-12 py-14">
							<Button
								className="whitespace-nowrap"
								variant="outlined"
								color="error"
								onClick={handleRemoveContact}
							>
								{t('DELETE_ACCOUNT')}
							</Button>
						</Box>
					</Card>
				</div>
				<div className="flex flex-col flex-1">
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>

						<CardContent className="pb-0 pt-32">
							<Grid container className='px-14 sm:px-24' spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
								<Grid item xs={12} md={6}>
									<Controller
										control={control}
										name="displayName"
										render={({ field }) => (
											<TextField
												className="mt-16"
												{...field}
												label={t('NAME')}
												placeholder={t('NAME')}
												id="displayName"
												error={!!errors.displayName}
												helperText={errors?.displayName?.message}
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
								</Grid>
								<Grid item xs={12} md={6}>
									<Controller
										control={control}
										name="email"
										render={({ field }) => (
											<TextField
												className="mt-16"
												{...field}
												label={t('EMAIL')}
												id="email"
												disabled
												error={!!errors.email}
												helperText={errors?.email?.message}
												variant="outlined"
												required
												fullWidth
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>
														</InputAdornment>
													)
												}}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} md={4}>
									<Controller
										control={control}
										name="phoneNumber"
										render={({ field }) => (
											<TextField
												{...field}
												className="mt-16"
												label={t('PHONE_NUMBER')}
												placeholder={t('PHONE_NUMBER')}
												variant="outlined"
												fullWidth
												error={!!errors.phoneNumber}
												helperText={errors?.phoneNumber?.message}
												InputProps={{
													startAdornment: (
														<Controller
															control={control}
															name="phoneCountry"
															render={({ field: _field }) => (
																<InputAdornment position="start">
																	<CountryCodeSelector {..._field} />
																</InputAdornment>
															)}
														/>
													)
												}}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} md={4}>
									<Controller
										control={control}
										name="birthday"
										render={({ field: { value, onChange } }) => (
											<DateTimePicker
												className="mt-16"
												format='dd/MM/yyyy'
												value={new Date(value)}
												onChange={(val) => {
													onChange(val?.toString());
												}}
												slotProps={{
													textField: {
														id: 'birthday',
														label: t('BIRTHDAY'),
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
								</Grid>
								<Grid item xs={12} md={4}>
									<Controller
										control={control}
										name="identification"
										render={({ field }) => (
											<TextField
												className="mt-16"
												{...field}
												label={t('IDENTIFICATION')}
												id="identification"
												error={!!errors.identification}
												helperText={errors?.identification?.message}
												variant="outlined"
												required
												fullWidth
												InputProps={{
													startAdornment: (
														<InputAdornment position="start">
															<FuseSvgIcon size={20}>heroicons-solid:identification</FuseSvgIcon>
														</InputAdornment>
													)
												}}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} md={4}>
									<Controller
										control={control}
										name="foodPreferences"
										render={({ field: { onChange, value } }) => (
											<Autocomplete
												multiple
												id="foodPreferences"
												className="mt-16"
												limitTags={1}
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
														label={t('FOOD_PREFERENCES')}
														placeholder={t('PREFERENCES')}
													/>
												)}
											/>
										)}
									/>
								</Grid>
								<Grid item xs={12} md={4}>
									<Controller
										name="gender"
										control={control}
										render={({ field }) => (
											<FormControl sx={{ mt: 2 }} fullWidth className="mt-16">
												<InputLabel htmlFor="max-width">{t('GENDER')}</InputLabel>
												<Select
													{...field}
													fullWidth
													label={t('GENDER')}
												>
													<MenuItem value={'M'}>{t('MAN')}</MenuItem>
													<MenuItem value={'W'}>{t('WOMAN')}</MenuItem>
												</Select>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid item xs={12} md={4}>
									<Controller
										name="size"
										control={control}
										render={({ field }) => (
											<FormControl sx={{ mt: 2 }} fullWidth className="mt-16">
												<InputLabel htmlFor="max-width">{t('SHIRT_SIZE')}</InputLabel>
												<Select
													{...field}
													label={t('SHIRT_SIZE')}
													fullWidth
												>
													<MenuItem value={'PP'}>PP</MenuItem>
													<MenuItem value={'P'}>P</MenuItem>
													<MenuItem value={'M'}>M</MenuItem>
													<MenuItem value={'G'}>G</MenuItem>
													<MenuItem value={'GG'}>GG</MenuItem>
												</Select>
											</FormControl>
										)}
									/>
								</Grid>
								<Grid item xs={12} md={12}>
									<Controller
										control={control}
										name="about"
										render={({ field }) => (
											<TextField
												className="mt-16"
												{...field}
												label={t('ABOUT')}
												id="about"
												error={!!errors.about}
												helperText={errors?.about?.message}
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
								</Grid>
							</Grid>

							<div className="w-full">
								<div className="relative grid md:grid-cols-2 gap-x-20 gap-y-4 items-center px-14 sm:px-24">

								</div>
							</div>
						</CardContent>
						<Divider className='border-dashed mt-40' />
						<CardActions className="flex items-center justify-end pb-24 sm:pr-48 sm:pl-36">
							<Button
								className="mt-12"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSubmit(onSubmit)}
							>
								{t('SAVE_CHANGES')}
							</Button>
						</CardActions>
					</Card>
				</div>
			</div>
		</motion.div>
	);
}

export default GeneralTab;
