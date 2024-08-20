import { ForwardedRef, forwardRef } from 'react';
import { SnackbarContent } from 'notistack';
import NotificationCard from './NotificationCard';
import { NotificationModelType } from './models/NotificationModel';

type NotificationTemplateProps = {
	item: NotificationModelType;
	onClose: () => void;
};

/**
 * The notification template.
 */
const NotificationTemplate = forwardRef((props: NotificationTemplateProps, ref: ForwardedRef<HTMLDivElement>) => {
	const { item } = props;

	return (
		<SnackbarContent
			ref={ref}
			className="pointer-events-auto relative mx-auto w-full max-w-320 py-4"
		>
			<NotificationCard
				item={item}
				onClose={props.onClose}
			/>
		</SnackbarContent>
	);
});

export default NotificationTemplate;
