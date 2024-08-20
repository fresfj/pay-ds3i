import { lazy } from 'react';
import HelpCenterHome from './home/HelpCenterHome';
import HelpCenterFaqs from './faqs/HelpCenterFaqs';
import HelpCenterGuides from './guides/HelpCenterGuides';
import HelpCenterSupport from './support/HelpCenterSupport';
import GuideCategory from './guides/GuideCategory';
import GuideCategories from './guides/GuideCategories';
import HelpCenterGuide from './guide/HelpCenterGuide';

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
const HelpCenterAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/help-center',
			element: <HelpCenterApp />,
			children: [
				{
					path: '',
					element: <HelpCenterHome />
				},
				{
					path: 'faqs',
					element: <HelpCenterFaqs />
				},
				{
					path: 'guides',
					element: <HelpCenterGuides />,
					children: [
						{
							path: '',
							element: <GuideCategories />
						},
						{
							path: ':categorySlug',
							element: <GuideCategory />
						},
						{
							path: ':categorySlug/:guideSlug',
							element: <HelpCenterGuide />
						}
					]
				},
				{
					path: 'support',
					element: <HelpCenterSupport />
				}
			]
		}
	]
};

export default HelpCenterAppConfig;
