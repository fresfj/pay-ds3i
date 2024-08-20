import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import Avatar from '@mui/material/Avatar';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { motion } from 'framer-motion';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { SyntheticEvent, useState } from 'react';
import { Iconify } from '@fuse/components/iconify';
import { useTranslation } from 'react-i18next'

type HeaderProps = {
	leftSidebarToggle?: () => void;
	rightSidebarToggle?: () => void;
	selectedTab?: any;
	setSelectedTab?: any;
};

/**
 * The Header component.
 */
function Header(props: HeaderProps) {
	const { leftSidebarToggle, rightSidebarToggle, selectedTab, setSelectedTab } = props;
	const { t } = useTranslation('accountApp');
	function handleClick() { }

	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	function handleTabChange(event: SyntheticEvent, value: number) {
		setSelectedTab(value);
	}

	return (
		<div className="flex flex-col p-24 pb-0 w-full sm:pt-32 sm:px-40">
			<div className='hidden'>
				<Breadcrumbs
					separator={<FuseSvgIcon size={20}>heroicons-solid:chevron-right</FuseSvgIcon>}
					aria-label="breadcrumb"
				>
					<Link
						className="font-medium hover:underline"
						key="1"
						color="inherit"
						to="/"
						onClick={handleClick}
					>
						{t('DASHBOARD')}
					</Link>
					<Link
						className="font-medium hover:underline"
						key="2"
						color="inherit"
						to="/apps/profile"
						onClick={handleClick}
					>
						{t('USER')}
					</Link>
					<Typography
						className="font-medium"
						key="3"
						color="text.primary"
					>
						{t('ACCOUNT')}
					</Typography>
				</Breadcrumbs>

				<div className="flex sm:hidden" />
			</div>
			<div className="flex items-center w-full mt-8 -mx-10">
				{leftSidebarToggle && (
					<div className="flex shrink-0 items-center">
						<IconButton
							onClick={leftSidebarToggle}
							aria-label="toggle sidebar"
						>
							<FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
						</IconButton>
					</div>
				)}
				<Typography
					component="h2"
					className="flex-1 text-3xl md:text-4xl font-extrabold tracking-tight leading-7 sm:leading-10 truncate mx-10"
				>
					{t('ACCOUNT')}
				</Typography>

				{rightSidebarToggle && (
					<div className="flex shrink-0 items-center">
						<IconButton
							onClick={rightSidebarToggle}
							aria-label="toggle sidebar"
						>
							<FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
						</IconButton>
					</div>
				)}
			</div>
			<div className="flex flex-1 justify-start mt-16 lg:mt-32">
				<Tabs
					value={selectedTab}
					onChange={handleTabChange}
					indicatorColor="primary"
					textColor="inherit"
					variant="scrollable"
					scrollButtons={false}
					className="-mx-4 min-h-40"
					classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
					TabIndicatorProps={{
						children: (
							<Box
								sx={{ bgcolor: 'text.disabled' }}
								className="w-full h-full rounded-full opacity-20"
							/>
						)
					}}
				>
					<Tab
						className="text-14 font-semibold min-h-40 3 mx-4 px-12 "
						disableRipple
						label={
							<div className='flex items-center gap-4 content-center'>
								<Iconify icon={'solar:user-id-line-duotone'} sx={{ width: 24, height: 24 }} />
								{t('GENERAL')}
							</div>
						}
					/>
					<Tab
						className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
						disableRipple
						label={
							<div className='flex items-center gap-4 content-center'>
								<Iconify icon={'solar:bill-list-line-duotone'} sx={{ width: 24, height: 24 }} />
								{t('BILLING')}
							</div>
						}
					/>
					{/* <Tab
						className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
						disableRipple
						label="Notifications"
					/>
					<Tab
						className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
						disableRipple
						label="Social Links"
					/> */}
					<Tab
						className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
						disableRipple
						label={<div className='flex items-center gap-4 content-center'>
							<Iconify icon={'solar:lock-keyhole-bold-duotone'} sx={{ width: 24, height: 24 }} />
							{t('SECURITY')}
						</div>
						}
					/>
				</Tabs>
			</div>
		</div>
	);
}

export default Header;
