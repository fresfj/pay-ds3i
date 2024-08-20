import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { Paper, Typography, Grid } from '@mui/material';


const Android12Switch = styled(Switch)(({ theme }) => ({
	padding: 8,
	'& .MuiSwitch-track': {
		borderRadius: 22 / 2,
		'&::before, &::after': {
			content: '""',
			position: 'absolute',
			top: '50%',
			transform: 'translateY(-50%)',
			width: 16,
			height: 16,
		},
		'&::before': {
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
				theme.palette.getContrastText(theme.palette.primary.main),
			)}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
			left: 12,
		},
		'&::after': {
			backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
				theme.palette.getContrastText(theme.palette.primary.main),
			)}" d="M19,13H5V11H19V13Z" /></svg>')`,
			right: 12,
		},
	},
	'& .MuiSwitch-thumb': {
		boxShadow: 'none',
		width: 16,
		height: 16,
		margin: 2,
	},
}));

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? 'rgba(145, 158, 171, 0.12)' : 'rgb(244, 246, 248)',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));
/**
 * The shipping tab.
 */
function RulesTab() {
	const methods = useFormContext();
	const { control, watch } = methods;
	const status = watch('status');
	const start = watch('start');
	const end = watch('end');

	return (
		<div>
			<Grid container spacing={2} className='mt-8 mb-16'>
				<Grid item xs={12} md={5}>
					<Typography variant="h6" gutterBottom>
						Enabled
					</Typography>
					<Typography variant="caption" gutterBottom>
						Activate or deactivate the use of your coupon
					</Typography>
				</Grid>
				<Grid item xs={12} md={7}>
					<Item className='p-24'>
						<Controller
							name="status"
							control={control}
							render={({ field: { onChange, value } }) => (
								<FormControlLabel
									className="ml-0 w-full justify-between flex-row-reverse"
									label="Your coupon buys"
									control={
										<Android12Switch
											onChange={(ev) => { onChange(ev.target.checked) }}
											checked={value}
											name="status"
										/>
									}
								/>
							)}
						/>
					</Item>
				</Grid>
			</Grid>
			<div className="flex flex-column sm:flex-row w-full items-center space-x-16">
				<Controller
					name="start"
					control={control}
					render={({ field: { onChange, value } }) => (
						<DateTimePicker
							format='dd/MM/yyyy HH:mm:ss'
							className="mt-8 mb-16 w-full"
							value={new Date(value)}
							onChange={onChange}
							slotProps={{
								textField: {
									label: 'Start',
									variant: 'outlined'
								}
							}}
							maxDate={end}
						/>
					)}
				/>

				<Controller
					name="end"
					control={control}
					render={({ field: { onChange, value } }) => (
						<DateTimePicker
							format='dd/MM/yyyy HH:mm:ss'
							className="mt-8 mb-16 w-full"
							value={new Date(value)}
							onChange={onChange}
							slotProps={{
								textField: {
									label: 'End',
									variant: 'outlined'
								}
							}}
							minDate={start}
						/>
					)}
				/>
			</div>
		</div>
	);
}

export default RulesTab;
