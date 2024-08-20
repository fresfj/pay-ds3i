import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Customer } from './CustomersApi';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Statuses from './Statuses';
import _ from '@lodash';

type CustomerListItemPropsType = {
	customer: Customer;
};

const StyledBadge = styled(Badge)<{ statuscolor: string }>(({ theme, ...props }) => ({
	width: 40,
	height: 40,
	fontSize: 20,
	'& .MuiAvatar-root': {
		fontSize: 'inherit',
		color: theme.palette.text.secondary,
		fontWeight: 600
	},
	'& .MuiBadge-badge': {
		backgroundColor: props.statuscolor,
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		'&::after': {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			borderRadius: '50%',
			content: '""'
		}
	}
}));
/**
 * The customer list item.
 */
function CustomerListItem(props: CustomerListItemPropsType) {
	const { customer } = props;
	const status = _.find(Statuses, { value: customer?.subscription?.status });

	return (
		<>
			<ListItemButton
				className="px-32 py-16"
				sx={{ bgcolor: 'background.paper' }}
				component={NavLinkAdapter}
				to={`/apps/customers/${customer.id}`}
			>
				<ListItemAvatar>
					<StyledBadge
						overlap="circular"
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						variant="dot"
						statuscolor={status?.color ? status?.color : 'rgb(162,162,162)'}
					>
						<Avatar
							alt={customer.name}
							src={customer.avatar}
						/>
					</StyledBadge>
				</ListItemAvatar>
				<ListItemText
					classes={{ root: 'm-0', primary: 'font-medium leading-5 truncate' }}
					primary={customer.name}
					secondary={
						<>
							<Typography
								className="inline"
								component="span"
								variant="body2"
								color="text.secondary"
							>
								{customer.title ? customer.title : customer?.subscription?.description}
							</Typography>
						</>
					}
				/>
			</ListItemButton>
			<Divider />
		</>
	);
}

export default CustomerListItem;
