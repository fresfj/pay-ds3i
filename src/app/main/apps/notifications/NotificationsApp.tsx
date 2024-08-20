import FuseLoading from '@fuse/core/FuseLoading';
import FusePageSimple from '@fuse/core/FusePageSimple/FusePageSimple';
import Typography from '@mui/material/Typography';
import Masonry from 'react-masonry-css';
import withReducer from 'app/store/withReducer';
import { useDeleteNotificationMutation, useGetAllNotificationsQuery } from './NotificationApi';
import NotificationCard from './NotificationCard';
import NotificationsAppHeader from './NotificationsAppHeader';
import reducer from './store';

function NotificationsApp() {
	const [deleteNotification] = useDeleteNotificationMutation();

	const { data: notifications, isLoading } = useGetAllNotificationsQuery();

	function handleDismiss(id: string) {
		deleteNotification(id);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	return (
		<FusePageSimple
			header={<NotificationsAppHeader />}
			content={
				<div className="flex flex-col w-full p-24 mt-24">
					<Masonry
						breakpointCols={{
							default: 4,
							960: 3,
							600: 2,
							480: 1
						}}
						className="my-masonry-grid flex w-full"
						columnClassName="my-masonry-grid_column flex flex-col p-8"
					>
						{notifications?.map((notification) => (
							<NotificationCard
								key={notification.id}
								className="mb-16"
								item={notification}
								onClose={handleDismiss}
							/>
						))}
					</Masonry>
					{notifications.length === 0 && (
						<div className="flex flex-1 items-center justify-center p-16">
							<Typography
								className="text-center text-24"
								color="text.secondary"
							>
								There are no notifications for now.
							</Typography>
						</div>
					)}
				</div>
			}
		/>
	);
}

export default withReducer('notesApp', reducer)(NotificationsApp);
