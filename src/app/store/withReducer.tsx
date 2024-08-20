import { Reducer } from '@reduxjs/toolkit';
import { rootReducer } from './store';
/**
 * A Higher Order Component that injects a reducer into the Redux store.
 */
const withReducer =
	<P extends object>(key: string, reducer: Reducer) =>
	(WrappedComponent: React.FC<P>) => {
		rootReducer.inject(
			{
				reducerPath: key,
				reducer
			},
			{
				overrideExisting: true
			}
		);

		/**
		 * The component that wraps the provided component with the injected reducer.
		 */
		return function WithInjectedReducer(props: P) {
			return <WrappedComponent {...props} />;
		};
	};
export default withReducer;
