import { Navigate } from 'react-router-dom';
import authRoles from '../../../auth/authRoles'
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import ModernPlansPage from './modern/ModernPlansPage';

/**
 * The plans pages config.
 */
const plansPagesConfig: FuseRouteConfigType = {
	settings: {
		layout: {
			config: {
				navbar: {
					display: false
				},
				toolbar: {
					display: false
				},
				shop: {
					display: true
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
			path: 'plans',
			children: [
				{
					path: '',
					element: <ModernPlansPage />
				}
			]
		}
	]
};

export default plansPagesConfig;
