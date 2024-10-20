import { Navigate } from 'react-router-dom';

import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import InstancesApp from './InstancesApp';
import Instance from './Instance/Instance';

/**
 * The whatsapp pages config.
 */
const instancesPagesConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/settings',
			children: [
				{
					path: '',
					element: <Navigate to="/apps/settings/instances" />
				},
				{
					path: 'instances',
					element: <InstancesApp />
				},
				{
					path: 'instances/:instanceId',
					element: <Instance />
				}
			]
		}
	]
};

export default instancesPagesConfig;
