import FusePageSimple from '@fuse/core/FusePageSimple';
import { useCallback, useEffect, useRef, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import { motion } from 'framer-motion';

import { useSelector } from 'react-redux';
import InstancesHeader from './InstancesHeader';
import InstancesList from './InstancesList';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import { instancesSelector, removeInstance, setInstance } from './store/InstancesSlice';
import { InstanceDialog } from './components/InstanceDialog';

import { selectUser } from 'src/app/auth/user/store/userSlice';
import { selectFilteredInstanceList, useDeleteInstanceMutation, useGetInstancesAllQuery } from './InstanceApi';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useAppDispatch } from 'app/store/store';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { DeleteInstanceDialog } from './components/DeleteInstanceDialog';


const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

/**
 * The InstancesApp page.
 */
function InstancesApp() {
	const { data: user } = useSelector(selectUser);
	const { data, isLoading } = useGetInstancesAllQuery(
		{ instanceId: user.customer.id },
		{ skip: !user.customer.id }) as any;

	const [isOpenConfirm, setIsOpenConfirm] = useState(false);
	const [onInstances, setOnInstances] = useState('');

	const filteredData = useSelector(selectFilteredInstanceList(data));
	const [deleteInstance] = useDeleteInstanceMutation();

	const [currentContact, setCurrentContact] = useState<any[]>([]);
	const [share, setShare] = useState(false);
	const [inviteEmail, setInviteEmail] = useState('');
	const dispatch = useAppDispatch();

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 100 },
		show: { opacity: 1, y: 0 }
	};

	const onChangeContact = useCallback((e: any) => {
		setIsOpenConfirm(true);
		setOnInstances(e)
	}, []);

	const handleOpenDialog = () => {
		setShare(true);
	};

	const handleCloseDialog = () => {
		setShare(false);
	};
	const handleCloseShareDialog = () => {
		setShare(false);
	};

	const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setInviteEmail(event.target.value);
	}, []);


	const handleCloseConfirm = () => {
		setIsOpenConfirm(false);
	};

	const handleConfirmDelete = () => {
		deleteInstance(onInstances).unwrap()
			.then(() => {
				dispatch(
					showMessage({
						message: 'Instância deletada com sucesso',
						autoHideDuration: 2000,
						variant: 'success',
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'right'
						}
					})
				);
			});
		handleCloseConfirm();
	};

	if (isLoading) {
		return <FuseLoading />;
	}

	if (filteredData?.length === 0 || !filteredData) {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					TESTE
				</Typography>
			</motion.div>
		);
	}



	return (
		<Root
			header={<InstancesHeader onOpenSettings={handleOpenDialog} />}
			content={
				<div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
					<InstancesList
						data={filteredData}
						onChangeContact={onChangeContact}
					/>
					<InstanceDialog
						open={share}
						inviteEmail={inviteEmail}
						onChangeInvite={handleChangeInvite}
						onClose={() => { handleCloseDialog() }}
						{...data?.instance}
					/>
					<DeleteInstanceDialog
						open={isOpenConfirm}
						onClose={handleCloseConfirm}
						confirmDelete={handleConfirmDelete} />
				</div>
			}
		/>
	);
}

export default withReducer('instancesApp', reducer)(InstancesApp);