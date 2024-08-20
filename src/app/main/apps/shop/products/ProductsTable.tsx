import FuseScrollbars from '@fuse/core/FuseScrollbars';
import _ from '@lodash';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import withRouter from '@fuse/core/withRouter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { WithRouterProps } from '@fuse/core/withRouter/withRouter';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { EcommerceProduct } from '../ShopApi';
import { ProductItem } from './ProductItem';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import { calculateTotalItemsSelector, calculateTotalSelector, itemsCartSelector } from '../store/cartSlice';
import { Iconify } from '@fuse/components/iconify';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import FuseUtils from '@fuse/utils';
import { Link } from 'react-router-dom';

import { ThemeProvider } from '@mui/material/styles';
import { selectFooterTheme } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { selectFuseNavbar } from 'app/theme-layouts/shared-components/navbar/store/navbarSlice';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import { useTranslation } from 'react-i18next';
import { CartBottom } from 'src/app/main/pages/product/components/CartBottom';

type ProductsTableProps = WithRouterProps & {
	navigate: (path: string) => void;
	products: EcommerceProduct[];
	onOpen: (newValue: boolean) => void
};

/**
 * The products table.
 */
function ProductsTable(props: ProductsTableProps) {
	const products = props.products;
	const cart = useSelector(itemsCartSelector);
	const total = useSelector(calculateTotalSelector)
	const totalItems = useSelector(calculateTotalItemsSelector);
	const navbar = useSelector(selectFuseNavbar);
	const footerTheme = useSelector(selectFooterTheme);
	const { t } = useTranslation('shopApp');

	if (products?.length === 0) {
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
					{t('NO_PRODUCT')}
				</Typography>
			</motion.div>
		);
	}

	const renderList = products.map((product) => <ProductItem key={product.id} product={product} />);

	return (
		<>
			<div className="w-full flex flex-col min-h-full space-y-12 sm:space-y-0 px-24 md:px-32">
				<FuseScrollbars className="grow overflow-x-auto">
					<Box
						gap={3}
						display="grid"
						mb={32}
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							sm: 'repeat(2, 1fr)',
							md: 'repeat(3, 1fr)',
							lg: 'repeat(4, 1fr)',
						}}
					>
						{renderList}
					</Box>
				</FuseScrollbars>

				{totalItems > 0 &&
					<CartBottom cart={cart} total={total} totalItems={totalItems} onOpen={() => props.onOpen(true)} />
				}
			</div>
		</>
	);
}

export default withRouter(ProductsTable);
