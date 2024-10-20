import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { Iconify } from '@fuse/components/iconify';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';


type SubscriptionOption = {
	type: 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual';
	installments: number;
};

interface EcommerceProduct {
	isSubscription: boolean;
	subscriptionOptions: SubscriptionOption[];
}
/**
 * The pricing tab.
 */
function PricingTab() {
	const methods = useFormContext();

	const { control, watch, setValue } = methods;
	const isSubscription = watch('isSubscription');
	const paymentOptions = ['card', 'pix'];

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'subscriptionOptions',
	});

	const addSubscriptionOption = () => {
		append({ type: 'Mensal', value: 0, installments: 1 });
	};

	if (fields.length === 0) {
		addSubscriptionOption();
	}

	return (
		<div>
			<Stack spacing={2} mb={2}>
				<Typography variant="subtitle2">Tipo do Produto</Typography>

				<Controller
					name="type"
					control={control}
					render={({ field }) => (
						<Box gap={2} display="grid" gridTemplateColumns="repeat(2, 1fr)">
							{[
								{
									label: 'Físico',
									icon: <Iconify icon="solar:box-line-duotone" width={32} sx={{ mb: 2 }} />,
								},
								{
									label: 'Digital',
									icon: <Iconify icon="solar:code-square-line-duotone" width={32} sx={{ mb: 2 }} />,
								},
							].map((item) => (
								<Paper
									component={ButtonBase}
									variant="outlined"
									key={item.label}
									onClick={() => field.onChange(item?.label?.toLowerCase())}
									sx={{
										p: 2.5,
										borderRadius: 1,
										typography: 'subtitle2',
										flexDirection: 'column',
										...(item?.label?.toLowerCase() === field?.value?.toLowerCase() && {
											borderWidth: 2,
											borderColor: 'text.primary',
										}),
									}}
								>
									{item.icon}
									{item.label}
								</Paper>
							))}
						</Box>
					)}
				/>
			</Stack>
			<Controller
				name="priceTaxExcl"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Tax Excluded Price"
						id="priceTaxExcl"
						InputProps={{
							startAdornment: <InputAdornment position="start">$</InputAdornment>
						}}
						type="number"
						variant="outlined"
						autoFocus
						fullWidth
					/>
				)}
			/>

			<Controller
				name="priceTaxIncl"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Tax Included Price"
						id="priceTaxIncl"
						InputProps={{
							startAdornment: <InputAdornment position="start">$</InputAdornment>
						}}
						type="number"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="taxRate"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Tax Rate"
						id="taxRate"
						InputProps={{
							startAdornment: <InputAdornment position="start">$</InputAdornment>
						}}
						type="number"
						variant="outlined"
						fullWidth
					/>
				)}
			/>

			<Controller
				name="comparedPrice"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Compared Price"
						id="comparedPrice"
						InputProps={{
							startAdornment: <InputAdornment position="start">$</InputAdornment>
						}}
						type="number"
						variant="outlined"
						fullWidth
						helperText="Add a compare price to show next to the real price"
					/>
				)}
			/>

			<Controller
				name="installments"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mt-8 mb-16"
						label="Número de Parcelas"
						id="installments"
						type="number"
						variant="outlined"
						fullWidth
						helperText="Número máximo de parcelas permitidas"
					/>
				)}
			/>

			<Controller
				name="paymentMethods"
				control={control}
				defaultValue={[]}
				render={({ field: { onChange, value } }) => (
					<Autocomplete
						className="mt-8 mb-16"
						multiple
						options={paymentOptions}
						value={value || []}
						onChange={(event, newValue) => {
							onChange(newValue);
						}}
						renderInput={(params) => (
							<TextField
								{...params}
								placeholder="Selecione métodos de pagamento"
								label="Métodos de Pagamento"
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
				name="isSubscription"
				control={control}
				render={({ field }) => (
					<FormControlLabel
						className="mt-8 mb-16"
						control={<Switch {...field} checked={field.value} />}
						color='inherit'
						label="Produto com Assinatura"
					/>
				)}
			/>

			{isSubscription && (
				<Box mt={2}>
					<Typography my={4} component='h5' variant='h6' color='text.primary'>
						Opções de Assinatura
					</Typography>
					{fields.map((item, index) => (
						<Box key={item.id} display="flex" alignItems="center" mb={2} className="mt-8 mb-20 gap-8">
							<Controller
								name={`subscriptionOptions.${index}.type`}
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										select
										SelectProps={{
											MenuProps: { PaperProps: { sx: { maxHeight: 270 } } },
											sx: { textTransform: 'capitalize', lineHeight: 1.5 }
										}}
										label="Tipo"
										variant="outlined"
										fullWidth
									>
										<MenuItem value="Mensal">Mensal</MenuItem>
										<MenuItem value="Trimestral">Trimestral</MenuItem>
										<MenuItem value="Semestral">Semestral</MenuItem>
										<MenuItem value="Anual">Anual</MenuItem>
									</TextField>
								)}
							/>

							<Controller
								name={`subscriptionOptions.${index}.value`}
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Valor"
										variant="outlined"
										type="number"
										InputProps={{
											startAdornment: <InputAdornment position="start">$</InputAdornment>,
										}}
										style={{ width: '150px' }}
										fullWidth
									/>
								)}
							/>

							<Controller
								name={`subscriptionOptions.${index}.installments`}
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Parcelas"
										variant="outlined"
										type="number"
										style={{ width: '150px' }}
										fullWidth
									/>
								)}
							/>


							{index > 0 && (
								<IconButton color="error" onClick={() => remove(index)} disabled={fields.length <= 1}>
									<DeleteIcon />
								</IconButton>
							)}
						</Box>
					))}
					<Button variant="outlined"
						color="primary"
						className="group inline-flex items-center my-8 py-2 px-12 cursor-pointer"
						startIcon={<FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>}
						onClick={addSubscriptionOption}>
						Adicionar Opção de Assinatura
					</Button>
				</Box>
			)}
		</div>
	);
}

export default PricingTab;
