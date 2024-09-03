import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import IndicationPage from './IndicationPage';
import authRoles from '../../auth/authRoles';

const IndicationConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				footer: {
					display: false
				},
				leftSidePanel: {
					display: false
				},
				rightSidePanel: {
					display: false
				}
			}
		}
	},
	auth: authRoles.onlyGuest,
	routes: [
		{
			path: 'indication',
			element: <IndicationPage />
		}
	]
};

export default IndicationConfig;
