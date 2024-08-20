import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useAppDispatch } from 'app/store/store';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ChangeEvent, useEffect } from 'react';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useSelector } from 'react-redux';
import { resetSearchText, selectSearchText, setSearchText } from '../store/searchTextSlice';
import { Stack, InputAdornment, TextField, MenuItem, Tooltip } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { selectFilteredSubscriptions, useGetInvoiceSubscriptionsQuery } from '../InvoiceApi';
import format from 'date-fns/format';

function transformData(data: any) {
	return data.map((entry: any, index: any) => {
		const { customer, products, subscription, subscriptions } = entry;
		return {
			customerid: customer?.id,
			name: customer?.name || '',
			cpfCnpj: customer?.cpfCnpj || '',
			email: customer?.email || '',
			phone: customer?.phone || '',
			address: customer?.address || '',
			addressNumber: customer?.addressNumber || '',
			complement: customer?.complement || '',
			province: customer?.province || '',
			cityName: customer?.cityName || '',
			state: customer?.state || '',
			country: customer?.country || '',
			postalCode: customer?.postalCode || '',
			subscriptionId: subscription?.id || '',
			dateCreated: subscription?.dateCreated || '',
			productNames: products.length > 0 ? products.map((product: any) => product.title).join(' | ') : 'No Products',
			subscriptionValues: subscriptions.length > 0 ? subscriptions.map((sub: any) => sub.value).join(' | ') : 'No value',
			subscriptionDueDates: subscriptions.length > 0 ? subscriptions.map((sub: any) => sub.dueDate).join(' | ') : 'No dueDate',
			subscriptionStatuses: subscriptions.length > 0 ? subscriptions.map((sub: any) => sub.status).join(' | ') : 'No status'
		};
	});
}
const exportToExcel = (data: any) => {
	const rawData = transformData(data);

	const worksheet = XLSX.utils.json_to_sheet(rawData);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');


	const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
	const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
	saveAs(blob, `${format(new Date(), 'dd-MM-yyyy_HHmmss')}_subscriptions.xlsx`

	);
}

/**
 * The subscriptions header.
 */
function SubscriptionsHeader() {
	const { data: subscriptions } = useGetInvoiceSubscriptionsQuery() as any;

	const dispatch = useAppDispatch();
	const searchText = useSelector(selectSearchText);

	useEffect(() => {
		return () => {
			dispatch(resetSearchText());
		};
	}, []);

	return (
		<div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 flex-1 w-full justify-between py-32 px-24 md:px-32">
			<motion.span
				initial={{ x: -20 }}
				animate={{ x: 0, transition: { delay: 0.2 } }}
			>
				<Typography className="text-24 md:text-32 font-extrabold tracking-tight">Subscriptions</Typography>
				<Typography
					variant="caption"
					className="font-medium"
				>
					total {subscriptions?.totalCount} subscribers
				</Typography>
			</motion.span>
			<div className="flex w-full sm:w-auto flex-1 items-center justify-end space-x-2">

				<Paper
					component={motion.div}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className="flex items-center w-full sm:max-w-320 space-x-8 px-16 rounded-full border-1 shadow-0"
				>
					<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

					<Input
						placeholder="Search client or invoice number..."
						className="flex flex-1"
						disableUnderline
						fullWidth
						value={searchText}
						inputProps={{
							'aria-label': 'Search'
						}}
						onChange={(ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
					/>
				</Paper>
				<Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
					<motion.div
						className="flex flex-grow-0"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
					>
						<Tooltip title="Download">
							<Button
								className="whitespace-nowrap"
								variant="contained"
								color="secondary"
								startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
								onClick={() => exportToExcel(subscriptions?.data)}
							>
								Export
							</Button>
						</Tooltip>
					</motion.div>
				</Stack>
			</div>
		</div>
	);
}

export default SubscriptionsHeader;
