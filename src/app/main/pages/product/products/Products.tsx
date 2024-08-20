import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import ProductsHeader from './ProductsHeader';
import ProductsTable from './ProductsTable';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectFilteredProducts, useGetShopProductsQuery } from '../ShopApi';
import FuseLoading from '@fuse/core/FuseLoading';
import { setPriceRange } from '../store/filtersSlice';
import { useAppDispatch } from 'app/store/store';
import ContactsSidebarContent from './ContactsSidebarContent';
import { Helmet } from 'react-helmet-async';

/**
 * The products page.
 */
function Products() {
	const dispatch = useAppDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [sortBy, setSortBy] = useState('featured');
	const { data, isLoading } = useGetShopProductsQuery();
	const products = useSelector(selectFilteredProducts(data, sortBy));
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

	const biggerPrice = useMemo(() => {
		const prices = (data || [] as any).map(produto => parseFloat(produto.priceTaxIncl || '0') || 0);
		return prices.length ? Math.max(...prices) : 0;
	}, [data]);

	useEffect(() => {
		if (biggerPrice > 0) {
			//dispatch(setPriceRange([0, biggerPrice]));
		}
	}, [biggerPrice, dispatch]);

	const metadata = { title: `Product shop` };
	return (
		<>
			<Helmet>
				<title> {metadata.title}</title>
			</Helmet>
			<FusePageSimple
				header={<ProductsHeader totalResults={products?.length} sort={sortBy} onSort={setSortBy} />}
				content={
					isLoading ?
						<div className="flex items-center justify-center h-full w-full">
							<FuseLoading />
						</div>
						:
						<ProductsTable products={products} onOpen={setRightSidebarOpen} />
				}
				rightSidebarContent={<ContactsSidebarContent onOpen={setRightSidebarOpen} />}
				rightSidebarOpen={rightSidebarOpen}
				rightSidebarOnClose={() => setRightSidebarOpen(false)}
				rightSidebarWidth={640}
				rightSidebarVariant="temporary"
			/>
		</>
	);
}

export default Products;
