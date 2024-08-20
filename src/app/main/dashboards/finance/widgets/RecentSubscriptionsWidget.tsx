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
import { selectWidget, useGetFinanceDashboardQuery, useGetFinanceDashboardSubscriptionsQuery } from '../FinanceDashboardApi';
import TableContainer from '@mui/material/TableContainer';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseUtils from '@fuse/utils/FuseUtils';
import transactionsWidgetType from './types/TransactionsType'
/**
 * The RecentTransactionsWidget widget.
 */
function RecentSubscriptionsWidget() {
	const widget = useSelector(selectWidget<RecentTransactionsWidgetType>('recentTransactions'));
	const { data: subscriptions } = useGetFinanceDashboardSubscriptionsQuery() as any

	if (!subscriptions) {
		return <FuseLoading />;
	}

	const { columns, rows } = widget;

	function getDescription(transactionType) {
		const transaction = transactionsWidgetType.find(t => t.type === transactionType);
		return transaction ? transaction.name : 'Descrição não encontrada';
	}

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
					Recent subscriptions
				</Typography>
				<Typography
					className="font-medium"
					color="text.secondary"
				>
					{subscriptions.totalCount} subscriptions
				</Typography>
			</div>
			<div className="table-responsive mt-24">
				<>
					<TableContainer>
						<Table
							className="simple w-full min-w-full table-auto rounded-md"
						>
							<TableHead>
								<TableRow>
									<TableCell>Name</TableCell>
									<TableCell className="visible xl:hidden">Plan</TableCell>
									<TableCell className="visible xl:hidden">CPF/CNPJ</TableCell>
									<TableCell>Phone</TableCell>
									<TableCell>City</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{subscriptions && subscriptions?.data.map((item, index) => (
									<TableRow key={index}>
										<TableCell>
											<Typography className="font-medium capitalize">
												{item.customer.name?.split(' ')[0]}
												{` `}
												{item.customer.name?.split(' ')[item.customer.name?.split(' ')?.length - 1]}
											</Typography>
											<Typography className="text-gray-800/50 font-xs lowercase">
												{item.customer.email}
											</Typography>
										</TableCell>
										<TableCell className="visible xl:hidden"><Typography className="text-sm">{item.subscription.description}</Typography></TableCell>
										<TableCell className="visible xl:hidden"><Typography className="text-sm">{item.customer.cpfCnpj}</Typography></TableCell>
										<TableCell><Typography className="text-sm">{item.customer.phone}</Typography></TableCell>
										<TableCell><Typography className="text-sm">{item.customer.cityName + `/` + item.customer.state}</Typography></TableCell>
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

export default memo(RecentSubscriptionsWidget);
