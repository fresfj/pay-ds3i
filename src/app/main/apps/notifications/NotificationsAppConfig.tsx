import { lazy } from 'react';

const NotificationsApp = lazy(() => import('./NotificationsApp'));

/**
 * The Notifications app config.
 */
const NotificationsAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/notifications',
			children: [
				{
					path: '',
					element: <NotificationsApp />,
					exact: true
				}
			]
		}
	]
};

export default NotificationsAppConfig;
