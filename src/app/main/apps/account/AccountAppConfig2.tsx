import { lazy } from 'react';
import i18next from 'i18next';
import { Navigate } from 'react-router-dom';

import pt from './i18n/pt';
import en from './i18n/en';
import tr from './i18n/tr';
import AccountApp from './AccountApp';
import WhatsappApp from '../../pages/whatsapp/WhatsappApp';
import WhatsGroupApp from '../../pages/whatsapp/WhatsGroupApp';

const Order = lazy(() => import('./order/Order'));
const Orders = lazy(() => import('./orders/Orders'));
const UserApp = lazy(() => import('./user/UserApp'));
const Referral = lazy(() => import('./referral/Referral'));

i18next.addResourceBundle('en', 'accountApp', en);
i18next.addResourceBundle('tr', 'accountApp', tr);
i18next.addResourceBundle('pt', 'accountApp', pt);
/**
 * The Account app config.
 */
const AccountAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/account',
			element: <AccountApp />,
			children: [
				{
					path: '',
					element: <Navigate to="settings" />
				},
				{
					path: 'settings',
					element: <UserApp />
				},
				{
					path: 'orders',
					element: <Orders />
				},
				{
					path: 'orders/:orderId',
					element: <Order />
				}
				,
				{
					path: 'referral',
					element: <Referral />
				},
				{
					path: 'referral/whatsapp',
					element: <WhatsappApp />
				},
				{
					path: 'referral/whatsapp/groups',
					element: <WhatsGroupApp />
				}
			]
		}
	]
};

export default AccountAppConfig;
