import TextField from '@mui/material/TextField';
import { Controller, useFormContext } from 'react-hook-form';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Typography, Grid, Autocomplete, Button } from '@mui/material';
import { Iconify } from '@fuse/components/iconify';
import _ from '@lodash';
import { addMinutes, format, isBefore, setHours, setMinutes } from 'date-fns';
import { useEffect, useState } from 'react';

const generateSecondsOptions = () => {
	return Array.from({ length: 12 }, (_, index) => ({
		value: ((index + 3) * 5),
		label: `${((index + 3) * 5)} seconds`
	}))
}

const options = generateSecondsOptions();
const now = new Date();
const minDate = new Date(now.getTime() + 30 * 60 * 1000);

const timeSlots = Array.from(new Array(24)).map(
	(_, index) => `${index < 10 ? '0' : ''}${index}:00`);
/**
 * The shipping tab.
 */
function RulesTab({ ...other }) {
	const methods = useFormContext();
	const { control, watch, formState: { errors }, setValue } = methods;

	const handleDayPeriod = () => {
		const dayPeriod = timeSlots.filter((time) => {
			const hour = parseInt(time.split(':')[0], 10);
			return hour >= 7 && hour <= 18;
		});
		setValue('special', dayPeriod);
	};

	const handleNightPeriod = () => {
		const nightPeriod = timeSlots.filter((time) => {
			const hour = parseInt(time.split(':')[0], 10);
			return hour < 7 || hour > 18;
		});
		setValue('special', nightPeriod);
	};

	const handleEvenHours = () => {
		const evenHours = timeSlots.filter((_, index) => index % 4 === 0 || index % 4 === 1);
		setValue('special', evenHours);
	};

	const handleOddHours = () => {
		const oddHours = timeSlots.filter((_, index) => index % 4 === 2 || index % 4 === 3);
		setValue('special', oddHours);
	};

	const cardForm = watch();

	const startDate = cardForm.startDate
	const intervalMin = cardForm.intervalMin
	const contacts = cardForm.contacts
	const allowedTimes = cardForm.special

	const [finalizationDate, setFinalizationDate] = useState<Date | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	// useEffect(() => {

	// 	if (startDate && intervalMin && contacts?.length) {
	// 		const formattedTime = format(new Date(startDate), 'HH:mm');

	// 		// Verificar se o horário está dentro dos horários permitidos
	// 		if (allowedTimes.length > 0 && !allowedTimes.includes(formattedTime)) {
	// 			setErrorMessage(`O disparo não pode ser feito fora dos horários permitidos: ${allowedTimes.join(', ')}.`);
	// 			setFinalizationDate(null);
	// 			return;
	// 		}

	// 		// Cálculo do tempo total
	// 		let totalTimeInMinutes = contacts.length * intervalMin;
	// 		let currentTime = new Date(startDate);
	// 		let remainingTimeInMinutes = totalTimeInMinutes;

	// 		// Ajustar o horário de término dentro dos horários permitidos
	// 		while (remainingTimeInMinutes > 0) {
	// 			const currentHourMinute = format(currentTime, 'HH:mm');

	// 			if (!allowedTimes.includes(currentHourMinute)) {
	// 				const nextAllowedTime = allowedTimes.find(time => isBefore(currentTime, setHours(setMinutes(new Date(currentTime), parseInt(time.split(':')[1])), parseInt(time.split(':')[0]))));
	// 				if (nextAllowedTime) {
	// 					currentTime = setHours(setMinutes(currentTime, parseInt(nextAllowedTime.split(':')[1])), parseInt(nextAllowedTime.split(':')[0]));
	// 				} else {
	// 					currentTime = addMinutes(currentTime, 60);
	// 				}
	// 				continue;
	// 			}

	// 			remainingTimeInMinutes -= 1;
	// 			currentTime = addMinutes(currentTime, 1);
	// 		}

	// 		setFinalizationDate(currentTime);
	// 		setErrorMessage(null);
	// 	}
	// }, [startDate, intervalMin, contacts, allowedTimes]);

	return (
		<div>
			<Controller
				name="startDate"
				control={control}
				render={({ field: { onChange, value } }) => (
					<DateTimePicker
						format='dd/MM/yyyy HH:mm:ss'
						className="mt-8 mb-16 w-full"
						disabled={other?.onBlocked}
						value={new Date(value) || null}
						minDate={new Date()}
						minTime={minDate}
						onChange={onChange}
						slotProps={{
							textField: {
								label: 'Horário do Disparo',
								variant: 'outlined',
								error: !!errors.start,
								helperText: errors?.start?.message as string
							}
						}}
					/>
				)}
			/>
			<div>
				{finalizationDate ? (
					<p>Previsão de finalização do disparo: {finalizationDate.toLocaleString()}</p>
				) : (
					<p>Por favor, preencha os dados para calcular a previsão de finalização.</p>
				)}
			</div>

			<div className="flex flex-column sm:flex-row w-full items-center space-x-16">
				<Grid container spacing={2} className='mt-8 mb-16'>
					<Grid item xs={12} md={6}>
						<Controller
							name="intervalMin"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Autocomplete
									value={options.find(option => option.value === value) || null}
									onChange={(event, newValue) => {
										onChange(newValue ? newValue.value : '');
									}}
									id="intervalMin"
									options={options}
									disabled={other?.onBlocked}
									getOptionLabel={(option) => option.label}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Intervalo mínimo (segundo)"
											error={!!errors.min}
											helperText={errors?.name?.message as string}
											variant="outlined"
											InputLabelProps={{
												shrink: true
											}}
										/>
									)}
								/>
							)}
						/>
					</Grid>
					<Grid item xs={12} md={6}>
						<Controller
							name="intervalMax"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Autocomplete
									value={options.find(option => option.value === value) || null}
									onChange={(event, newValue) => {
										onChange(newValue ? newValue.value : '')
									}}
									id="intervalMax"
									options={options}
									disabled={other?.onBlocked}
									getOptionLabel={(option) => option.label}
									renderInput={(params) => (
										<TextField
											{...params}
											label="Intervalo máximo (segundo)"
											error={!!errors.min}
											helperText={errors?.name?.message as string}
											variant="outlined"
											InputLabelProps={{
												shrink: true
											}}
										/>
									)}
								/>
							)}
						/>
					</Grid>
				</Grid>
			</div>
			<div className="flex-1 mb-24">
				<div className="flex items-center mt-16 mb-12">
					<Iconify icon="solar:clock-circle-bold-duotone" width={20} />
					<Typography className="font-semibold text-16 mx-8">Programação Especial</Typography>
				</div>
				<div className='flex flex-1'>
					<Button sx={{ px: 2 }} onClick={handleDayPeriod}>Período do Dia</Button>
					<Button sx={{ px: 2 }} onClick={handleNightPeriod}>Período da Noite</Button>
					<Button sx={{ px: 2 }} onClick={handleEvenHours}>Horas Pares</Button>
					<Button sx={{ px: 2 }} onClick={handleOddHours}>Horas Ímpares</Button>
				</div>
				<Controller
					name="special"
					control={control}
					defaultValue={[]}
					render={({ field: { onChange, value } }) => (
						<Autocomplete
							className="mt-8 mb-16"
							multiple
							freeSolo
							disabled={other?.onBlocked}
							options={timeSlots}
							value={value || ''}
							onChange={(event, newValue) => {
								onChange(newValue);
							}}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="Selecione o horário"
									label="Programação especial"
									variant="outlined"

								/>
							)}
						/>
					)}
				/>
			</div>
		</div>
	);
}

export default RulesTab;
