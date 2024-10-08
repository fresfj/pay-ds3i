import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

/**
 * The analytics dashboard app header.
 */
function EcommerceDashboardAppHeader() {
	return (
		<div className="flex w-full container">
			<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 p-24 md:p-32 pb-0 md:pb-0">
				<div className="flex flex-col flex-auto">
					<Typography className="text-3xl font-semibold tracking-tight leading-8">
						E-commerce dashboard
					</Typography>
					<Typography
						className="font-medium tracking-tight"
						color="text.secondary"
					>
						Monitor metrics, Check reports, and Review performance: Stay updated on recent sales and revenue
					</Typography>
				</div>
				<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
					<Button
						className="whitespace-nowrap"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
					>
						Settings
					</Button>
					<Button
						className="whitespace-nowrap"
						variant="contained"
						color="secondary"
						startIcon={<FuseSvgIcon size={20}>heroicons-solid:save</FuseSvgIcon>}
					>
						Export
					</Button>
				</div>
			</div>
		</div>
	);
}

export default EcommerceDashboardAppHeader;
