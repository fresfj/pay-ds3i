import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Chip from '@mui/material/Chip';
import { useSelector } from 'react-redux';
import BudgetDetailsDataType from './types/BudgetDetailsDataType';
import { selectWidget } from '../../../ProjectDashboardApi';

/**
 * The BudgetDetailsWidget widget.
 */
function BudgetDetailsWidget() {
	const widget = useSelector(selectWidget<BudgetDetailsDataType>('budgetDetails'));

	if (!widget) {
		return null;
	}

	const { columns, rows } = widget;

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<Typography className="text-lg font-medium tracking-tight leading-6 truncate">Budget Details</Typography>

			<div className="table-responsive">
				<Table className="w-full min-w-full">
					<TableHead>
						<TableRow>
							{columns.map((column, index) => (
								<TableCell key={index}>
									<Typography
										color="text.secondary"
										className="font-semibold text-12 whitespace-nowrap"
									>
										{column}
									</Typography>
								</TableCell>
							))}
						</TableRow>
					</TableHead>

					<TableBody>
						{rows.map((row, index) => (
							<TableRow key={index}>
								{Object.entries(row).map(([key, value]) => {
									switch (key) {
										case 'type': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Chip
														size="small"
														label={value}
													/>
												</TableCell>
											);
										}
										case 'total':
										case 'expensesAmount':
										case 'remainingAmount': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>
														{value.toLocaleString('en-US', {
															style: 'currency',
															currency: 'USD'
														})}
													</Typography>
												</TableCell>
											);
										}
										case 'expensesPercentage':
										case 'remainingPercentage': {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>{`${value}%`}</Typography>
												</TableCell>
											);
										}
										default: {
											return (
												<TableCell
													key={key}
													component="th"
													scope="row"
												>
													<Typography>{value}</Typography>
												</TableCell>
											);
										}
									}
								})}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</Paper>
	);
}

export default memo(BudgetDetailsWidget);
