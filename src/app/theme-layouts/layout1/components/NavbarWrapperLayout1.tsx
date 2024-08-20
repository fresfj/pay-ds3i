import { ThemeProvider } from '@mui/material/styles';
import { memo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectFuseCurrentLayoutConfig, selectNavbarTheme } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import { Layout1ConfigDefaultsType } from 'app/theme-layouts/layout1/Layout1Config';
import NavbarToggleFabLayout1 from 'app/theme-layouts/layout1/components/NavbarToggleFabLayout1';
import { useLocation } from 'react-router';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { useAppDispatch } from 'app/store/store';
import {
	navbarCloseMobile,
	navbarSlice,
	selectFuseNavbar
} from 'app/theme-layouts/shared-components/navbar/store/navbarSlice';
import withSlices from 'app/store/withSlices';
import NavbarStyle1 from './navbar/style-1/NavbarStyle1';
import NavbarStyle2 from './navbar/style-2/NavbarStyle2';
import NavbarStyle3 from './navbar/style-3/NavbarStyle3';

/**
 * The navbar wrapper layout 1.
 */
function NavbarWrapperLayout1() {
	const config = useSelector(selectFuseCurrentLayoutConfig) as Layout1ConfigDefaultsType;
	const navbar = useSelector(selectFuseNavbar);
	const location = useLocation();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const { pathname } = location;
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (isMobile) {
			dispatch(navbarCloseMobile());
		}
	}, [pathname, isMobile]);

	const navbarTheme = useSelector(selectNavbarTheme);

	return (
		<>
			<ThemeProvider theme={navbarTheme}>
				<>
					{config.navbar.style === 'style-1' && <NavbarStyle1 />}
					{config.navbar.style === 'style-2' && <NavbarStyle2 />}
					{config.navbar.style === 'style-3' && <NavbarStyle3 />}
					{config.navbar.style === 'style-3-dense' && <NavbarStyle3 dense />}
				</>
			</ThemeProvider>
			{config.navbar.display && !config.toolbar.display && !navbar.open && <NavbarToggleFabLayout1 />}
		</>
	);
}

export default withSlices([navbarSlice])(memo(NavbarWrapperLayout1));
