import FuseHighlight from '@fuse/core/FuseHighlight';
import Typography from '@mui/material/Typography';

/**
 * Code Splitting with slices Doc
 * This document provides information on how to use code splitting with slices.
 */
function WithSlicesCodeSplittingDoc() {
	return (
		<>
			<Typography
				variant="h4"
				className="mb-40 font-700"
			>
				Code Splitting with Slices
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
				withSlices is HOC and injects the associated RTK slice into the Redux store upon its loading. This
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
					withSlices: An HOC which injects multiple slices into the Redux store dynamically before the
					component renders.
				</li>
			</Typography>

			<Typography
				variant="h6"
				className="text-20 mt-20 mb-10 font-700"
			>
				Automatic Reducer Key Assignment:
			</Typography>
			<Typography
				component="p"
				className="mb-16"
			>
				One significant advantage of using slices created with Redux Toolkit is the automatic assignment of
				reducer keys based on the slice name. Therefore, with withSlices, there's no need to manually specify a
				key for the reducer. The key is derived directly from the slice name. For instance, if a slice is
				created as:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-typescript mb-32"
			>
				{`
					createSlice({
						name: "academyApp/courses"
					})

					`}
			</FuseHighlight>

			<Typography
				component="p"
				className="mb-16"
			>
				It's automatically stored in the Redux store under store.academyApp.courses.
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
			<li>
				{`() => import('./PathToComponent'): A dynamic import function pointing to the component you wish to lazily load.`}
			</li>

			<Typography
				component="p"
				className="mt-24 mb-16"
			>
				Injecting the reducer into the Redux store in the component file:
			</Typography>

			<FuseHighlight
				component="pre"
				className="language-typescript mb-32"
			>
				{`
				import withSlices from 'app/store/withReducer';
				import {exampleSlice} from './store/slices/exampleSlice';
				
				function ComponentName() {
					return <Outlet />;
				}
				
				export default withSlices([exampleSlice])(ComponentName);
			`}
			</FuseHighlight>

			<Typography
				component="ul"
				className="mb-16 list-disc list-inside space-y-8"
			>
				<li>
					[slice1, slice2, ...]: An array of Redux slices associated with the component that will be
					dynamically injected into the Redux store when the component is loaded.
				</li>
			</Typography>
		</>
	);
}

export default WithSlicesCodeSplittingDoc;
