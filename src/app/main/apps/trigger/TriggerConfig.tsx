import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const TriggerApp = lazy(() => import('./TriggerApp'));
const Campaign = lazy(() => import('./campaign/Campaign'));
const Campaigns = lazy(() => import('./campaigns/Campaigns'));

const Contact = lazy(() => import('./contact/Contact'));
const Contacts = lazy(() => import('./contacts/Contacts'));

/**
 * The Trigger app configuration.
 */
const TriggerAppConfig = {
	settings: {
		layout: {}
	},
	routes: [
		{
			path: 'apps/settings',
			element: <TriggerApp />,
			children: [
				{
					path: 'trigger',
					element: <Campaigns />
				},
				{
					path: 'trigger/:triggerId',
					element: <Campaign />
				},
				{
					path: 'contacts',
					element: <Contacts />
				},
				{
					path: 'contacts/:contactId',
					element: <Contact />
				}
			]
		}
	]
};

export default TriggerAppConfig;
