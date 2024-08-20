import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useAppDispatch } from 'app/store/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { resetSearchText } from '../store/searchTextSlice';
import { calculateTotalItemsSelector } from '../store/cartSlice';
import { useTranslation } from 'react-i18next';

/**
 * The products header.
 */
function ProductsHeader() {
	const dispatch = useAppDispatch();
	const totalItems = useSelector(calculateTotalItemsSelector);
	const { t } = useTranslation('shopApp');

	useEffect(() => {
		return () => {
			dispatch(resetSearchText());
		};
	}, [totalItems]);

	return (
		<div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 flex-1 w-full justify-between py-32 px-24 md:px-32">
			<div className="flex flex-col space-y-8 sm:space-y-0">
				<motion.span
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
				>
					<Typography className="text-24 md:text-32 font-extrabold tracking-tight">{t('CHECKOUT')}</Typography>
				</motion.span>
				{totalItems > 0 && (
					<motion.span
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					>
						<Typography
							className="text-14 font-medium mx-2"
							color="text.secondary"
						>
							{t('PRODUCTS_IN_CART', { total: totalItems })}
						</Typography>
					</motion.span>
				)}
			</div>
		</div>
	);
}

export default ProductsHeader;
