import { lazy } from 'react';

const NotesApp = lazy(() => import('./NotesApp'));

/**
 * The notes app config.
 */
const NotesAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/notes',
			children: [
				{
					path: '',
					element: <NotesApp />,
					exact: true
				},
				{
					path: ':filter',
					element: <NotesApp />,
					children: [
						{
							path: ':id'
						}
					]
				}
			]
		}
	]
};

export default NotesAppConfig;
