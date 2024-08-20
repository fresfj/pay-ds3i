import { lazy } from 'react';

const QuizApp = lazy(() => import('./QuizApp'));

/**
 * The file manager app config.
 */
const QuizAppConfig = {
	settings: {
		layout: {
			config: {}
		}
	},
	routes: [
		{
			path: 'apps/quiz',
			element: <QuizApp />,
			children: [
				{
					element: <QuizApp />,
					path: ':folderId'
				}
			]
		}
	]
};

export default QuizAppConfig;
