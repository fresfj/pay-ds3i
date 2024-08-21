import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ProductHeader from './ProductHeader';
import { Helmet } from 'react-helmet-async';
import ProductModel from './models/ProductModel';
import { useGetECommerceProductQuery } from '../../checkout/CheckoutApi';
import { ProductDetailsView } from './ProductDetailsView';
import ContactsSidebarContent from '../products/ContactsSidebarContent';
import { ProductDetailsSkeleton } from '../components/ProductItemSkeleton';
import Container from '@mui/material/Container';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().nonempty('You must enter a product name').min(5, 'The product name must be at least 5 characters')
});

/**
 * The product page.
 */
function Product() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const routeParams = useParams();

	const { productId } = routeParams;

	const {
		data: product,
		isLoading,
		isError
	} = useGetECommerceProductQuery(productId, {
		skip: !productId || productId === 'new'
	});

	const [tabValue, setTabValue] = useState(0);

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	useEffect(() => {
		if (productId === 'new') {
			reset(ProductModel({}));
		}
	}, [productId, reset]);

	useEffect(() => {
		if (product) {
			reset({ ...product });
		}
	}, [product, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
	}

	if (isLoading) {
		return (
			<Container sx={{ mt: 5, mb: 10 }}>
				<ProductDetailsSkeleton />
			</Container>
		);
	}

	/**
	 * Show Message if the requested products is not exists
	 */
	if (isError && productId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such product!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/products"
					color="inherit"
				>
					Go to Products Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while product data is loading and form is setted
	 */
	if (_.isEmpty(form) || (product && routeParams.productId !== product.id && routeParams.productId !== 'new')) {
		return <FuseLoading />;
	}

	const metadata = { title: product.name };
	return (
		<FormProvider {...methods}>
			<Helmet>
				<title> {metadata.title}</title>
			</Helmet>
			<FusePageSimple
				header={<ProductHeader />}
				content={<ProductDetailsView product={product} loading={isLoading} onOpen={setRightSidebarOpen} />}
				rightSidebarContent={<ContactsSidebarContent onOpen={setRightSidebarOpen} />}
				rightSidebarOpen={rightSidebarOpen}
				rightSidebarOnClose={() => setRightSidebarOpen(false)}
				rightSidebarWidth={640}
				rightSidebarVariant="temporary"
			/>
		</FormProvider>
	);
}

export default Product;
