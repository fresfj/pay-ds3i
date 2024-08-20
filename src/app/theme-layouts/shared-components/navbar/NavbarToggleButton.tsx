import IconButton from '@mui/material/IconButton';
import { useAppDispatch } from 'app/store/store';
import { selectFuseCurrentSettings, setDefaultSettings } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import _ from '@lodash';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { useSelector } from 'react-redux';
import { navbarToggle, navbarToggleMobile } from './store/navbarSlice';
import { Iconify } from '@fuse/components/iconify';

type NavbarToggleButtonProps = {
	className?: string;
	children?: React.ReactNode;
};

// <FuseSvgIcon
// 	size={20}
// 	color="action"
// >
// 	solar:hamburger-menu-linear
// </FuseSvgIcon>
/**
 * The navbar toggle button.
 */
function NavbarToggleButton(props: NavbarToggleButtonProps) {
	const {
		className = '',
		children = (
			<Iconify icon={'solar:hamburger-menu-linear'}
				width={20}
				color="action"
			/>
		)
	} = props;

	const dispatch = useAppDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const settings: FuseSettingsConfigType = useSelector(selectFuseCurrentSettings);
	const { config } = settings.layout;

	return (
		<IconButton
			className={className}
			color="inherit"
			size="small"
			onClick={() => {
				if (isMobile) {
					dispatch(navbarToggleMobile());
				} else if (config?.navbar?.style === 'style-2') {
					dispatch(
						setDefaultSettings(
							_.set({}, 'layout.config.navbar.folded', !settings?.layout?.config?.navbar?.folded)
						)
					);
				} else {
					dispatch(navbarToggle());
				}
			}}
		>
			{children}
		</IconButton>
	);
}

export default NavbarToggleButton;
