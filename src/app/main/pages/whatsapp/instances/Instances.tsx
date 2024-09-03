import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseLoading from '@fuse/core/FuseLoading';
import NewInstanceItem from './NewInstanceItem';
import { useGetInstancesQuery } from '../InstanceApi';
import InstanceItem from './InstanceItem';
import { useCallback, useState } from 'react';
import { InstanceDialog } from '../components/InstanceDialog';

/**
 * The Instances component.
 */
function Instances() {
	const { data: instances, isLoading } = useGetInstancesQuery();
	const [inviteEmail, setInviteEmail] = useState('');
	const [share, setShare] = useState(false);

	const handleOpenDialog = () => {
		setShare(true);
	};

	const handleCloseDialog = () => {
		setShare(false);
	};

	const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setInviteEmail(event.target.value);
	}, []);

	console.log(`instances`, instances)

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};



	return (
		<div className="flex grow shrink-0 flex-col items-center container p-24 sm:p-40">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
			>
				<Typography className="mt-16 md:mt-96 text-3xl md:text-6xl font-extrabold tracking-tight leading-7 sm:leading-10 text-center">
					Instances
				</Typography>
			</motion.div>

			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
				className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16 mt-32 md:mt-64"
			>
				{/* {instances.length > 0 && instances?.map((board) => (
					<motion.div
						variants={item}
						className="min-w-full sm:min-w-224 min-h-360"
						key={board.id}
					>
						<InstanceItem
							board={board}
							key={board.id}
						/>
					</motion.div>
				))} */}

				<motion.div
					variants={item}
					className="min-w-full sm:min-w-224 min-h-360"
				>
					<NewInstanceItem onOpen={() => handleOpenDialog()} />
				</motion.div>
			</motion.div>

			<InstanceDialog
				open={share}
				inviteEmail={inviteEmail}
				onChangeInvite={handleChangeInvite}
				onClose={() => { handleCloseDialog() }}
			/>
		</div>
	);
}

export default Instances;
