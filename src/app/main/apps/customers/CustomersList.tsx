import { motion } from 'framer-motion';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import { useSelector } from 'react-redux';
import FuseLoading from '@fuse/core/FuseLoading';
import CustomerListItem from './CustomerListItem';
import {
	Customer,
	GroupedCustomers,
	selectFilteredCustomerList,
	selectGroupedFilteredCustomers,
	useGetCustomersListQuery
} from './CustomersApi';

/**
 * The customers list.
 */
function CustomersList() {
	const { data, isLoading } = useGetCustomersListQuery();
	const filteredData = useSelector(selectFilteredCustomerList(data));
	const groupedFilteredCustomers = useSelector(selectGroupedFilteredCustomers(filteredData));

	if (isLoading) {
		return <FuseLoading />;
	}

	if (filteredData.length === 0) {
		return (
			<div className="flex flex-1 items-center justify-center h-full">
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There are no customers!
				</Typography>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ y: 20, opacity: 0 }}
			animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
			className="flex flex-col flex-auto w-full max-h-full"
		>
			{Object.entries(groupedFilteredCustomers).map(([key, group]: [string, GroupedCustomers]) => {
				return (
					<div
						key={key}
						className="relative"
					>
						<List className="w-full m-0 p-0"
							sx={{
								'& .MuiListSubheader-root':
								{
									borderWidth: 0,
									borderStyle: 'solid',
									borderColor: '#e2e8f0',
									borderBottomWidth: 'thin',
									background: '#f1f5f9',
									zIndex: 10
								},
							}}
						>
							<ListSubheader className="px-32 py-4 text-14 font-medium bg-slate-200" color="primary">{key}</ListSubheader>
							{group?.children?.map((item: Customer) => (
								<CustomerListItem
									key={item.id}
									customer={item}
								/>
							))}
						</List>
					</div>
				);
			})}
		</motion.div>
	);
}

export default CustomersList;
