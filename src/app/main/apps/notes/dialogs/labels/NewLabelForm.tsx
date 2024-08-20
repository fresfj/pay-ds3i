import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LabelModel from '../../models/LabelModel';
import { NotesLabel, useCreateNotesLabelMutation, useGetNotesLabelsQuery } from '../../NotesApi';

const defaultValues = {
	title: ''
};

type FormType = { title: NotesLabel['title'] };

/**
 * The new label form.
 */
function NewLabelForm() {
	const [createLabel] = useCreateNotesLabelMutation();
	const { data: labels } = useGetNotesLabelsQuery();

	/**
	 * Form Validation Schema
	 */
	const schema = z.object({
		title: z
			.string()
			.nonempty('You must enter a label title')
			.refine(
				(title) => {
					// Check if title exists in labelListArray
					return !labels.some((label) => label.title === title);
				},
				{
					message: 'This label title already exists'
				}
			)
	});

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(data: FormType) {
		const newLabel = LabelModel(data);
		createLabel(newLabel);
		reset(defaultValues);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<ListItem
				className="p-0 mb-16"
				dense
			>
				<Controller
					name="title"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className={clsx('flex flex-1')}
							error={!!errors.title}
							helperText={errors?.title?.message}
							placeholder="Create new label"
							variant="outlined"
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<FuseSvgIcon color="action">heroicons-outline:tag</FuseSvgIcon>
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											className="w-32 h-32 p-0"
											aria-label="Delete"
											disabled={_.isEmpty(dirtyFields) || !isValid}
											type="submit"
											size="large"
										>
											<FuseSvgIcon
												color="action"
												size={20}
											>
												heroicons-outline:check
											</FuseSvgIcon>
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>
			</ListItem>
		</form>
	);
}

export default NewLabelForm;
