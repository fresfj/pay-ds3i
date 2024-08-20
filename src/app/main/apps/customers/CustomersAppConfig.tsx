import { lazy } from 'react';
import CustomerView from './customer/CustomerView';
import CustomerForm from './customer/CustomerForm';

const CustomersApp = lazy(() => import('./CustomersApp'));

/**
 * The CustomersApp configuration.
 */
const CustomersAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/customers',
			element: <CustomersApp />,
			children: [
				{
					path: ':id',
					element: <CustomerView />
				},
				{
					path: ':id/edit',
					element: <CustomerForm />
				}
			]
		}
	]
};

export default CustomersAppConfig;
