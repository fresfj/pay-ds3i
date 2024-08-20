import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectWidget, useGetEcommerceDashboardCouponsQuery } from '../EcommerceDashboardApi'
import { isArray } from 'lodash';
import FuseLoading from '@fuse/core/FuseLoading';
/**
 * The CouponsDetailsWidget widget.
 */
function CouponsDetailsWidget() {
	const { data: coupons, isLoading } = useGetEcommerceDashboardCouponsQuery() as any

	if (!coupons) {
		return null;
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	const couponsArray = coupons?.data && Object.keys(coupons?.data).map(couponCode => ({
		couponCode,
		salesCount: coupons?.data[couponCode].salesCount,
		percentageOfTotalSales: coupons?.data[couponCode].percentageOfTotalSales
	}));

	const columns = ['Code', 'Qty', 'Sales', '% Sales']

	return (
		<Paper className="flex flex-col flex-auto p-24 shadow rounded-2xl overflow-hidden">
			<Typography className="text-lg font-medium tracking-tight leading-6 truncate">Coupon Sales</Typography>
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
						{couponsArray.map((coupon, index) => (
							<TableRow key={index}>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography className='text-indigo-700 font-semibold'>
										{coupon?.couponCode}
									</Typography>
								</TableCell>

								<TableCell
									component="th"
									scope="row"
								>
									<Typography className='font-medium'>
										{coupon?.salesCount.count}
									</Typography>
								</TableCell>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography className='font-medium'>
										{coupon?.salesCount.total.toLocaleString('pt-BR', {
											style: 'currency',
											currency: 'BRL'
										})}
									</Typography>
								</TableCell>
								<TableCell
									component="th"
									scope="row"
								>
									<Typography className='text-sm font-medium'>
										{coupon?.percentageOfTotalSales && coupon?.percentageOfTotalSales.toFixed(1) + '%'}
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

export default memo(CouponsDetailsWidget);