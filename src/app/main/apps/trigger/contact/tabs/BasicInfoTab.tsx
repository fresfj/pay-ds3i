import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import _ from '@lodash';

/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState, watch, setValue } = methods;
	const { errors } = formState;

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

		</div>
	);
}

export default BasicInfoTab;
