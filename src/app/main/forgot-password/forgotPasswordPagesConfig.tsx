import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { FuseRouteConfigType } from '@fuse/utils/FuseUtils';
import authRoles from '../../auth/authRoles';

const SplitScreenForgotPasswordPage = lazy(() => import('./SplitScreenForgotPasswordPage'));

/**
 * Route Configuration for Forgot Password Pages.
 */
const forgotPasswordPagesConfig: FuseRouteConfigType = {
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
			path: 'forgot-password',
			element: <SplitScreenForgotPasswordPage />
		}
	]
};

export default forgotPasswordPagesConfig;
