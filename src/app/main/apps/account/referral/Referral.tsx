import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import * as React from 'react';

import _ from '@lodash';

import ReferralHeader from './ReferralHeader';
import ReferralCard from './ReferralCard';

/**
 * The Referral page.
 */
function Referral() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<>
			<FusePageSimple
				fullScreen
				className="mx-auto"
				header={<ReferralHeader />}
				content={<ReferralCard />}
				scroll={isMobile ? 'normal' : 'normal'}
			/>
		</>
	);
}
export default Referral;
