import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { SyntheticEvent, useState } from 'react';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';


import Header from '../components/Header';
import Content from '../components/Content';

const Root = styled(FusePageSimple)({
	'& .FusePageCarded-header': {},
	'& .FusePageCarded-toolbar': {},
	'& .FusePageCarded-content': {},
	'& .FusePageCarded-sidebarHeader': {},
	'& .FusePageCarded-sidebarContent': {}
});
/**
 * The account page.
 */
function UserApp() {
	const [selectedTab, setSelectedTab] = useState(0);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	function handleTabChange(event: SyntheticEvent, value: number) {
		setSelectedTab(value);
	}

	return (
		<Root
			header={<Header selectedTab={selectedTab} setSelectedTab={setSelectedTab} />}
			content={<Content selectedTab={selectedTab} />}
			scroll={isMobile ? 'normal' : 'page'}
		/>
	);
}

export default UserApp;
