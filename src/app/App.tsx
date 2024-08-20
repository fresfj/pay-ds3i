import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache, { Options } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import MockAdapterProvider from '@mock-api/MockAdapterProvider';
import withAppProviders from './withAppProviders';
import { AuthRouteProvider } from './auth/AuthRouteProvider';
import TagManager from 'react-gtm-module'
import Meta from 'src/meta';
import { Helmet, HelmetProvider } from 'react-helmet-async';
// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
const GOOGLE_TAG = import.meta.env.VITE_GOOGLE_TAG
const emotionCacheOptions = {
	rtl: {
		key: 'muirtl',
		stylisPlugins: [rtlPlugin],
		insertionPoint: document.getElementById('emotion-insertion-point')
	},
	ltr: {
		key: 'muiltr',
		stylisPlugins: [],
		insertionPoint: document.getElementById('emotion-insertion-point')
	}
};

const helmetContext = {};

/**
 * The main App component.
 */
function App() {
	/**
	 * The language direction from the Redux store.
	 */
	const langDirection = useSelector(selectCurrentLanguageDirection);

	/**
	 * The main theme from the Redux store.
	 */
	const mainTheme = useSelector(selectMainTheme);

	const tagManagerArgs = { gtmId: GOOGLE_TAG, dataLayerName: 'PageDataLayer' }
	TagManager.initialize(tagManagerArgs)

	return (
		<HelmetProvider context={helmetContext}>
			<MockAdapterProvider>
				<CacheProvider value={createCache(emotionCacheOptions[langDirection] as Options)}>
					<Meta />
					<FuseTheme
						theme={mainTheme}
						direction={langDirection}
					>
						<AuthRouteProvider>
							<SnackbarProvider
								maxSnack={5}
								anchorOrigin={{
									vertical: 'bottom',
									horizontal: 'right'
								}}
								classes={{
									containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99'
								}}
							>

								<FuseLayout layouts={themeLayouts} />
							</SnackbarProvider>
						</AuthRouteProvider>
					</FuseTheme>
				</CacheProvider>
			</MockAdapterProvider>
		</HelmetProvider>
	);
}

export default withAppProviders(App);
