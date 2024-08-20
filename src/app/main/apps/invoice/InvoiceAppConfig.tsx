import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Details from './details/Details';

const InvoiceApp = lazy(() => import('./InvoiceApp'));
const Subscriptions = lazy(() => import('./subscriptions/Subscriptions'));

/**
 * The Invoice app configuration.
 */
const InvoiceAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/invoice',
			element: <InvoiceApp />,
			children: [
				{
					path: '',
					element: <Navigate to="subscriptions" />
				},
				{
					path: ':subscription/:customer/*',
					element: <Details />
				},
				{
					path: 'subscriptions',
					element: <Subscriptions />
				}
			]
		}
	]
};

export default InvoiceAppConfig;
