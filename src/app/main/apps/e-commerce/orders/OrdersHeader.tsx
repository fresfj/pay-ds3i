import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useAppDispatch } from 'app/store/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { resetSearchText, selectSearchText, setSearchText } from '../store/searchTextSlice';

/**
 * The orders header.
 */
function OrdersHeader() {
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
				<Typography className="flex text-24 md:text-32 font-extrabold tracking-tight">Orders</Typography>
			</motion.span>

			<div className="flex w-full sm:w-auto flex-1 items-center justify-end space-x-8">
				<Paper
					component={motion.div}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
				>
					<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

					<Input
						placeholder="Search orders"
						className="flex flex-1"
						disableUnderline
						fullWidth
						value={searchText}
						inputProps={{
							'aria-label': 'Search Orders'
						}}
						onChange={(ev: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
					/>
				</Paper>
			</div>
		</div>
	);
}

export default OrdersHeader;
