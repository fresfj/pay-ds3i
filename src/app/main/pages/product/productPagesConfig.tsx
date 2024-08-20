import { Navigate } from 'react-router-dom';

import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import authRoles from '../../../auth/authRoles'
import ShopApp from '../../apps/shop/ShopApp';
import Checkout from './checkout/Checkout';
import Products from './products/Products';
import Product from './product/Product';

/**
 * The pricing pages config.
 */
const productPagesConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				shop: {
					display: true
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'product',
			element: <ShopApp />,
			children: [
				{
					path: '',
					element: <Products />
				},
				{
					path: ':productId/*',
					element: <Product />
				},
				{
					path: 'checkout',
					element: <Checkout />
				}
			]
		}
	]
};

export default productPagesConfig;
