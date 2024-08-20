import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import Container from '@mui/material/Container';
import { CustomBreadcrumbs } from '@fuse/components/custom-breadcrumbs';
import { useTranslation } from 'react-i18next';
import { EcommerceProduct } from '../ShopApi';


/**
 * The product header.
 */
function ProductHeader() {
	const routeParams = useParams();
	const { productId } = routeParams;
	const { t } = useTranslation('shopApp');

	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const theme = useTheme();
	const navigate = useNavigate();

	const { name, images, featuredImageId } = watch() as EcommerceProduct;

	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
			<CustomBreadcrumbs
				links={[
					{ name: t('SHOP'), href: '/apps/shop/products' },
					{ name: name },
				]}
				sx={{ mb: 5 }}
			/>
		</div>
	);
}

export default ProductHeader;
