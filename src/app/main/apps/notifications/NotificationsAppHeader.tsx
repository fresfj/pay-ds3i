import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSnackbar } from 'notistack';
import { useCreateNotificationMutation, useDeleteAllNotificationsMutation } from './NotificationApi';
import NotificationModel from './models/NotificationModel';
import NotificationTemplate from './NotificationTemplate';

/**
 * The Notifications app header.
 */
function NotificationsAppHeader() {
	const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
	const [addNotification] = useCreateNotificationMutation();
	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	function handleDismissAll() {
		deleteAllNotifications();
	}

	function demoNotification() {
		const item = NotificationModel({ title: 'Great Job! this is awesome.' });

		enqueueSnackbar(item.title, {
			key: item.id,

			// autoHideDuration: 3000,
			content: (
				<NotificationTemplate
					item={item}
					onClose={() => {
						closeSnackbar(item.id);
					}}
				/>
			)
		});

		addNotification(item);
	}

	return (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">Notifications</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Lists all notifications
					</Typography>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
					<Button
						className="whitespace-nowrap"
						onClick={demoNotification}
					>
						Example notification
					</Button>

					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						onClick={handleDismissAll}
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:bell</FuseSvgIcon>}
					>
						Dissmiss All
					</Button>
				</div>
			</div>
		</div>
	);
}

export default NotificationsAppHeader;
