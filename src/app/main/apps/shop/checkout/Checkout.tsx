import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import CheckoutHeader from './CheckoutHeader';
import CheckoutContent from './CheckoutContent';

/**
 * The checkout page.
 */
function Checkout() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	return (
		<FusePageSimple
			header={<CheckoutHeader />}
			content={<CheckoutContent />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Checkout;
