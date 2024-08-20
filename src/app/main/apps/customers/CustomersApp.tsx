import FusePageSimple from '@fuse/core/FusePageSimple';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import withReducer from 'app/store/withReducer';
import CustomersHeader from './CustomersHeader';
import CustomersList from './CustomersList';
import { useGetCustomersListQuery, useGetCustomersCountriesQuery, useGetCustomersTagsQuery } from './CustomersApi';
import CustomersSidebarContent from './CustomersSidebarContent';
import reducer from './store';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper
	}
}));

/**
 * The CustomersApp page.
 */
function CustomersApp() {
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	useGetCustomersListQuery();
	useGetCustomersCountriesQuery();
	useGetCustomersTagsQuery();

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams.id));
	}, [routeParams]);

	return (
		<Root
			header={<CustomersHeader />}
			content={<CustomersList />}
			ref={pageLayout}
			rightSidebarContent={<CustomersSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default withReducer('customersApp', reducer)(CustomersApp);
