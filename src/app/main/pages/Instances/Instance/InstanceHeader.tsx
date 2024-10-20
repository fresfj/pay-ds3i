import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InstanceTitle from './InstanceTitle';
import { Iconify } from '@fuse/components/iconify';

type BoardHeaderProps = {
	onSetSidebarOpen: (open: boolean) => void;
};

/**
 * The board header component.
 */
function InstanceHeader(props: BoardHeaderProps) {
	const { onSetSidebarOpen } = props;

	return (
		<div className="p-24 sm:p-32 w-full border-b-1 flex items-center sm:justify-between container">
			<div className="flex items-center">
				<InstanceTitle />
			</div>

			<div className="flex flex-1 items-center justify-end space-x-0 sm:space-x-12">
				<Button
					className="whitespace-nowrap"
					component={NavLinkAdapter}
					to="/apps/settings/instances/"
				>
					<Iconify icon='solar:posts-carousel-horizontal-bold-duotone' width={20} />
					<span className="hidden sm:flex mx-8">Instâncias</span>
				</Button>

				<Button
					className="whitespace-nowrap"
					variant="contained"
					color="secondary"
					onClick={() => onSetSidebarOpen(true)}
				>
					<Iconify icon='solar:settings-bold-duotone' width={20} />
					<span className="hidden sm:flex mx-8">Settings</span>
				</Button>
			</div>
		</div>
	);
}

export default InstanceHeader;
