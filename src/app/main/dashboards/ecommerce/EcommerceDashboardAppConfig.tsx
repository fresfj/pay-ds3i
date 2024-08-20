import { lazy } from 'react';

const EcommerceDashboardApp = lazy(() => import('./EcommerceDashboardApp'));
/**
 * The analytics dashboard app config.
 */
const EcommerceDashboardAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'dashboards/e-commerce',
			element: <EcommerceDashboardApp />
		}
	]
};

export default EcommerceDashboardAppConfig;
