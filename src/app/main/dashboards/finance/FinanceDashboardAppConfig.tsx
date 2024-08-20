import { lazy } from 'react';

const FinanceDashboardApp = lazy(() => import('./FinanceDashboardApp'));

/**
 * The finance dashboard app config.
 */
const FinanceDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'dashboards/finance',
			element: <FinanceDashboardApp />
		}
	]
};

export default FinanceDashboardAppConfig;
