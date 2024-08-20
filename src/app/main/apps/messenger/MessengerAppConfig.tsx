import { lazy } from 'react';
import Chat from './chat/Chat';
import MessengerFirstScreen from './MessengerFirstScreen';

const MessengerApp = lazy(() => import('./MessengerApp'));

/**
 * The chat app config.
 */
const MessengerAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/messenger',
			element: <MessengerApp />,
			children: [
				{
					path: '',
					element: <MessengerFirstScreen />
				},
				{
					path: ':id',
					element: <Chat />
				}
			]
		}
	]
};

export default MessengerAppConfig;
