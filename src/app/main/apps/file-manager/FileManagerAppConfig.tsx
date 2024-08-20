import { lazy } from 'react';

const FileManagerApp = lazy(() => import('./FileManagerApp'));

/**
 * The file manager app config.
 */
const FileManagerAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/file-manager',
			element: <FileManagerApp />,
			children: [
				{
					element: <FileManagerApp />,
					path: ':folderId'
				}
			]
		}
	]
};

export default FileManagerAppConfig;
