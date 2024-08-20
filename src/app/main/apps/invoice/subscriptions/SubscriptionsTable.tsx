import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { ChangeEvent, MouseEvent, useState } from 'react';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Many } from 'lodash';
import { WithRouterProps } from '@fuse/core/withRouter/withRouter';
import * as React from 'react';
import { useSelector } from 'react-redux';
import SubscriptionsTableHead from './SubscriptionsTableHead';
import { EcommerceCoupon, EcommerceProduct, selectFilteredSubscriptions, useGetInvoiceSubscriptionsQuery } from '../InvoiceApi';
import Box from '@mui/material/Box';
import format from 'date-fns/format';
import FuseUtils from '@fuse/utils';

type SubscriptionsTableProps = WithRouterProps & {
	navigate: (path: string) => void;
};

/**
 * The subscriptions table.
 */
function SubscriptionsTable(props: SubscriptionsTableProps) {
	const { navigate } = props;

	const { data, isLoading } = useGetInvoiceSubscriptionsQuery() as any;

	const subscriptions: any = useSelector(selectFilteredSubscriptions(data?.data));
	const [selected, setSelected] = useState<EcommerceCoupon['id'][]>([]);

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [tableOrder, setTableOrder] = useState<{
		direction: 'asc' | 'desc';
		id: string;
	}>({
		direction: 'asc',
		id: ''
	});

	function handleRequestSort(event: MouseEvent<HTMLSpanElement>, property: string) {
		const newOrder: {
			direction: 'asc' | 'desc';
			id: string;
		} = { id: property, direction: 'desc' };

		if (tableOrder.id === property && tableOrder.direction === 'desc') {
			newOrder.direction = 'asc';
		}

		setTableOrder(newOrder);
	}

	function handleSelectAllClick(event: ChangeEvent<HTMLInputElement>) {
		if (event.target.checked) {
			setSelected(subscriptions.map((n) => n.id));
			return;
		}

		setSelected([]);
	}

	function handleDeselect() {
		setSelected([]);
	}

	function handleClick(item: any) {

		navigate(`/apps/invoice/${item.subscription.id.replace('sub_', '')}/${item.subscription.customer.replace('cus_', '')}`);
	}

	function handleCheck(event: ChangeEvent<HTMLInputElement>, id: string) {
		const selectedIndex = selected.indexOf(id);
		let newSelected: string[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected?.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
		}

		setSelected(newSelected);
	}

	function handleChangePage(event: React.MouseEvent<HTMLButtonElement> | null, page: number) {
		setPage(+page);
	}

	function handleChangeRowsPerPage(event: React.ChangeEvent<HTMLInputElement>) {
		setRowsPerPage(+event.target.value);
	}

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<FuseLoading />
			</div>
		);
	}

	if (subscriptions?.length === 0) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no subscriptions!
				</Typography>
			</motion.div>
		);
	}
	const monthNames = [
		'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
		'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
	];

	return (
		<div className="w-full flex flex-col min-h-full">
			<FuseScrollbars className="grow overflow-x-auto">
				<Table
					stickyHeader
					className="min-w-xl"
					aria-labelledby="tableTitle"
				>
					<SubscriptionsTableHead
						selectedProductIds={selected}
						tableOrder={tableOrder}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={subscriptions?.length}
						onMenuItemClick={handleDeselect}
					/>

					<TableBody>
						{_.orderBy(subscriptions, [tableOrder.id], [tableOrder.direction] as Many<boolean | 'asc' | 'desc'>)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((n: any) => {
								console.log(n.customer)
								const isSelected = selected.indexOf(n.id) !== -1;
								return (
									<TableRow
										className="h-72 cursor-pointer"
										hover
										role="checkbox"
										aria-checked={isSelected}
										tabIndex={-1}
										key={n.id}
										selected={isSelected}
										onClick={() => handleClick(n)}
									>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
										>
											<Typography className='font-medium'>
												{n.customer.name}
											</Typography>
											<Typography className="text-gray-800/50 font-xs lowercase">
												{n.customer.email}
											</Typography>
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
										>
											<Typography className='font-medium'>
												{n.customer.cpfCnpj}
											</Typography>
										</TableCell>

										<TableCell
											className="p-4 md:p-16 truncate"
											component="th"
											scope="row"
										>
											<Typography className='text-xs'>
												{n.subscription.billingType === 'CREDIT_CARD' ?
													n.subscription.creditCard?.creditCardBrand
													: n.subscription.billingType
												}
											</Typography>
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="right"
										>
											<Typography className='text-sm'>
												{
													n.subscription?.value.toLocaleString('pt-BR', {
														style: 'currency',
														currency: 'BRL'
													})
												}
											</Typography>
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="left"
										>
											{n.products?.length > 0 ?
												n.products.map((item: any, index: any) => {
													return (
														<Typography className='text-sm' key={index}>
															{item.title}
														</Typography>
													)
												})
												:
												<Typography className='text-sm'>
													{n.subscription.description}
												</Typography>
											}

											<Typography className='text-sm  text-blue-600/50'>
												{format(new Date(n.subscription.dateCreated), 'MMM dd, y')}
											</Typography>
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="left"
										>
											<Typography className='text-sm w-288'>
												{n.customer.address}, {n.customer.addressNumber}{n.customer.complement ? `, ${n.customer.complement} ` : null}
											</Typography>
											<Typography className='text-sm'>
												{n.customer.postalCode} - {n.customer.province}, {n.customer.cityName} - {n.customer.state}
											</Typography>
										</TableCell>

										{monthNames?.map((month, index) => {
											return (
												<TableCell
													className="p-4 md:p-16"
													component="th"
													scope="row"
													align="right"
												>
													{n.subscriptions.map(subscription => {
														const [year, subMonth] = subscription.dueDate.split('-');
														if (parseInt(subMonth) === monthNames.indexOf(month) + 1) {
															return (
																<div className=' justify-center items-center'>
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
																		{FuseUtils.formatCurrency(subscription.value)}
																	</Typography>
																	{/* <Typography className='items-center py-4 font-bold text-10'>
																		{format(new Date(subscription.dueDate), 'MMM dd, y')}
																	</Typography> */}
																</div>
															)
														}
													})}
												</TableCell>
											)
										})}

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="right"
										>
											{n.subscription.status === 'ACTIVE' ? (
												<FuseSvgIcon
													className="text-green"
													size={20}
												>
													heroicons-outline:check-circle
												</FuseSvgIcon>
											) : (
												<FuseSvgIcon
													className="text-red"
													size={20}
												>
													heroicons-outline:minus-circle
												</FuseSvgIcon>
											)}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<Box sx={{ position: 'relative' }}>
				<TablePagination
					className="shrink-0 border-t-1"
					component="div"
					count={subscriptions?.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page'
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page'
					}}
					onPageChange={handleChangePage}
					onRowsPerPageChange={handleChangeRowsPerPage}
				/>
			</Box>
		</div>
	);
}

export default withRouter(SubscriptionsTable);
