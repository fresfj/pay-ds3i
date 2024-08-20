import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux';
import ExpensesDataType from './types/ExpensesDataType';
import { selectWidget } from '../EcommerceDashboardApi'

/**
 * The MonthlyExpensesWidget widget.
 */
function MonthlyExpensesWidget(props) {
	const { title, value, percentage } = props
	const widget = useSelector(selectWidget<ExpensesDataType>('monthlyExpenses'));

	if (!widget) {
		return null;
	}

	const { amount, series, labels } = widget;
	const theme = useTheme();

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				enabled: false
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'line',
			sparkline: {
				enabled: true
			}
		},
		colors: [theme.palette.success.main],
		stroke: {
			curve: 'smooth'
		},
		tooltip: {
			theme: 'dark'
		},
		xaxis: {
			type: 'category',
			categories: labels
		},
		yaxis: {
			labels: {
				formatter: (val) => `$${val}`
			}
		}
	};
	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<div className="flex items-start justify-between">
				<div className="text-lg font-medium tracking-tight leading-6 truncate">{title}</div>
				<div className="ml-8 -mt-8 -mr-12">
					<IconButton>
						<FuseSvgIcon size={20}>heroicons-solid:dots-vertical</FuseSvgIcon>
					</IconButton>
				</div>
			</div>
			<div className="flex items-center mt-4">
				<div className="flex flex-col">
					<div className="text-3xl font-semibold tracking-tight leading-tight">
						{value.toLocaleString('pt-BR', {
							style: 'currency',
							currency: 'BRL'
						})}
					</div>
					<div className="flex items-center">
						<FuseSvgIcon
							className={`mr-4 ${percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}
							size={20}
						>
							{percentage >= 0 ? 'heroicons-solid:trending-up' : 'heroicons-solid:trending-down'}
						</FuseSvgIcon>
						<Typography className="font-medium text-sm text-secondary leading-none whitespace-nowrap">
							<span className={`${percentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
								{percentage && percentage.toFixed(1) + '%'}
							</span>
							<span> than last month</span>
						</Typography>
					</div>
				</div>
			</div>
		</Paper>
	);
}

export default MonthlyExpensesWidget;
