import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectWidget, useGetEcommerceDashboardWidgetsQuery } from '../EcommerceDashboardApi'
import { Image } from '@fuse/components/image'
import FuseUtils from '@fuse/utils/FuseUtils';
import clsx from 'clsx';
import FuseLoading from '@fuse/core/FuseLoading';
/**
 * The BudgetDetailsWidget widget.
 */
function BudgetDetailsWidget() {
	const { isLoading } = useGetEcommerceDashboardWidgetsQuery();
	const topCustomers = useSelector(selectWidget<any>('topCustomers'));

	if (!topCustomers) {
		return null;
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	const columns = ['Name', 'Product', 'Billing Type', 'Status', 'Value']

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<Typography className="text-lg font-medium tracking-tight leading-6 truncate">Latest Sales</Typography>
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
						{topCustomers.map((item, index) => (
							<TableRow key={index}>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography className='font-medium'>
										{item.customer.name}
									</Typography>
									<Typography className="text-gray-800/50 font-xs lowercase">
										{item.customer.email}
									</Typography>
								</TableCell>

								<TableCell
									component="th"
									scope="row"
								>
									<Typography className='font-medium'>
										{item.payment.description}
									</Typography>
									{item.cart.products[1] &&
										<Typography className="text-blue-800/50 font-xs normal-case">
											{item.cart.products[1]?.title}
										</Typography>
									}
								</TableCell>
								<TableCell
									component="th"
									scope="row"
								>
									{item.payment?.billingType === 'CREDIT_CARD' ?
										<Image sx={{ maxHeight: 32, maxWidth: 32 }}
											src={
												FuseUtils.cardFlag(item.payment?.creditCard?.creditCardBrand)
											}
											alt='card-credit'
										/>
										:
										<Image sx={{ maxHeight: 24, maxWidth: 24 }}
											src={
												FuseUtils.cardFlag(item.payment?.billingType)
											}
											alt='method'
										/>
									}

								</TableCell>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography
										className={clsx(
											'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
											item.payment.status === 'PENDING' &&
											'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
											item.payment.status === 'CONFIRMED' &&
											'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50',
											item.payment.status === 'RECEIVED' ||
											item.payment.status === 'ACTIVE' &&
											'bg-blue-50 text-blue-800 dark:bg-blue-600 dark:text-blue-50'
										)}
									>
										{item.payment.status}
									</Typography>
								</TableCell>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography className='font-medium'>
										{item.payment.value.toLocaleString('pt-BR', {
											style: 'currency',
											currency: 'BRL'
										})}
									</Typography>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</Paper>
	);
}

export default memo(BudgetDetailsWidget);
