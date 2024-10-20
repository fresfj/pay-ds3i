import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { useGetContactsQuery } from '../../TriggerApi';
import { ScrumboardMember } from '../../../scrumboard/ScrumboardApi';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import clsx from 'clsx';
import _ from '@lodash';
import { SyntheticEvent, useCallback, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Upload } from '@fuse/components/upload';
import { Iconify } from '@fuse/components/iconify';
import FuseLoading from '@fuse/core/FuseLoading';
import { useGetInstancesAllQuery } from 'src/app/main/pages/Instances/InstanceApi';
import { useSelector } from 'react-redux';
import { selectUser } from 'src/app/auth/user/store/userSlice';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const removeDuplicates = (contacts) => {
	const seen = new Set();
	return contacts.filter(contact => {
		const duplicate = seen.has(contact.phone);
		seen.add(contact.phone);
		return !duplicate;
	});
};
/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState, watch, setValue } = methods;
	const { errors } = formState;
	const cardForm = watch();
	const { data: user } = useSelector(selectUser);
	const { data: instances, isLoading: isInstancesLoading } = useGetInstancesAllQuery(
		{ instanceId: user.customer.id },
		{ skip: !user.customer.id }) as any;
	const { data: contactGroup, isLoading: isContactsLoading } = useGetContactsQuery();
	const [file, setFile] = useState<File | string | null>(null);
	const openInstances = instances?.filter(instance => instance.connectionStatus === "open");

	const handleDropSingleFile = useCallback((acceptedFiles: File[]) => {
		const newFile = acceptedFiles[0];
		setFile(newFile);
	}, []);

	if (isInstancesLoading || isContactsLoading) {
		return <FuseLoading />;
	}

	const getCombinedContacts = (ids) => {
		const selectedContacts = ids.map(id => _.find(contactGroup, { id }) || {});
		return removeDuplicates(selectedContacts.reduce((acc, group) => {
			return [...acc, ...group.contacts];
		}, []));
	};

	return (
		<div>
			<Controller
				name="name"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Nome da Campanha"
						autoFocus
						id="name"
						variant="outlined"
						fullWidth
						error={!!errors.name}
						helperText={errors?.name?.message as string}
					/>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="description"
						label="Descrição"
						required
						error={!!errors.description}
						helperText={errors?.description?.message as string}
						type="text"
						multiline
						rows={3}
						variant="outlined"
						fullWidth
					/>
				)}
			/>
			<div className="flex-1 mb-24">
				<div className="flex items-center mt-16 mb-12">
					<Iconify icon="solar:smartphone-2-bold-duotone" width={20} />
					<Typography className="font-semibold text-16 mx-8">Instâncias</Typography>
				</div>
				<Controller
					control={control}
					name="instanceIds"
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							className="mt-8 mb-16"
							multiple
							freeSolo
							options={openInstances || []}
							value={cardForm?.instanceIds?.map((id) => _.find(openInstances, { id }))}
							getOptionLabel={(instances: string | ScrumboardMember) => {
								return typeof instances === 'string' ? instances : instances?.name;
							}}
							renderOption={(props, instances: any, { selected }) => (
								<li {...props}>
									<Checkbox
										icon={icon}
										checkedIcon={checkedIcon}
										style={{ marginRight: 8 }}
										checked={selected}
									/>
									<>
										<div className={`${instances?.integration !== 'WHATSAPP-BAILEYS' ?
											'bg-green-A700' : 'bg-deep-purple-A200'} text-white rounded-full w-28 h-28 mr-8 flex justify-center items-center`}>
											<Iconify icon="ic:outline-whatsapp" />
										</div>
										<Typography className="flex-1 text-16 font-medium">
											{instances?.name}
											<Typography className='text-12' color='inherit'>
												{instances?.integration === 'WHATSAPP-BAILEYS' ? 'WhatsApp Starter' : 'WhatsApp Business API (WABA)'}
											</Typography>
										</Typography>
									</>
								</li>
							)}
							onChange={(event: SyntheticEvent<Element, Event>, value: (string | ScrumboardMember)[]) => {
								const { ids, instanceNames } = value.reduce((acc, item) => {
									if (typeof item !== 'string') {
										acc.ids.push(item.id);
										acc.instanceNames.push(item.name);
									}
									return acc;
								}, { ids: [], instanceNames: [] });
								setValue('instanceNames', instanceNames);
								setValue('instanceIds', ids);
							}}
							renderTags={(value, getTagProps) =>
								value.map((option, index) => {
									if (typeof option === 'string') {
										return <span />;
									}

									return (
										<Chip
											label={option.name}
											{...getTagProps({ index })}
											className={clsx('m-3', option?.class)}
											avatar={
												<Tooltip title={option.name}>
													<>
														<Avatar src={option?.profilePicUrl} />
													</>
												</Tooltip>
											}
										/>
									);
								})
							}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Select multiple Instances"
									label="Instances"
									variant="outlined"
									InputLabelProps={{
										shrink: true
									}}
								/>
							)}
						/>
					)}
				/>
			</div>

			<div className="flex-1 mb-24">
				<div className="flex items-center mt-16 mb-12">
					<Iconify icon="solar:users-group-rounded-bold-duotone" width={20} />
					<Typography className="font-semibold text-16 mx-8">Grupo de Contato</Typography>
				</div>
				<Autocomplete
					className="mt-8 mb-16"
					multiple
					freeSolo
					options={contactGroup || []}
					getOptionLabel={(contacts: string | ScrumboardMember) => {
						return typeof contacts === 'string' ? contacts : contacts?.name;
					}}
					value={cardForm?.contactIds?.map((id) => _.find(contactGroup, { id }))}
					renderOption={(props, contact: any, { selected }) => (
						<li {...props}>
							<Checkbox
								icon={icon}
								checkedIcon={checkedIcon}
								style={{ marginRight: 8 }}
								checked={selected}
							/>
							<>
								<Typography className="flex-1 text-16 font-medium">
									{contact?.name}
									<Typography className='text-12' color='inherit'>
										Esse grupo tem <strong>{contact?.contacts.length}</strong> contatos
									</Typography>
								</Typography>
							</>
						</li>
					)}
					onChange={(event: SyntheticEvent<Element, Event>, value: (string | ScrumboardMember)[]) => {
						const ids = value
							.filter((item): item is ScrumboardMember => typeof item !== 'string')
							.map((item) => item.id);
						const combinedContacts = getCombinedContacts(ids);
						console.log(`combinedContacts`, combinedContacts)
						setValue('contacts', combinedContacts)
						setValue('contactIds', ids);
					}}
					renderTags={(value, getTagProps) =>
						value.map((option, index) => {
							if (typeof option === 'string') {
								return <span />;
							}

							return (
								<Chip
									label={option.name}
									{...getTagProps({ index })}
									className={clsx('m-3', option?.class)}
								/>
							);
						})
					}
					renderInput={(params) => (
						<TextField
							{...params}
							placeholder="Select multiple Contacts"
							label="Contacts"
							variant="outlined"
							InputLabelProps={{
								shrink: true
							}}
						/>
					)}
				/>
			</div>

			<div className="flex-1 mb-24">
				<div className="flex items-center mt-16 mb-12">
					<Iconify icon="solar:file-download-bold-duotone" width={20} />
					<Typography className="font-semibold text-16 mx-8">Arquivo de Mídia</Typography>
				</div>
				<Upload value={file} onDrop={handleDropSingleFile} onDelete={() => setFile(null)} />
			</div>
			<Controller
				name="conversation"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="conversation"
						label="Message"
						required
						error={!!errors.conversation}
						helperText={errors?.conversation?.message as string}
						type="text"
						multiline
						rows={6}
						variant="outlined"
						fullWidth
					/>
				)}
			/>

		</div>
	);
}

export default BasicInfoTab;
