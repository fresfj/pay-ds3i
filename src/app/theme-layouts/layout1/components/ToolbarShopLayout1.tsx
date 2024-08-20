import { styled, ThemeProvider, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Hidden from '@mui/material/Hidden';
import Toolbar from '@mui/material/Toolbar';
import clsx from 'clsx';
import { memo } from 'react';
import { useSelector } from 'react-redux';
import { selectFuseCurrentLayoutConfig, selectToolbarTheme } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import { Layout1ConfigDefaultsType } from 'app/theme-layouts/layout1/Layout1Config';
import NotificationPanelToggleButton from 'src/app/main/apps/notifications/NotificationPanelToggleButton';
import NavbarToggleButton from 'app/theme-layouts/shared-components/navbar/NavbarToggleButton';
import { selectFuseNavbar } from 'app/theme-layouts/shared-components/navbar/store/navbarSlice';
import AdjustFontSize from '../../shared-components/AdjustFontSize';
import FullScreenToggle from '../../shared-components/FullScreenToggle';
import LanguageSwitcher from '../../shared-components/LanguageSwitcher';
import NavigationShortcuts from '../../shared-components/navigation/NavigationShortcuts';
import NavigationSearch from '../../shared-components/navigation/NavigationSearch';
import UserMenu from '../../shared-components/UserMenu';
import QuickPanelToggleButton from '../../shared-components/quickPanel/QuickPanelToggleButton';
import { bgBlur, varAlpha } from 'src/theme/styles';
import { layoutClasses } from '../classes';
import { useScrollOffSetTop } from '@fuse/hooks/use-scroll-offset-top';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Logo from 'app/theme-layouts/shared-components/Logo';
import { Iconify } from '@fuse/components/iconify';
import { NavBasicDesktop, NavItemBaseProps } from '@fuse/components/nav-basic';
import { RouterLink } from '@fuse/router/components/router-link';
import { Searchbar } from '@fuse/components/searchbar';

export const navData = [
	/**
	 * Overview
	 */
	{
		subheader: 'Overview',
		items: [
			{ title: 'App', path: '', icon: '' },
		],
	},
	/**
	 * Management
	 */
	{
		subheader: 'Management',
		items: [

			{
				title: 'Administración',
				path: '',
				icon: '',
				children: [
					{ title: 'Empresa', path: '' },
					{ title: 'Sucursales', path: '' },
					{ title: 'Usuarios', path: '' },
				]
			},


			{ title: 'Chat', path: '', icon: '' },
			{ title: 'Calendar', path: '', icon: '' },
			{ title: 'Kanban', path: '', icon: '' },
		],
	},

];


type ToolbarLayout1Props = {
	className?: string;
};

const data = {
	subheader: '',
	items: []
}[0];

const StyledElevation = styled('span')(({ theme }) => ({
	left: 0,
	right: 0,
	bottom: 0,
	m: 'auto',
	height: 24,
	zIndex: -1,
	opacity: 0.48,
	borderRadius: '50%',
	position: 'absolute',
	width: `calc(100% - 48px)`,
	boxShadow: theme.customShadows.z8,
}));

/**
 * The toolbar layout 1.
 */
function ToolbarLayout1(props: ToolbarLayout1Props) {
	const { className } = props;
	const config = useSelector(selectFuseCurrentLayoutConfig) as Layout1ConfigDefaultsType;
	const navbar = useSelector(selectFuseNavbar);
	const toolbarTheme = useSelector(selectToolbarTheme);

	const theme = useTheme();
	const { offsetTop } = useScrollOffSetTop();

	const toolbarStyles = {
		default: {
			minHeight: 'auto',
			height: 'var(--layout-header-mobile-height)',
			transition: theme.transitions.create(['height', 'background-color'], {
				easing: theme.transitions.easing.easeInOut,
				duration: theme.transitions.duration.shorter,
			}),
			[theme.breakpoints.up('sm')]: {
				minHeight: 'auto',
			},
			[theme.breakpoints.up('md')]: {
				height: 'var(--layout-header-desktop-height)',
			},
		},
		offset: {
			...bgBlur({ color: theme.palette.background.default }),
		},
	};



	return (
		<ThemeProvider theme={toolbarTheme}>
			<AppBar
				id="fuse-toolbar"
				className={clsx('relative z-20 flex', className, layoutClasses.header)}
				color="default"
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? toolbarTheme.palette.background.paper
							: toolbarTheme.palette.background.default,
					zIndex: 'var(--layout-header-zIndex)'
				}}
				position="sticky"

				elevation={0}
			>
				<Toolbar className="min-h-72 p-0 md:min-h-72"
					disableGutters
					sx={{
						...toolbarStyles.default,
						...(offsetTop && toolbarStyles.offset),
					}}
				>
					<Container
						sx={{
							height: 1,
							display: 'flex',
							alignItems: 'center'
						}}
						className={clsx('FusePageSimple-content container')}
					>
						<Box
							component={RouterLink}
							href={'/product'}
							aria-label="logo"
							sx={{
								flexShrink: 0,
								display: 'inline-flex',
								verticalAlign: 'middle'
							}}
						>
							<Logo data-slot="logo" />
						</Box>
						<Box sx={{ display: 'flex', flex: '1 1 auto', justifyContent: 'center' }}>
						</Box>
						<div className="flex h-full items-center gap-5 overflow-x-auto px-8">
							<Searchbar data-slot="searchbar" />
							<LanguageSwitcher />
							<UserMenu />
						</div>

					</Container>
				</Toolbar>
				{offsetTop && <StyledElevation />}
			</AppBar>
		</ThemeProvider>
	);
}

export default memo(ToolbarLayout1);

export const NAV_ITEMS = [
	{
		title: 'Home',
		path: '#',
	},
	{
		title: 'Page',
		path: '/basic/page',
		caption: 'This is the caption',
		info: <>+2</>,
		children: [
			{
				title: 'Page 1',
				path: '/basic/page/1',
				caption: 'This is the caption',
				info: '+3',
				children: [
					{ title: 'Page 1.1', path: '/basic/page/1/1' },
					{ title: 'Page 1.2', path: '/basic/page/1/2' },
				],
			},
			{
				title: 'Page 2',
				path: '/basic/page/2',
				children: [
					{ title: 'Page 2.1', path: '/basic/page/2/1' },
					{ title: 'Page 2.2', path: '/basic/page/2/2' },
					{
						title: 'Page 2.3',
						path: '/basic/page/2/3',
						children: [
							{ title: 'Page 2.3.1', path: '/basic/page/2/3/1' },
							{ title: 'Page 2.3.2', path: '/basic/page/2/3/2' },
							{ title: 'Page 2.3.3', path: '/basic/page/2/3/3' },
						],
					},
				],
			},
			{
				title: 'Page 3',
				path: '#',
			},
		],
	},
	{
		title: 'Blog',
		path: '#'
	},
	{
		title: 'Contact',
		path: '#',
		disabled: true,
	},
	{
		title: 'External',
		path: 'https://www.google.com/',
	},
];