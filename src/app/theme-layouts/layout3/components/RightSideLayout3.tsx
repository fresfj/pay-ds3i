import { Suspense, lazy, memo } from 'react';

const QuickPanel = lazy(() => import('app/theme-layouts/shared-components/quickPanel/QuickPanel'));
const MessengerPanel = lazy(() => import('src/app/main/apps/messenger/messengerPanel/MessengerPanel'));
const NotificationPanel = lazy(() => import('src/app/main/apps/notifications/NotificationPanel'));

/**
 * The right side layout 3.
 */
function RightSideLayout3() {
	return (
		<Suspense>
			<QuickPanel />

			{/* <MessengerPanel /> */}

			<NotificationPanel />
		</Suspense>
	);
}

export default memo(RightSideLayout3);
