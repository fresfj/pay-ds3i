import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Controller, useFormContext } from 'react-hook-form';
import { EcommerceProduct } from '../../ECommerceApi';
import WYSIWYGEditor from 'app/shared-components/WYSIWYGEditor';
import { Editor } from '@fuse/components/editor';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';


/**
 * The basic info tab.
 */
function BasicInfoTab() {
	const methods = useFormContext();
	const { control, formState, watch } = methods;
	const { errors } = formState;
	const saleLabelEnabled = watch('label.enabled');

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
						label="Name"
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
				name="subDescription"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						id="subDescription"
						label="Sub Description"
						type="text"
						multiline
						rows={5}
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="description"
				control={control}
				render={({ field }) => (
					<Editor
						className="mt-8 mb-16"
						placeholder='Write something awesome...'
						sx={{ maxHeight: 480 }}
						{...field}
					/>
				)}
			/>

			<Stack direction="row" alignItems="center" spacing={3} className="mt-8 mb-16">
				<Controller
					name="label.enabled"
					control={control}
					render={({ field }) => (
						<Switch
							{...field}
							checked={saleLabelEnabled}
							onChange={(e) => {
								field.onChange(e.target.checked);
							}}
						/>
					)}
				/>
				<Controller
					name="label.content"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							required
							label="Label"
							autoFocus
							id="label.content"
							variant="outlined"
							placeholder='Sale label'
							disabled={!saleLabelEnabled}
							fullWidth
						/>
					)}
				/>
			</Stack>

			<Controller
				name="categories"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						freeSolo
						options={[]}
						value={value as EcommerceProduct['categories']}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Select multiple categories"
								label="Categories"
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						)}
					/>
				)}
			/>

			<Controller
				name="tags"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						freeSolo
						options={[]}
						value={value as EcommerceProduct['tags']}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Select multiple tags"
								label="Tags"
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
	);
}

export default BasicInfoTab;
