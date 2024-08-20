import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const ECommerceApp = lazy(() => import('./ECommerceApp'));
const Product = lazy(() => import('./product/Product'));
const Products = lazy(() => import('./products/Products'));
const Coupon = lazy(() => import('./coupon/Coupon'));
const Coupons = lazy(() => import('./coupons/Coupons'));
const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));

/**
 * The E-Commerce app configuration.
 */
const ECommerceAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/e-commerce',
			element: <ECommerceApp />,
			children: [
				{
					path: '',
					element: <Navigate to="products" />
				},
				{
					path: 'products',
					element: <Products />
				},
				{
					path: 'products/:productId/*',
					element: <Product />
				},
				{
					path: 'orders',
					element: <Orders />
				},
				{
					path: 'orders/:orderId',
					element: <Order />
				},
				{
					path: 'coupons',
					element: <Coupons />
				},
				{
					path: 'coupons/:couponId/*',
					element: <Coupon />
				}
			]
		}
	]
};

export default ECommerceAppConfig;
