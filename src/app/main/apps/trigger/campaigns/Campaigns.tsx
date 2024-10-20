import FusePageCarded from '@fuse/core/FusePageCarded';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import CouponsHeader from './CampaignsHeader';
import CouponsTable from './CampaignsTable';

/**
 * The coupons page.
 */
function Coupons() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<FusePageCarded
			header={<CouponsHeader />}
			content={<CouponsTable />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Coupons;
