import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useAppDispatch } from 'app/store/store';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { resetSearchText, selectSearchText, setSearchText } from '../store/searchTextSlice';
import { calculateTotalItemsSelector } from '../store/cartSlice';
import { useTranslation } from 'react-i18next';
import Stack from '@mui/material/Stack';
import { ProductFilters } from './ProductFilters';
import { initialState, resetFilters, selectFilters } from '../store/filtersSlice';
import { ProductSort } from './ProductSort';
import { ProductFiltersResult } from './ProductFiltersResult';


export const PRODUCT_GENDER_OPTIONS = [
	{ label: 'Men', value: 'Men' },
	{ label: 'Women', value: 'Women' },
	{ label: 'Kids', value: 'Kids' },
];

export const PRODUCT_CATEGORY_OPTIONS = ['Snacks', 'Apparel', 'Accessories'];

export const PRODUCT_RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

export const PRODUCT_COLOR_OPTIONS = [
	'#FF4842',
	'#1890FF',
	'#FFC0CB',
	'#00AB55',
	'#FFC107',
	'#7F00FF',
	'#000000',
	'#FFFFFF',
];

export const PRODUCT_SORT_OPTIONS = [
	{ value: 'featured', label: 'FEATURED' },
	{ value: 'newest', label: 'NEWEST' },
	{ value: 'priceDesc', label: 'PRICE_DESC' },
	{ value: 'priceAsc', label: 'PRICE_ASC' },
];

type sortProps = {
	sort: string;
	totalResults: number
	onSort: (newValue: string) => void;
};

/**
 * The products header.
 */
function ProductsHeader({ sort, onSort, totalResults }: sortProps) {
	const dispatch = useAppDispatch();
	const [openFilters, setOpenFilters] = useState(false);

	const searchText = useSelector(selectSearchText);
	const totalItems = useSelector(calculateTotalItemsSelector);
	const { t } = useTranslation('shopApp');

	const filters = useSelector(selectFilters);

	const handleOpenFilters = () => setOpenFilters(true);
	const handleCloseFilters = () => setOpenFilters(false);

	const canReset = JSON.stringify(filters) !== JSON.stringify(initialState);

	const handleSortBy = useCallback((newValue: string) => {
		onSort(newValue);
	}, []);

	useEffect(() => {
		return () => {
			dispatch(resetSearchText());
		};
	}, [totalItems]);


	return (
		<Stack
			className='mb-24'
			spacing={{ xs: 1, sm: 2 }}
		>
			<div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 flex-1 w-full justify-between pt-32 px-24 md:px-32">
				<div className="flex flex-col space-y-8 sm:space-y-0">
					<motion.span
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
					>
						<Typography className="text-24 md:text-32 font-extrabold tracking-tight">{t('SHOP')}</Typography>
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
			<Stack
				spacing={3}
				className="flex-1 w-full px-24 md:px-32"
				justifyContent="space-between"
				alignItems={{ xs: 'flex-end', sm: 'center' }}
				direction={{ xs: 'column', sm: 'row' }}
			>
				<div className="flex w-full sm:w-auto flex-1 space-x-8">
					<Paper
						component={motion.div}
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-lg border-1 shadow-0"
					>
						<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

						<Input
							placeholder={t('SEARCH_PRODUCTS')}
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
				</div>
				<Stack direction="row" spacing={1} flexShrink={0}>
					<ProductFilters
						filters={filters}
						canReset={canReset}
						open={openFilters}
						onOpen={handleOpenFilters}
						onClose={handleCloseFilters}
						options={{
							ratings: PRODUCT_RATING_OPTIONS,
							genders: PRODUCT_GENDER_OPTIONS,
							categories: ['all', ...PRODUCT_CATEGORY_OPTIONS],
						}}
					/>
					<ProductSort sort={sort} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
				</Stack>
			</Stack>
			{canReset &&
				<Stack
					spacing={3}
					className="flex-1 w-full"
				>
					<ProductFiltersResult filters={filters} totalResults={totalResults} sx={{ px: 4, mb: 40 }} />
				</Stack>
			}
		</Stack>
	);
}

export default ProductsHeader;
