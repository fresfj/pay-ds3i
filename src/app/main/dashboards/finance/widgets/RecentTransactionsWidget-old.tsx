import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo, useEffect } from 'react';
import format from 'date-fns/format';
import clsx from 'clsx';
import Button from '@mui/material/Button';
import { useSelector } from 'react-redux';
import RecentTransactionsWidgetType from './types/RecentTransactionsWidgetType';
import { selectWidget, useGetFinanceDashboardSubscriptionsQuery } from '../FinanceDashboardApi';
import TableContainer from '@mui/material/TableContainer';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils/FuseUtils';

/**
 * The RecentTransactionsWidget widget.
 */
function RecentTransactionsWidget() {
	const widget = useSelector(selectWidget<RecentTransactionsWidgetType>('recentTransactions'));
	const { data: transactions } = useGetFinanceDashboardSubscriptionsQuery() as any

	if (true) {
		return <FuseLoading />;
	}

	const { columns, rows } = widget;

	function formatMonth(dateString) {
		const [year, month, day] = dateString.split('-');
		const monthNames = [
			'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
			'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
		];
		return monthNames[parseInt(month, 10) - 1];
	}

	function formatDoc(cpfCnpj: string) {
		if (cpfCnpj.length === 11) { // CPF
			return cpfCnpj.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
		} else if (cpfCnpj.length === 14) { // CNPJ
			return cpfCnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
		} else {
			return "Formato inválido";
		}
	}

	const monthNames = [
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	];

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<div>
				<Typography className="mr-16 text-lg font-medium tracking-tight leading-6 truncate">
					Recent transactions
				</Typography>
				<Typography
					className="font-medium"
					color="text.secondary"
				>
					1 pending, 4 completed
				</Typography>
			</div>
			<div className="table-responsive mt-24">
				<>
					<TableContainer sx={{ maxHeight: 640 }}>
						<Table
							stickyHeader
							aria-label="sticky table"
							className="simple w-full min-w-full table-auto rounded-md"
						>
							<TableHead>
								<TableRow>
									<TableCell className='min-w-[180px]'>Nome</TableCell>
									<TableCell className='min-w-[160px]'>Documento</TableCell>
									<TableCell className='min-w-[140px]'>Assinatura</TableCell>
									<TableCell>Valor</TableCell>
									{monthNames.map(month => (
										<TableCell key={month} className="min-w-[120px]">{month}</TableCell>
									))}
								</TableRow>
							</TableHead>
							<TableBody>
								{transactions && transactions?.data.map((item, index) => (
									<TableRow key={index}>
										<TableCell className='capitalize'>{FuseUtils.getFirstNameLastName(item.customer.name)}</TableCell>
										<TableCell>{formatDoc(item.customer.cpfCnpj)}</TableCell>
										<TableCell>{item.subscription.description}</TableCell>
										<TableCell>
											<Typography>
												{item.subscription.value.toLocaleString('pt-BR', {
													style: 'currency',
													currency: 'BRL'
												})}
											</Typography>
										</TableCell>
										{monthNames.map((month, index) => {
											return (
												<TableCell key={index}>
													{item.subscriptions.map(subscription => {
														const [year, subMonth] = subscription.dueDate.split('-');
														if (parseInt(subMonth) === monthNames.indexOf(month) + 1) {

															return (<>
																<Typography
																	className={clsx(
																		'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
																		subscription.status === 'PENDING' &&
																		'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
																		subscription.status === 'CONFIRMED' &&
																		'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50',
																		subscription.status === 'RECEIVED' &&
																		'bg-blue-50 text-blue-800 dark:bg-blue-600 dark:text-blue-50'
																	)}
																>
																	{format(new Date(subscription.dueDate), 'MMM dd, y')}
																</Typography>
															</>)

														} else {
															return null;
														}
													})
													}
												</TableCell>
											);
										})}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
				</>
			</div>
		</Paper>
	);
}

export default memo(RecentTransactionsWidget);
