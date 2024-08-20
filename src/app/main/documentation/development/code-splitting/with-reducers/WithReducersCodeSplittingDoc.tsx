import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';

/**
 * Code Splitting with reducers Doc
 * This document provides information on how to use code splitting with reducers.
 */
function WithReducersCodeSplittingDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-40 font-700"
			>
				Code Splitting with Reducers (default)
			</Typography>
			<Typography
				variant="h5"
				className="text-20 mt-20 mb-10 font-700"
			>
				Using `lazy` in configuration pages with route definitions
			</Typography>
			<Typography
				className="mb-16"
				component="p"
			>
				React.lazy is a function in React that enables you to perform code-splitting in your React application.
				withReducer is HOC and injects the associated Redux reducer into the Redux store upon its loading. This
				utility is especially beneficial in large applications, where code-splitting and dynamic reducer
				injection can significantly optimize the application's performance by loading only the necessary parts
				when they are required.
			</Typography>

			<Typography
				variant="h6"
				className="text-20 mt-20 mb-10 font-700"
			>
				How it works:
			</Typography>

			<Typography
				component="ul"
				className="mb-16 list-disc list-inside space-y-8"
			>
				<li>
					lazy: From React, it allows us to dynamically load components. This results in the component being
					split from the main bundle and being loaded only when it's required.
				</li>
				<li>
					withReducer: An HOC we've defined that appends a Redux reducer to the store dynamically before the
					component renders.
				</li>
			</Typography>

			<Typography
				variant="h6"
				className="text-20 mt-20 mb-10 font-700"
			>
				Usage:
			</Typography>

			<Typography
				component="p"
				className="mb-16"
			>
				Configuring lazy loading in the route configuration file:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-typescript mb-32"
			>
				{`
					import { lazy } from 'react';
					
					const ComponentName = lazy(() => import('./PathToComponent'));
					
					const SampleAppConfig = {
						routes: [
							  {
								path: 'apps/sample',
								element: <ComponentName />
							  }
						  ]
				`}
			</FuseHighlight>

			<Typography
				component="p"
				className="mb-16"
			>
				Injecting the reducer into the Redux store in the component file:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-typescript mb-32"
			>
				{`
				import withReducer from 'app/store/withReducer';
				import reducerInstance from './store';

				function ComponentName() {
					return <Outlet />;
				}
				
				export default withReducer("keyForReducer", reducerInstance)(ComponentName);
			`}
			</FuseHighlight>

			<Typography
				component="ul"
				className="mb-16 list-disc list-inside space-y-8"
			>
				<li>keyForReducer: A string which acts as a unique key for the reducer in the Redux store.</li>

				<li>
					reducerInstance: This is the reducer associated with the component which will be dynamically
					injected into the Redux store.
				</li>
			</Typography>
		</>
	);
}

export default WithReducersCodeSplittingDoc;
