import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import SubscriptionsHeader from './SubscriptionsHeader';
import SubscriptionsTable from './SubscriptionsTable';

/**
 * The subscriptions page.
 */
function Subscriptions() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<FusePageCarded
			header={<SubscriptionsHeader />}
			content={<SubscriptionsTable />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Subscriptions;
