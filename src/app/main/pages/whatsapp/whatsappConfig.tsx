import { Navigate } from 'react-router-dom';

import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import WhatsappApp from './WhatsappApp';
import Instances from './instances/Instances';

/**
 * The whatsapp pages config.
 */
const whatsappPagesConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/settings/whatsapp',
			children: [
				{
					path: '',
					element: <WhatsappApp />
				},
				{
					path: 'instances',
					element: <Instances />
				},
			]
		}
	]
};

export default whatsappPagesConfig;
