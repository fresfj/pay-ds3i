import { lazy } from 'react';
import HelpCenterSupport from './support/HelpCenterSupport';
const HelpCenterApp = lazy(() => import('./HelpCenterApp'));


import ar from './i18n/ar';
import en from './i18n/en';
import tr from './i18n/tr';
import pt from './i18n/pt';

import i18next from 'i18next';
i18next.addResourceBundle('en', 'helpCenterApp', en);
i18next.addResourceBundle('tr', 'helpCenterApp', tr);
i18next.addResourceBundle('ar', 'helpCenterApp', ar);
i18next.addResourceBundle('pt', 'helpCenterApp', pt);

/**
 * The help center app config.
 */
const instagramAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/settings/instagram',
			element: <HelpCenterApp />,
			children: [
				{
					path: '',
					element: <HelpCenterSupport />
				}
			]
		}
	]
};

export default instagramAppConfig;
