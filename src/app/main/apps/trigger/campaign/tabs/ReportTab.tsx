import { useFormContext } from 'react-hook-form';
import { Grid, Button, useTheme, CardHeader } from '@mui/material';
import React, { useState } from 'react';
import { Iconify } from '@fuse/components/iconify';
import _ from '@lodash';
import { Chart, ChartLegends, useChart } from '@fuse/components/chart';
import moment from 'moment'
import ContactsDialog from '../dialogs/ContactsDialog';

type InputNumberValue = string | number | null | undefined;

type Options = Intl.NumberFormatOptions | undefined;

const DEFAULT_LOCALE = { code: 'en-US', currency: 'USD' };

const processDataForChart = (data) => {
	if (!data) {
		return [];
	}
	const updatedDates = data.map(item => moment.unix(item.updatedAt.seconds));
	const maxDate = moment.max(updatedDates).add(2, 'days');
	const minDate = moment.min(updatedDates).subtract(4, 'days');

	let messagesSent = {};
	let messagesDelivered = {};

	for (let m = moment(minDate); m.isSameOrBefore(maxDate); m.add(1, 'days')) {
		const day = m.format('DD MMM');
		messagesSent[day] = 0;
		messagesDelivered[day] = 0;
	}

	data.forEach(item => {
		const updatedAt = moment(item.updatedAt.seconds * 1000 + item.updatedAt.nanoseconds / 1e6);
		const day = updatedAt.format('DD MMM');
		if (messagesSent.hasOwnProperty(day)) {
			messagesSent[day]++;
			if (item.status === 2) {
				messagesDelivered[day]++;
			}
		}
	});

	const categories = Object.keys(messagesSent);
	const series = [
		{
			name: 'Mensagens enviadas',
			data: categories.map(day => messagesSent[day])
		},
		{
			name: 'Mensagens entregues',
			data: categories.map(day => messagesDelivered[day])
		}
	];

	return {
		categories,
		series
	};
};

function processInput(inputValue: InputNumberValue): number | null {
	if (inputValue == null || Number.isNaN(inputValue)) return null;
	return Number(inputValue);
}

function fNumber(inputValue: InputNumberValue, options?: Options) {
	const locale = DEFAULT_LOCALE;

	const number = processInput(inputValue);
	if (number === null) return '';

	const fm = new Intl.NumberFormat(locale.code, {
		minimumFractionDigits: 0, maximumFractionDigits: 2,
		...options,

	}).format(number);

	return fm;
}

const calculateTotals = (series) => {
	return series?.map(serie => serie?.data.reduce((acc, value) => acc + value, 0).toString())
};

/**
 * The shipping tab.
 */
function ReportTab() {
	const methods = useFormContext();
	const { control, watch, formState: { errors }, setValue } = methods;
	const [open, setOpen] = useState<boolean>(false)
	const theme = useTheme();
	const logs = watch('logs')
	const chartColors2 = [theme.palette.secondary.main, theme.palette.warning.main];
	const chartData: any = processDataForChart(logs);

	if (!chartData) {
		return null
	}

	const totals = calculateTotals(chartData?.series);

	const handleOpenDialog = () => {
		setOpen(true)
	}
	const handleCloseDialog = () => {
		setOpen(false)
	}

	const chartOptions2 = useChart({
		colors: chartColors2,
		xaxis: { categories: chartData?.categories }
	});

	return (
		<div className="flex flex-column sm:flex-row w-full items-center space-x-16">
			<Grid container spacing={2} className='mb-16'>
				<Grid item xs={12} md={12}>
					<CardHeader
						title={'Desempenho'}
						subheader={'Dispra de mensagens'}
						sx={{ mb: 3 }}
						action={
							<Button
								variant="outlined"
								color="secondary"
								sx={{ px: 2 }}
								onClick={handleOpenDialog}
								startIcon={<Iconify icon="solar:chart-square-line-duotone" />}
							>
								Detalhes
							</Button>
						}
					/>
					<ChartLegends
						colors={chartOptions2.colors}
						labels={chartData?.series?.map((item) => item.name)}
						values={totals}
						sx={{ px: 3, gap: 3 }}
					/>
					<Chart
						type="area"
						series={chartData?.series}
						options={chartOptions2}
						height={320}
						sx={{ py: 2.5, pl: 1, pr: 2.5 }}
					/>
				</Grid>
			</Grid>
			<ContactsDialog open={open} onClose={handleCloseDialog} contacts={logs} />
		</div>
	);
}

export default ReportTab;
