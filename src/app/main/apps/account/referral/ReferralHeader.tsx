import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

/**
 * The Referral header.
 */
function ReferralHeader() {

	return (
		<div className="p-24 sm:p-32 w-full flex  space-y-8 sm:space-y-0 items-center justify-between">
			<div className="flex flex-col space-y-8 sm:space-y-0">
				<motion.span
					className="flex items-end"
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
				>
					<div className="flex flex-col flex-auto">
						<Typography
							className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
							role="button"
						>
							indique e ganhe
						</Typography>

					</div>
				</motion.span>
				<motion.span
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				>
					<Typography
						className="text-14 font-medium mx-2"
						color="text.secondary"
					>
						convide seus amigos e ganhe recompensas
					</Typography>
				</motion.span>
			</div>

			<div className="flex items-center -mx-8">

			</div>
		</div>
	);
}

export default ReferralHeader;
