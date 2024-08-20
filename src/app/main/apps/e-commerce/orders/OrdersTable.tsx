import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { ChangeEvent, MouseEvent, useState } from 'react';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { WithRouterProps } from '@fuse/core/withRouter/withRouter';
import { Many } from 'lodash';
import * as React from 'react';
import { useSelector } from 'react-redux';
import OrdersStatus from '../order/OrdersStatus';
import Payment from '../order/Payment';
import OrdersTableHead from './OrdersTableHead';
import { EcommerceOrder, selectFilteredOrders, useGetECommerceOrdersQuery } from '../ECommerceApi';
import FuseUtils from '@fuse/utils';
import format from 'date-fns/format';
import { Image } from '@fuse/components/image'

type OrdersTableProps = WithRouterProps & {
	navigate: (path: string) => void;
};

/**
 * The orders table.
 */
function OrdersTable(props: OrdersTableProps) {
	const { navigate } = props;

	const { data, isLoading } = useGetECommerceOrdersQuery();

	const orders = useSelector(selectFilteredOrders(data));

	const [selected, setSelected] = useState<string[]>([]);

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [tableOrder, setTableOrder] = useState<{
		direction: 'asc' | 'desc';
		id: string;
	}>({
		direction: 'desc',
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
			setSelected(orders.map((n) => n.id));
			return;
		}

		setSelected([]);
	}

	function handleDeselect() {
		setSelected([]);
	}

	function handleClick(item: EcommerceOrder) {
		navigate(`/apps/e-commerce/orders/${item.id}`);
	}

	function handleCheck(event: ChangeEvent<HTMLInputElement>, id: string) {
		const selectedIndex = selected.indexOf(id);
		let newSelected: string[] = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
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
		return <FuseLoading />;
	}

	if (orders.length === 0) {
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
					There are no orders!
				</Typography>
			</motion.div>
		);
	}

	return (
		<div className="w-full flex flex-col min-h-full">
			<FuseScrollbars className="grow overflow-x-auto">
				<Table
					stickyHeader
					className="min-w-xl"
					aria-labelledby="tableTitle"
				>
					<OrdersTableHead
						selectedOrderIds={selected}
						tableOrder={tableOrder}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={orders.length}
						onMenuItemClick={handleDeselect}
					/>

					<TableBody>
						{_.orderBy(
							orders,
							[
								(o: EcommerceOrder) => {
									switch (o.id) {
										case 'id': {
											return parseInt(o.id, 10);
										}
										case 'customer': {
											return o.customer.firstName;
										}
										case 'payment': {
											return o.payment.method;
										}
										case 'status': {
											return o.status[0].name;
										}
										default: {
											return o.date;
										}
									}
								}
							],
							[tableOrder.direction] as Many<boolean | 'asc' | 'desc'>
						)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((n) => {
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
											className="w-40 md:w-64 text-center"
											padding="none"
										>
											<Checkbox
												checked={isSelected}
												onClick={(event) => event.stopPropagation()}
												onChange={(event) => handleCheck(event, n.id)}
											/>
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
										>
											{n.id}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
										>
											{n.reference}
										</TableCell>

										<TableCell
											className="p-4 md:p-16 truncate"
											component="th"
											scope="row"
										>
											{`${n.customer.firstName}`}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="right"
										>
											{FuseUtils.formatCurrency(n.total)}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
										>
											{n.payment?.creditCard?.creditCardBrand ?
												<Image sx={{ maxHeight: 32, maxWidth: 32 }}
													src={
														FuseUtils.cardFlag(n.payment?.creditCard?.creditCardBrand)
													}
													alt='method'
												/>
												:
												<Image sx={{ maxHeight: 24, maxWidth: 24 }}
													src={
														FuseUtils.cardFlag(n.payment?.method)
													}
													alt='method'
												/>
											}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
										>
											<OrdersStatus name={n.status[0].name} />
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
										>
											{format(new Date(n.date), 'dd/MM/yyyy HH:mm:ss')}
										</TableCell>
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</FuseScrollbars>

			<TablePagination
				className="shrink-0 border-t-1"
				component="div"
				count={orders.length}
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
		</div>
	);
}

export default withRouter(OrdersTable);
