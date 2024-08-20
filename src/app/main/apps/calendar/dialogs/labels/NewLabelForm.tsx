import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import ListItem from '@mui/material/ListItem';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FormLabel from '@mui/material/FormLabel';
import Input from '@mui/material/Input';
import { PartialDeep } from 'type-fest';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import LabelModel from '../../models/LabelModel';
import { Label, useCreateCalendarLabelMutation } from '../../CalendarApi';

const defaultValues = LabelModel();

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a label title'),
	color: z.string().optional()
});

/**
 * The new label form.
 */
function NewLabelForm() {
	const [createLabel] = useCreateCalendarLabelMutation();

	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(data: PartialDeep<Label>) {
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
										<Controller
											name="color"
											control={control}
											render={({ field: { onChange: _onChange, value: _value } }) => (
												<FormLabel
													className="w-16 h-16 shrink-0 rounded-full"
													sx={{ backgroundColor: _value }}
												>
													<Input
														value={_value}
														onChange={(ev) => {
															_onChange(ev.target.value);
														}}
														type="color"
														className="opacity-0"
													/>
												</FormLabel>
											)}
										/>
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
