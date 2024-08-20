import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Tooltip from '@mui/material/Tooltip';
import { MouseEvent, useState } from 'react';
import Box from '@mui/material/Box';
import TableHead from '@mui/material/TableHead';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import { useDeleteInvoiceSubscriptionsMutation } from '../InvoiceApi';

/**
 * The table head row type.
 */
type rowType = {
	id: string;
	align: 'left' | 'center' | 'right';
	disablePadding: boolean;
	label: string;
	sort: boolean;
};

/**
 * The table head rows data.
 */
const rows: rowType[] = [
	{
		id: 'name',
		align: 'left',
		disablePadding: false,
		label: 'Name',
		sort: true
	},
	{
		id: 'cpfCnpj',
		align: 'left',
		disablePadding: false,
		label: 'CPF/CNPJ',
		sort: true
	},
	{
		id: 'billingType',
		align: 'left',
		disablePadding: false,
		label: 'Billing Type',
		sort: true
	},
	{
		id: 'value',
		align: 'right',
		disablePadding: false,
		label: 'Value',
		sort: true
	},
	{
		id: 'product',
		align: 'left',
		disablePadding: false,
		label: 'Product',
		sort: true
	},
	{
		id: 'address',
		align: 'left',
		disablePadding: false,
		label: 'Address',
		sort: true
	},
	{
		id: '1',
		align: 'left',
		disablePadding: false,
		label: 'Jan',
		sort: true
	},
	{
		id: '2',
		align: 'left',
		disablePadding: false,
		label: 'Feb',
		sort: true
	},
	{
		id: '3',
		align: 'left',
		disablePadding: false,
		label: 'Mar',
		sort: true
	},
	{
		id: '4',
		align: 'left',
		disablePadding: false,
		label: 'Apr',
		sort: true
	},
	{
		id: '5',
		align: 'left',
		disablePadding: false,
		label: 'May',
		sort: true
	},
	{
		id: '6',
		align: 'left',
		disablePadding: false,
		label: 'Jun',
		sort: true
	},
	{
		id: '7',
		align: 'left',
		disablePadding: false,
		label: 'Jul',
		sort: true
	},
	{
		id: '8',
		align: 'left',
		disablePadding: false,
		label: 'Aug',
		sort: true
	},
	{
		id: '9',
		align: 'left',
		disablePadding: false,
		label: 'Sep',
		sort: true
	},
	{
		id: '10',
		align: 'left',
		disablePadding: false,
		label: 'Oct',
		sort: true
	},
	{
		id: '11',
		align: 'left',
		disablePadding: false,
		label: 'Nov',
		sort: true
	},
	{
		id: '12',
		align: 'left',
		disablePadding: false,
		label: 'Dec',
		sort: true
	},
	{
		id: 'active',
		align: 'right',
		disablePadding: false,
		label: 'Active',
		sort: true
	}
];

type SubscriptionsTableHeadPropsType = {
	selectedProductIds: string[];
	onRequestSort: (event: MouseEvent<HTMLSpanElement>, property: string) => void;
	onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
	tableOrder: {
		direction: 'asc' | 'desc';
		id: string;
	};
	rowCount: number;
	onMenuItemClick: () => void;
	data?: any;
};

/**
 * The subscriptions table head component.
 */
function SubscriptionsTableHead(props: SubscriptionsTableHeadPropsType) {
	const { selectedProductIds, tableOrder, onSelectAllClick, onRequestSort, rowCount, onMenuItemClick } = props;

	const [removeSubscriptions] = useDeleteInvoiceSubscriptionsMutation();

	const numSelected = selectedProductIds.length;

	const [selectedSubscriptionsMenu, setSelectedSubscriptionsMenu] = useState<HTMLButtonElement | null>(null);

	const createSortHandler = (event: MouseEvent<HTMLSpanElement>, property: string) => {
		onRequestSort(event, property);
	};

	function openSelectedSubscriptionsMenu(event: MouseEvent<HTMLButtonElement>) {
		setSelectedSubscriptionsMenu(event.currentTarget);
	}

	function closeSelectedSubscriptionsMenu() {
		setSelectedSubscriptionsMenu(null);
	}

	return (
		<TableHead>
			<TableRow className="h-48 sm:h-64">
				{rows.map((row) => {
					return (
						<TableCell
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
							className="p-4 min-w-144 md:p-16"
							key={row.id}
							align={row.align}
							padding={row.disablePadding ? 'none' : 'normal'}
							sortDirection={tableOrder.id === row.id ? tableOrder.direction : false}
						>
							{row.sort && (
								<Tooltip
									title="Sort"
									placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={tableOrder.id === row.id}
										direction={tableOrder.direction}
										onClick={(ev: MouseEvent<HTMLSpanElement>) => createSortHandler(ev, row.id)}
										className="font-semibold"
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)}
						</TableCell>
					);
				})}
			</TableRow>
		</TableHead>
	);
}

export default SubscriptionsTableHead;
