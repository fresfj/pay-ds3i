import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Switch from '@mui/material/Switch';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import { Controller, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import _ from '@lodash';
import { useDebounce, useDeepCompareEffect } from '@fuse/hooks';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { PartialDeep } from 'type-fest';
import ListItemButton from '@mui/material/ListItemButton';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeleteInstanceMutation, useUpdateInstanceMutation } from '../../../InstanceApi';
import { Iconify } from '@fuse/components/iconify';
import Collapse from '@mui/material/Collapse';


type BoardSettingsSidebarProps = {
	instance: any;
	onSetSidebarOpen: (open: boolean) => void;
};

/**
 * The board settings sidebar component.
 */
function InstanceSettingsSidebar(props: BoardSettingsSidebarProps) {
	const { onSetSidebarOpen, instance } = props;
	const navigate = useNavigate();
	const routeParams = useParams();

	const [updateBoard] = useUpdateInstanceMutation();
	const [deleteBoard] = useDeleteInstanceMutation();

	const [open, setOpen] = useState(true);
	const handleClick = () => {
		setOpen(!open);
	};

	const settings = {
		rejectCall: instance?.Setting?.rejectCall || false,
		msgCall: instance?.Setting?.msgCall || "",
		groupsIgnore: instance?.Setting?.groupsIgnore || false,
		alwaysOnline: instance?.Setting?.alwaysOnline || false,
		readMessages: instance?.Setting?.readMessages || false,
		syncFullHistory: instance?.Setting?.syncFullHistory || false,
		readStatus: instance?.Setting?.readStatus || false,
	}

	const { watch, control, reset } = useForm({
		mode: 'onChange',
		defaultValues: settings
	});

	const boardSettingsForm = watch();

	const updateBoardData = useDebounce((data: PartialDeep<any>) => {
		console.log(`useUpdateInstanceMutation -- data`, data)
	}, 600);


	useDeepCompareEffect(() => {
		if (_.isEmpty(boardSettingsForm) || !instance?.id) {
			return;
		}

		if (!_.isEqual(instance.Setting, boardSettingsForm)) {
			updateBoardData({ settings: boardSettingsForm });
		}



	}, [instance, boardSettingsForm, updateBoardData]);

	useEffect(() => {
		if (!instance) {
			return;
		}

		reset(settings);
	}, [instance, reset]);

	// useEffect(() => {
	// 	if (!instance) {
	// 		return;
	// 	}

	// 	reset(instance.settings);
	// }, [instance, reset]);

	// if (_.isEmpty(boardSettingsForm)) {
	// 	return null;
	// }

	return (
		<div>
			<Box
				sx={{
					backgroundColor: (theme) =>
						theme.palette.mode === 'light'
							? lighten(theme.palette.background.default, 0.4)
							: lighten(theme.palette.background.default, 0.02)
				}}
				className="border-b-1"
			>
				<Toolbar className="flex items-center px-4">
					<IconButton
						onClick={() => onSetSidebarOpen(false)}
						color="inherit"
						size="large"
					>
						<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
					</IconButton>
					<Typography
						className="px-4 font-medium text-16"
						color="inherit"
						variant="subtitle1"
					>
						Settings
					</Typography>
				</Toolbar>
			</Box>

			<List className="py-24">
				<ListItem>
					<ListItemIcon className="min-w-40">
						<Iconify icon="solar:call-cancel-bold-duotone" width={28} />
					</ListItemIcon>
					<ListItemText primary="Rejeitar Chamadas" secondary="Rejeitar todas as chamadas" />
					<ListItemSecondaryAction>
						<Controller
							name="rejectCall"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Switch
									onChange={(ev) => {
										onChange(ev.target.checked);
									}}
									checked={value !== undefined ? value : false}
								/>
							)}
						/>
					</ListItemSecondaryAction>
				</ListItem>
				<ListItem>
					<ListItemIcon className="min-w-40">
						<Iconify icon="solar:chat-unread-bold-duotone" width={28} />
					</ListItemIcon>
					<ListItemText primary="Ignorar Grupos" secondary="Ignorar todas as mensagens de grupos" />
					<ListItemSecondaryAction>
						<Controller
							name="groupsIgnore"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Switch
									onChange={(ev) => {
										onChange(ev.target.checked);
									}}
									checked={value !== undefined ? value : false}
								/>
							)}
						/>
					</ListItemSecondaryAction>
				</ListItem>
				<ListItem>
					<ListItemIcon className="min-w-40">
						<Iconify icon="solar:call-chat-bold-duotone" width={28} />
					</ListItemIcon>
					<ListItemText primary="Sempre Online" secondary="Permanecer sempre online" />
					<ListItemSecondaryAction>
						<Controller
							name="alwaysOnline"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Switch
									onChange={(ev) => {
										onChange(ev.target.checked);
									}}
									checked={value !== undefined ? value : false}

								/>
							)}
						/>
					</ListItemSecondaryAction>
				</ListItem>
				<ListItem>
					<ListItemIcon className="min-w-40">
						<Iconify icon="solar:chat-square-check-bold-duotone" width={28} />
					</ListItemIcon>
					<ListItemText primary="Visualizar Mensagens" secondary="Marcar todas as mensagens como lidas" />
					<ListItemSecondaryAction>
						<Controller
							name="readMessages"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Switch
									onChange={(ev) => {
										onChange(ev.target.checked);
									}}
									checked={value !== undefined ? value : false}

								/>
							)}
						/>
					</ListItemSecondaryAction>
				</ListItem>
				<ListItem>
					<ListItemIcon className="min-w-40">
						<Iconify icon="solar:server-square-cloud-bold-duotone" width={28} />
					</ListItemIcon>
					<ListItemText primary="Sincronizar Histórico Completo" secondary="Sincronizar o histórico completo ao ler o QR Code" />
					<ListItemSecondaryAction>
						<Controller
							name="syncFullHistory"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Switch
									onChange={(ev) => {
										onChange(ev.target.checked);
									}}
									checked={value !== undefined ? value : false}

								/>
							)}
						/>
					</ListItemSecondaryAction>
				</ListItem>
				<ListItem>
					<ListItemIcon className="min-w-40">
						<Iconify icon="solar:cloud-check-bold-duotone" width={28} />
					</ListItemIcon>
					<ListItemText primary="Visualizar Status" secondary="Marcar todos os status como visualizados" />
					<ListItemSecondaryAction>
						<Controller
							name="readStatus"
							control={control}
							render={({ field: { onChange, value } }) => (
								<Switch
									onChange={(ev) => {
										onChange(ev.target.checked);
									}}
									checked={value !== undefined ? value : false}

								/>
							)}
						/>
					</ListItemSecondaryAction>
				</ListItem>
				<ListItemButton onClick={handleClick}>
					<ListItemIcon>
						<Iconify icon="solar:plug-circle-bold" width={28} />
					</ListItemIcon>
					<ListItemText primary="Integrations" />
					{open ? <Iconify icon="eva:arrow-ios-upward-fill" width={28} /> : <Iconify icon="eva:arrow-ios-downward-fill" width={28} />}
				</ListItemButton>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<List component="div" disablePadding>
						<ListItemButton sx={{ pl: 4 }}>
							<ListItemIcon>
								<Iconify icon="fluent:bot-sparkle-24-regular" width={28} />
							</ListItemIcon>
							<ListItemText primary="Dify" secondary="AI Agents" />
						</ListItemButton>
						<ListItemButton sx={{ pl: 4 }}>
							<ListItemIcon>
								<Iconify icon="fluent:bot-sparkle-24-regular" width={28} />
							</ListItemIcon>
							<ListItemText primary="OpenAI" secondary="AI Agents" />
						</ListItemButton>
						<ListItemButton sx={{ pl: 4 }}>
							<ListItemIcon>
								<Iconify icon="fluent:bot-sparkle-24-regular" width={28} />
							</ListItemIcon>
							<ListItemText primary="Typebot" secondary="AI Workflows" />
						</ListItemButton>
					</List>
				</Collapse>
			</List>
		</div>
	);
}

export default InstanceSettingsSidebar;
