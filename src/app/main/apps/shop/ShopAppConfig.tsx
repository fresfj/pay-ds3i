import { Navigate } from 'react-router-dom';
import { lazy } from 'react';

import i18next from 'i18next';
import pt from './i18n/pt';
import en from './i18n/en';
import tr from './i18n/tr';

const Checkout = lazy(() => import('./checkout/Checkout'));
const ShopApp = lazy(() => import('./ShopApp'));
const Product = lazy(() => import('./product/Product'));
const Products = lazy(() => import('./products/Products'));

i18next.addResourceBundle('en', 'shopApp', en);
i18next.addResourceBundle('tr', 'shopApp', tr);
i18next.addResourceBundle('pt', 'shopApp', pt);

/**
 * The shop app config.
 */
const ShopAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/shop',
			element: <ShopApp />,
			children: [
				{
					path: '',
					element: <Navigate to="products" />
				},
				{
					path: 'checkout',
					element: <Checkout />
				},
				{
					path: 'products',
					element: <Products />
				},
				{
					path: 'products/:productId/*',
					element: <Product />
				},
			]
		}
	]
};

export default ShopAppConfig;
