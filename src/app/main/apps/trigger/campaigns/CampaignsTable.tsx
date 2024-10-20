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
import CouponsTableHead from './CampaignsTableHead';
import { EcommerceCoupon, selectFilteredCoupons, useGetCampaignsQuery } from '../TriggerApi';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import Box from '@mui/material/Box';
import { Iconify } from '@fuse/components/iconify';
import { styled } from '@mui/material/styles';
import moment from 'moment'
import 'moment/locale/pt-br';
moment.locale('pt-br');

type CouponsTableProps = WithRouterProps & {
	navigate: (path: string) => void;
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
	height: 10,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor: theme.palette.grey[200]
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: '#1a90ff'
	},
}));

const convertFirebaseTimestampToIso = (timestamp) => {
	const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6);
	return date.toISOString();
};

/**
 * The coupons table.
 */
function CouponsTable(props: CouponsTableProps) {
	const { navigate } = props;
	const { data, isLoading } = useGetCampaignsQuery();
	const coupons = useSelector(selectFilteredCoupons(data));
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

	moment.locale('pt-br');

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
			setSelected(coupons.map((n) => n.id));
			return;
		}

		setSelected([]);
	}

	function handleDeselect() {
		setSelected([]);
	}

	function handleClick(item: EcommerceCoupon) {
		navigate(`/apps/settings/trigger/${item.id}`);
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

	const processData = (data) => {
		// Calcular totais
		const total = data.length;
		const statusCounts = data.reduce((acc, item) => {
			acc[item.status] = (acc[item.status] || 0) + 1;
			return acc;
		}, {});

		// Calcular porcentagens
		const percentages = Object.keys(statusCounts).reduce((acc, status) => {
			acc[status] = ((statusCounts[status] / total) * 100).toFixed(2);
			return acc;
		}, {});

		return {
			total,
			statusCounts,
			percentages
		};
	}
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full">
				<FuseLoading />
			</div>
		);
	}

	if (coupons?.length === 0) {
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
					There are no trigger!
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
					<CouponsTableHead
						selectedProductIds={selected}
						tableOrder={tableOrder}
						onSelectAllClick={handleSelectAllClick}
						onRequestSort={handleRequestSort}
						rowCount={coupons?.length}
						onMenuItemClick={handleDeselect}
					/>

					<TableBody>
						{_.orderBy(coupons, [tableOrder.id], [tableOrder.direction] as Many<boolean | 'asc' | 'desc'>)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((n: any) => {
								const isSelected = selected.indexOf(n.id) !== -1;
								const results = n?.logs ? processData(n.logs) : {
									total: 0,
									statusCounts: [],
									percentages: 0
								}
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
											className="p-4 md:p-16 truncate"
											component="th"
											scope="row"
										>
											<Typography className='font-medium'>
												{n.name}
											</Typography>
											<Typography className="text-gray-800/50 font-xs lowercase">
												start: {moment(n.startDate).startOf('hour').fromNow()} -
												end: {n?.closedAt ? moment(convertFirebaseTimestampToIso(n.closedAt)).startOf('hour').fromNow() : ''}
											</Typography>
										</TableCell>
										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="right"
										>
											<div>
												<Box
													sx={{
														gap: 0.5,
														mt: 0.5,
														alignItems: 'center',
														typography: 'caption',
														display: 'inline-flex',
														color: 'text.secondary',
													}}
												>

													<Iconify icon="solar:danger-triangle-bold-duotone" className='text-red-A400' />
													Falhas {results.statusCounts[3] ? results.statusCounts[3] : '0'}
													<Iconify icon="solar:chat-dots-bold-duotone" className='text-orange-A400' />
													Pendentes {results.statusCounts[1] ? results.statusCounts[1] :
														results.statusCounts[2] ? '0' : n.contacts.length}
													<Iconify icon="solar:chat-square-check-bold-duotone" className='text-green-A400' />
													Enviados {results.statusCounts[2] ? results.statusCounts[2] : '0'}
												</Box>
												<Box sx={{ display: 'flex', alignItems: 'center' }}>
													<Box sx={{ width: '100%' }}>
														<BorderLinearProgress
															variant="determinate"
															value={results.percentages[2] ? results.percentages[2] : 0}
															color={'info'}
															sx={{
																borderRadius: 2,
																height: 12,
																bgcolor: (theme) => varAlpha(theme.palette.grey['500Channel'], 0.12),
															}}
														/>
													</Box>
												</Box>
											</div>
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="right"
										>
											<Iconify icon="solar:users-group-rounded-bold-duotone" width={22} sx={{ mr: 1 }} />
											{n.contacts.length}
										</TableCell>

										<TableCell
											className="p-4 md:p-16"
											component="th"
											scope="row"
											align="right"
										>
											<Typography
												className={clsx(
													'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
													n.status === 'PENDING' &&
													'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
													(n.status === 'COMPLETED' || n.status === 'CONFIRMED') &&
													'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50',
													(n.status === 'IN_PROGRESS' ||
														n.status === 'ACTIVE' ||
														n.status === 'RECEIVED_IN_CASH' ||
														n.status === 'AUTHORIZED') &&
													'bg-blue-50 text-blue-800 dark:bg-blue-600 dark:text-blue-50'
												)}
											>
												{n.status}
											</Typography>
										</TableCell>
										<TableCell
											className="w-60 p-4 md:p-16"
											component="th"
											scope="row"
											align="center"
										>
											<div className='flex flex-1 justify-center'>
												{n.status ? (
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
											</div>
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
				count={coupons?.length}
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

export default withRouter(CouponsTable);
