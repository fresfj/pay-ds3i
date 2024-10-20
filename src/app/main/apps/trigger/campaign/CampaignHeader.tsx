import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import {
	EcommerceCoupon,
	useCreateCampaignMutation,
	useDeleteCampaignMutation,
	useUpdateCampaignMutation
} from '../TriggerApi';

/**
 * The coupon header.
 */
function CampaignHeader() {
	const routeParams = useParams();
	const { triggerId } = routeParams;

	const [createCampaign] = useCreateCampaignMutation();
	const [saveCampaign] = useUpdateCampaignMutation();
	const [removeCampaign] = useDeleteCampaignMutation();

	const methods = useFormContext();
	const { formState, watch, getValues } = methods;
	const { isValid, dirtyFields } = formState;

	const theme = useTheme();
	const navigate = useNavigate();

	const { name } = watch() as EcommerceCoupon;

	function handleSaveCoupon() {
		saveCampaign(getValues() as EcommerceCoupon);
	}

	function handleCreateCoupon() {
		createCampaign(getValues() as EcommerceCoupon)
			.unwrap()
			.then((data) => {
				navigate(`/apps/settings/trigger/${data.id}`);
			});
	}

	function handleRemoveCoupon() {
		// removeCoupon(couponId);
		// navigate('/apps/settings/trigger');
	}

	return (
		<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
			<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
				>
					<Typography
						className="flex items-center sm:mb-12"
						component={Link}
						role="button"
						to="/apps/settings/trigger"
						color="inherit"
					>
						<FuseSvgIcon size={20}>
							{theme.direction === 'ltr'
								? 'heroicons-outline:arrow-sm-left'
								: 'heroicons-outline:arrow-sm-right'}
						</FuseSvgIcon>
						<span className="flex mx-4 font-medium">Campanhas</span>
					</Typography>
				</motion.div>

				<div className="flex items-center max-w-full">
					<motion.div
						className="flex flex-col min-w-0 mx-8 sm:mx-16"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-16 sm:text-20 truncate font-semibold">
							{name || 'Nova Campanha'}
						</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Detalhe Campanha
						</Typography>
					</motion.div>
				</div>
			</div>
			<motion.div
				className="flex flex-1 w-full"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			>
				{triggerId !== 'new' ? (
					<>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							onClick={handleRemoveCoupon}
							startIcon={<FuseSvgIcon className="hidden sm:flex">heroicons-outline:trash</FuseSvgIcon>}
						>
							Remove
						</Button>
						<Button
							className="whitespace-nowrap mx-4"
							variant="contained"
							color="secondary"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							onClick={handleSaveCoupon}
						>
							Save
						</Button>
					</>
				) : (
					<Button
						className="whitespace-nowrap mx-4"
						variant="contained"
						color="secondary"
						disabled={_.isEmpty(dirtyFields) || !isValid}
						onClick={handleCreateCoupon}
					>
						Add
					</Button>
				)}
			</motion.div>
		</div>
	);
}

export default CampaignHeader;
