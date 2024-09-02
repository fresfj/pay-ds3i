import { Navigate } from 'react-router-dom';

import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import WhatsappApp from './WhatsappApp';

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
				}
			]
		}
	]
};

export default whatsappPagesConfig;
