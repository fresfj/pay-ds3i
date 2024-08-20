import { lazy } from 'react';
import authRoles from '../../../auth/authRoles'


const CheckoutApp = lazy(() => import('./CheckoutApp'));
const ThanksApp = lazy(() => import('./thanks/SuccessPage'))
const CheckoutPage = lazy(() => import('./cart/CheckoutAppPage'));
/**
 * The checkout app config.
 */

const CheckoutAppConfig = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
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
			path: 'checkout',
			element: <CheckoutApp />,
			children: [
				{
					path: ':id',
					element: <CheckoutPage />
				}
			]
		},
		{
			path: 'thanks',
			element: <CheckoutApp />,
			children: [
				{
					path: ':id',
					element: <ThanksApp />
				}
			]
		}
	]
};

export default CheckoutAppConfig;
