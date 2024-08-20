import { useEffect, useState } from 'react';
import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import FuseLoading from '@fuse/core/FuseLoading';
import CryptoDashboardAppHeader from './CryptoDashboardAppHeader';
import CryptoDashboardAppSidebar from './CryptoDashboardAppSidebar';
import CryptoDashboardAppContent from './CryptoDashboardAppContent';
import { useGetCryptoDashboardWidgetsQuery } from './CryptoDashboardApi';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider
	},
	'& .FusePageSimple-toolbar': {},
	'& .FusePageSimple-content': {},
	'& .FusePageSimple-sidebarHeader': {},
	'& .FusePageSimple-sidebarContent': {
		backgroundColor: theme.palette.background.default
	}
}));

/**
 * The CryptoDashboardApp page.
 */
function CryptoDashboardApp() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [leftSidebarOpen, setLeftSidebarOpen] = useState(!isMobile);

	const { data: widgets, isLoading } = useGetCryptoDashboardWidgetsQuery();

	useEffect(() => {
		setLeftSidebarOpen(!isMobile);
	}, [isMobile]);

	if (!widgets) {
		return null;
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<Root
			header={<CryptoDashboardAppHeader onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)} />}
			leftSidebarContent={<CryptoDashboardAppSidebar />}
			leftSidebarOpen={leftSidebarOpen}
			leftSidebarOnClose={() => setLeftSidebarOpen(false)}
			leftSidebarWidth={320}
			content={<CryptoDashboardAppContent />}
		/>
	);
}

export default CryptoDashboardApp;
