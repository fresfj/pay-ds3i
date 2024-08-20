import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { memo, useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import { useSelector } from 'react-redux';
import LanguageWidgetType from './types/LanguageWidgetType';
import { selectWidget } from '../AnalyticsDashboardApi';

/**
 * Language widget.
 */
function LanguageWidget() {
	const widget = useSelector(selectWidget<LanguageWidgetType>('language'));


	if (!widget) {
		return null;
	}

	const limitLanguageData = (data: any, limit: number) => {
		return {
			labels: data.labels.slice(0, limit),
			series: data.series.slice(0, limit),
			uniqueVisitors: data.uniqueVisitors
		};
	};

	const limitedLanguageData = limitLanguageData(widget, 2);

	const { series, labels, uniqueVisitors } = limitedLanguageData;
	const [awaitRender, setAwaitRender] = useState(true);
	const theme = useTheme();

	const chartOptions: ApexOptions = {
		chart: {
			animations: {
				speed: 400,
				animateGradually: {
					enabled: false
				}
			},
			fontFamily: 'inherit',
			foreColor: 'inherit',
			height: '100%',
			type: 'donut',
			sparkline: {
				enabled: true
			}
		},
		colors: ['#805AD5', '#B794F4'],
		labels,
		plotOptions: {
			pie: {
				customScale: 0.9,
				expandOnClick: false,
				donut: {
					size: '70%'
				}
			}
		},
		stroke: {
			colors: [theme.palette.background.paper]
		},
		series: { ...series, uniqueVisitors: uniqueVisitors },
		states: {
			hover: {
				filter: {
					type: 'none'
				}
			},
			active: {
				filter: {
					type: 'none'
				}
			}
		},
		tooltip: {
			enabled: true,
			fillSeriesColor: false,
			theme: 'dark',
			custom: ({
				seriesIndex,
				w
			}: {
				seriesIndex: number;
				w: { config: { colors: string[]; labels: string[]; series: string[]; } };
			}) =>
				`<div class="flex items-center h-32 min-h-32 max-h-23 px-12">
					<div class="w-12 h-12 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
					<div class="ml-8 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
					<div class="ml-8 text-md font-bold leading-none">${(parseInt(w.config.series[seriesIndex]) / uniqueVisitors * 100).toFixed(2)}%</div>
				</div>`
		}
	};

	useEffect(() => {
		setAwaitRender(false);
	}, []);

	if (awaitRender) {
		return null;
	}

	return (
		<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
			<div className="flex flex-col sm:flex-row items-start justify-between">
				<Typography className="text-lg font-medium tracking-tight leading-6 truncate">Language</Typography>
				<div className="ml-8">
					<Chip
						size="small"
						className="font-medium text-sm"
						label=" 30 days"
					/>
				</div>
			</div>

			<div className="flex flex-col flex-auto mt-24 h-192">
				<ReactApexChart
					className="flex flex-auto items-center justify-center w-full h-full"
					options={chartOptions}
					series={series}
					type={chartOptions?.chart?.type}
					height={chartOptions?.chart?.height}
				/>
			</div>
			<div className="mt-32">
				<div className="-my-12 divide-y">
					{series.map((dataset, i) => (
						<div
							className="grid grid-cols-3 py-12"
							key={i}
						>
							<div className="flex items-center">
								<Box
									className="flex-0 w-8 h-8 rounded-full"
									sx={{ backgroundColor: chartOptions?.colors?.[i] as string }}
								/>
								<Typography className="ml-12 truncate">{labels[i]}</Typography>
							</div>
							<Typography className="font-medium text-right">
								{(dataset).toLocaleString('en-US')}
							</Typography>
							<Typography
								className="text-right"
								color="text.secondary"
							>
								{((dataset / uniqueVisitors) * 100).toFixed(2)}%
							</Typography>
						</div>
					))}
				</div>
			</div>
		</Paper>
	);
}

export default memo(LanguageWidget);
