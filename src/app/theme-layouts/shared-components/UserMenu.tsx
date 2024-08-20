import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import { darken } from '@mui/material/styles';
import { AnimateAvatar, varHover } from '@fuse/components/animate';
import { useTheme } from '@mui/material/styles';
import { m } from 'framer-motion';
import NoSsr from '@mui/material/NoSsr';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { useTranslation } from 'react-i18next';

/**
 * The user menu.
 */
function UserMenu() {
	const theme = useTheme();
	const user = useSelector(selectUser);
	const { signOut } = useAuth();
	const [userMenu, setUserMenu] = useState<HTMLElement | null>(null);
	const { t } = useTranslation('navigation');
	const userMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setUserMenu(event.currentTarget);
	};

	const userMenuClose = () => {
		setUserMenu(null);
	};

	if (!user) {
		return null;
	}

	const renderFallback = (
		<Avatar
			sx={{
				width: 46,
				height: 46,
				border: `solid 2px ${theme.palette.background.default}`,
			}}
		>
			<SvgIcon>
				<circle cx="12" cy="6" r="4" fill="currentColor" />
				<path
					fill="currentColor"
					d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5"
					opacity="0.5"
				/>
			</SvgIcon>
		</Avatar>
	);

	return (
		<>
			<IconButton
				onClick={userMenuClick}
				component={m.button}
				whileTap="tap"
				whileHover="hover"
				variants={varHover(1.05)}
				sx={{ p: 0 }}
			>
				{/* <div className="mx-4 hidden flex-col items-end md:flex">
					<Typography
						component="span"
						className="flex font-semibold"
					>
						{user.data.displayName}
					</Typography>
					<Typography
						className="text-11 font-medium capitalize"
						color="text.secondary"
					>
						{user.role?.toString()}
						{(!user.role || (Array.isArray(user.role) && user.role.length === 0)) && 'Guest'}
					</Typography>
				</div> */}
				<NoSsr fallback={renderFallback}>
					{user.data.photoURL ? (
						<AnimateAvatar
							sx={{ width: 46, height: 46 }}
							slotProps={{
								avatar: { src: user.data.photoURL, alt: user.data.displayName },
								overlay: {
									border: 1,
									spacing: 2,
									color: `conic-gradient(${theme.palette.primary.main}, ${theme.palette.warning.main}, ${theme.palette.primary.main})`,
								},
							}}
						/>
					) : (
						<AnimateAvatar
							sx={{
								background: (theme) => darken(theme.palette.background.default, 0.05),
								color: (theme) => theme.palette.text.secondary
							}}
							className="md:mx-4"
						>
							{user?.data?.displayName.charAt(0).toUpperCase()}
						</AnimateAvatar>
					)}
				</NoSsr>
			</IconButton>
			<Popover
				open={Boolean(userMenu)}
				anchorEl={userMenu}
				onClose={userMenuClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center'
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'center'
				}}
				classes={{
					paper: 'py-8'
				}}
			>
				{!user.role || user.role.length === 0 ? (
					<>
						<MenuItem
							component={Link}
							to="/sign-in"
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:lock-closed</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary={t('SIGN_IN')} />
						</MenuItem>
						<MenuItem
							component={Link}
							to="/sign-up"
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:user-add </FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary={t('SIGN_UP')} />
						</MenuItem>
					</>
				) : (
					<>
						<MenuItem
							component={Link}
							to="/apps/account"
							onClick={userMenuClose}
							role="button"
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary={t('MY_ACCOUNT')} />
						</MenuItem>
						<MenuItem
							onClick={() => {
								signOut();
							}}
						>
							<ListItemIcon className="min-w-40">
								<FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
							</ListItemIcon>
							<ListItemText primary={t('SIGN_OUT')} />
						</MenuItem>
					</>
				)}
			</Popover>
		</>
	);
}

export default UserMenu;
