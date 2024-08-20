import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { EcommerceProduct } from '../../ECommerceApi';
import InputAdornment from '@mui/material/InputAdornment';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;

	const start = watch('start');
	const end = watch('end');

	return (
		<div>
			<Controller
				name="code"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						required
						label="Code"
						autoFocus
						id="name"
						variant="outlined"
						fullWidth
						error={!!errors.code}
						helperText={errors?.code?.message as string}
						value={field.value.toUpperCase()}
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
						label="Description"
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
			<div>
				<div className="flex flex-column sm:flex-row w-full items-center space-x-16">
					<Controller
						name="quantity"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16"
								label="Quantity"
								id="quantity"
								variant="outlined"
								type="number"
								fullWidth
							/>
						)}
					/>
					<Controller
						name="value"
						control={control}
						render={({ field }) => (
							<TextField
								{...field}
								className="mt-8 mb-16 w-full"
								label="Value"
								id="value"
								InputProps={{
									startAdornment: <InputAdornment position="start">%</InputAdornment>
								}}
								type="number"
								variant="outlined"
								autoFocus
								fullWidth
							/>
						)}
					/>

					<Controller
						name="type"
						control={control}
						render={({ field }) =>
						(
							<RadioGroup
								{...field}
								row
								aria-labelledby="demo-row-radio-buttons-group-label"
								name="row-radio-buttons-group"
								defaultValue={true}
								className="mt-8 mb-16 w-full"
							>
								<FormControlLabel value={true} control={<Radio className='ml-14' />} label="%" />
								<FormControlLabel disabled value={false} control={<Radio />} label="$" />
							</RadioGroup>
						)}
					/>
				</div>
			</div>
		</div>
	);
}

export default BasicInfoTab;
