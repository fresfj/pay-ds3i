import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useParams } from 'react-router-dom';
import withRouter from '@fuse/core/withRouter';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import InstanceHeader from './InstanceHeader';
import InstanceSettingsSidebar from './sidebars/settings/InstanceSettingsSidebar';
import { useGetInstanceByIdQuery, useGetInstanceContactsQuery, useGetInstanceGroupsQuery } from '../InstanceApi';
import { string } from 'prop-types';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import AlertTitle from '@mui/material/AlertTitle';
import { Iconify } from '@fuse/components/iconify';
import QRCodeDialog from '../components/dialogs/QRCodeDialog';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { SvgColor } from '@fuse/components/svg-color';
import { AnimatePresence, motion } from 'framer-motion';
import FuseLoading from '@fuse/core/FuseLoading';
import CardHeader from '@mui/material/CardHeader';
import { Scrollbar } from '@fuse/components/scrollbar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Badge from '@mui/material/Badge';
import { SendWhatsAppDialog } from '../components/dialogs/SendWhatsAppDialog';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Input from '@mui/material/Input';
import GroupParticipantsDialog from '../components/dialogs/GroupParticipantsDialog';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

/**
 * The board component.
 */
function Instance() {
	const dispatch = useDispatch();
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
	const [openWhats, setOpenWhats] = useState<boolean>(false);
	const [openGroup, setOpenGroup] = useState<boolean>(false);
	const [contact, setContact] = useState('')
	const [group, setGroup] = useState('')
	const [searchGroup, setSearchGroup] = useState('');
	const [searchContact, setSearchContact] = useState('');
	const routeParams = useParams();
	const { instanceId } = routeParams;
	const { data: instance, isLoading } = useGetInstanceByIdQuery(instanceId);

	const { data: contacts, isLoading: isLoadingContact } = useGetInstanceContactsQuery(
		instance?.name,
		{ skip: !instance?.name }
	);

	const { data: groups, isLoading: isLoadingGroups } = useGetInstanceGroupsQuery(
		instance?.name,
		{ skip: !instance?.name }
	);

	const contactsPushName = contacts?.filter(contact => contact.pushName && contact.pushName.trim() !== '');

	const groupNoRestrict = groups?.filter(grupo =>
		grupo.announce === false &&
		!/#\d+/.test(grupo.subject)
	);

	const [sidebarOpen, setSidebarOpen] = useState(false);

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

	if (isLoading) {
		return <FuseLoading />;
	}

	const handleOpenWhatsDialog = (contact: any) => {
		setContact({ ...contact, instanceName: instance?.name })
		setOpenWhats(true);
	};

	const handleOpenGroupDialog = (group: any) => {
		setGroup({ ...group, instanceName: instance?.name })
		setOpenGroup(true);
	};

	const handleCloseGroupDialog = () => {
		setOpenGroup(false);
	};
	const handleCloseWhatsDialog = () => {
		setOpenWhats(false);
	};

	const handleSearchGroupChange = (event) => {
		setSearchGroup(event.target.value);
	};

	const handleSearchContactChange = (event) => {
		setSearchContact(event.target.value);
	};

	const filteredContacts = contactsPushName?.filter(contact =>
		contact.pushName.toLowerCase().includes(searchContact.toLowerCase())
	);

	const filteredGroups = groupNoRestrict?.filter(group =>
		group.subject.toLowerCase().includes(searchGroup.toLowerCase())
	);

	return (
		<>
			<FusePageSimple
				header={<InstanceHeader onSetSidebarOpen={setSidebarOpen} />}
				content={<>
					{instance?.connectionStatus !== 'open' ?
						<div className="flex flex-1 overflow-x-auto overflow-y-hidden w-full mt-20">
							<Alert
								className='w-full rounded-lg p-20 text-lg md:text-2xl'
								severity="warning"
								icon={<Iconify icon="solar:shield-warning-bold-duotone" width={32} />}
								action={<QRCodeDialog instance={instance} />}>
								Para conectar, escaneie o QR Code com o WhatsApp
							</Alert>
						</div>
						:
						<Box
							sx={{
								display: 'flex',
								flex: '1 1 auto',
								flexDirection: 'column',
								px: 4,
								mt: 4
							}}
						>
							<motion.div
								variants={container}
								initial="hidden"
								animate="show"
							>
								<Grid container spacing={4}>
									<Grid item xs={12} sm={6} md={4}>
										<Card
											component={motion.div}
											variants={item}
											sx={{
												p: 3,
												borderRadius: 2,
												boxShadow: 'none',
												position: 'relative',
												color: `primary.contrastText`,
												backgroundColor: 'success.main'
											}}
										>
											<Box sx={{ width: 48, height: 48, mb: 3 }}>
												<Iconify icon="solar:users-group-rounded-bold-duotone" width={55} />
											</Box>
											<Box
												sx={{
													display: 'flex',
													flexWrap: 'wrap',
													alignItems: 'flex-end',
													justifyContent: 'flex-end',
												}}
											>
												<Box sx={{ flexGrow: 1, minWidth: 112 }}>
													<Box sx={{ mb: 1, typography: 'subtitle2' }}>Contatos</Box>
													<Box sx={{ typography: 'h4' }}>{instance._count.Contact}</Box>
												</Box>
											</Box>
											<SvgColor
												src={`/assets/background/shape-square.svg`}
												sx={{
													top: 0,
													left: -20,
													width: 240,
													height: 240,
													opacity: 0.24,
													position: 'absolute',
													color: `primary.contrastText`,
												}}
											/>
										</Card>
									</Grid>
									<Grid item xs={12} sm={6} md={4}>
										<Card
											component={motion.div}
											variants={item}
											sx={{
												p: 3,
												borderRadius: 2,
												boxShadow: 'none',
												position: 'relative',
												color: `primary.contrastText`,
												backgroundColor: 'primary.main'
											}}
										>
											<Box sx={{ width: 48, height: 48, mb: 3 }}>
												<Iconify icon="solar:chat-line-line-duotone" width={55} />
											</Box>
											<Box
												sx={{
													display: 'flex',
													flexWrap: 'wrap',
													alignItems: 'flex-end',
													justifyContent: 'flex-end',
												}}
											>
												<Box sx={{ flexGrow: 1, minWidth: 112 }}>
													<Box sx={{ mb: 1, typography: 'subtitle2' }}>Chats</Box>
													<Box sx={{ typography: 'h4' }}>{instance._count.Chat}</Box>
												</Box>
											</Box>
											<SvgColor
												src={`/assets/background/shape-square.svg`}
												sx={{
													top: 0,
													left: -20,
													width: 240,
													height: 240,
													opacity: 0.24,
													position: 'absolute',
													color: `primary.contrastText`,
												}}
											/>
										</Card>
									</Grid>
									<Grid item xs={12} sm={6} md={4}>
										<Card
											component={motion.div}
											variants={item}
											sx={{
												p: 3,
												borderRadius: 2,
												boxShadow: 'none',
												position: 'relative',
												color: `secondary.contrastText`,
												backgroundColor: 'secondary.main'
											}}
										>
											<Box sx={{ width: 48, height: 48, mb: 3 }}>
												<Iconify icon="solar:chat-dots-line-duotone" width={55} />
											</Box>
											<Box
												sx={{
													display: 'flex',
													flexWrap: 'wrap',
													alignItems: 'flex-end',
													justifyContent: 'flex-end',
												}}
											>
												<Box sx={{ flexGrow: 1, minWidth: 112 }}>
													<Box sx={{ mb: 1, typography: 'subtitle2' }}>Mensagens</Box>
													<Box sx={{ typography: 'h4' }}>{instance._count.Message}</Box>
												</Box>
											</Box>
											<SvgColor
												src={`/assets/background/shape-square.svg`}
												sx={{
													top: 0,
													left: -20,
													width: 240,
													height: 240,
													opacity: 0.24,
													position: 'absolute',
													color: `secondary.contrastText`,
												}}
											/>
										</Card>
									</Grid>
								</Grid>
							</motion.div>

							<Grid container spacing={4}>
								<Grid item xs={12} md={7} lg={6}>
									<Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', mt: 4 }}>
										<motion.div
											initial={{ opacity: 0, y: 40 }}
											animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
										>
											{groupNoRestrict ?
												<Card sx={{ p: 3, borderRadius: 2 }} >
													<CardHeader
														title={<Typography variant="h4" className="text-3xl font-semibold">Grupos</Typography>}
														subheader={<Typography variant="h6" className="text-base">Você tem {groupNoRestrict?.length} grupos</Typography>}
													/>
													<div className="flex flex-1 items-center mt-4 -mx-8">
														<Box
															component={motion.div}
															initial={{ y: -20, opacity: 0 }}
															animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
															className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 rounded-8"
														>
															<FuseSvgIcon
																color="action"
																size={20}
															>
																heroicons-outline:search
															</FuseSvgIcon>

															<Input
																placeholder="Pesquisar Grupos"
																className="flex flex-1 px-16"
																disableUnderline
																fullWidth
																value={searchGroup}
																inputProps={{
																	'aria-label': 'Search'
																}}
																onChange={handleSearchGroupChange}
															/>
														</Box>
													</div>
													<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
														<motion.div
															variants={container}
															initial="hidden"
															animate="show"
															className="w-full"
														>
															{filteredGroups.slice(-15).map((group, index) => {
																return (
																	<ListItem key={group.id}
																		secondaryAction={
																			<Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
																				<Tooltip title="Enviar mensagem">
																					<IconButton onClick={() => handleOpenWhatsDialog(group)}>
																						<Iconify icon="solar:chat-line-line-duotone" width={26} />
																					</IconButton>
																				</Tooltip>
																				<Tooltip title={`Total de ${group.size} Participantes`}>
																					<Badge badgeContent={group.size} color="secondary">
																						<IconButton onClick={() => handleOpenGroupDialog(group)}>
																							<Iconify icon="solar:users-group-two-rounded-bold-duotone" width={26} />
																						</IconButton>
																					</Badge>
																				</Tooltip>
																			</Stack>
																		}
																		component={motion.div}
																		variants={item}
																	>
																		<ListItemAvatar>
																			<Avatar src={group.pictureUrl} sx={{ width: 42, height: 42 }} />
																		</ListItemAvatar>
																		<ListItemText primary={group.subject} secondary={group.id} />
																	</ListItem>
																)
															})}
														</motion.div>
													</List>
												</Card>
												:
												<FuseLoading />
											}
										</motion.div>
									</Box>
								</Grid>
								<Grid item xs={12} md={5} lg={6}>
									<Box sx={{ gap: 3, display: 'flex', flexDirection: 'column', mt: 4 }}>
										<motion.div
											initial={{ opacity: 0, y: 40 }}
											animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
										>
											{contacts ?
												<Card sx={{ p: 3, borderRadius: 2 }} >
													<CardHeader
														title={<Typography variant="h4" className="text-3xl font-semibold">Contatos</Typography>}
														subheader={<Typography variant="h6" className="text-base">Você tem {contacts.length} contatos</Typography>}
													/>
													<div className="flex flex-1 items-center mt-4 -mx-8">
														<Box
															component={motion.div}
															initial={{ y: -20, opacity: 0 }}
															animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
															className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 rounded-8"
														>
															<FuseSvgIcon
																color="action"
																size={20}
															>
																heroicons-outline:search
															</FuseSvgIcon>

															<Input
																placeholder="Pesquisar Contatos"
																className="flex flex-1 px-16"
																disableUnderline
																fullWidth
																value={searchContact}
																inputProps={{
																	'aria-label': 'Search'
																}}
																onChange={handleSearchContactChange}
															/>
														</Box>
													</div>
													<List sx={{ width: '100%', bgcolor: 'background.paper' }}>
														<motion.div
															variants={container}
															initial="hidden"
															animate="show"
															className="w-full"
														>
															{filteredContacts.slice(-15).map((contact, index) => {
																return (
																	<ListItem key={contact.id}
																		secondaryAction={
																			<Tooltip title="Enviar mensagem">
																				<IconButton onClick={() => handleOpenWhatsDialog(contact)}>
																					<Iconify icon="solar:chat-line-line-duotone" width={26} />
																				</IconButton>
																			</Tooltip>
																		}
																		component={motion.div}
																		variants={item}
																	>
																		<ListItemAvatar>
																			<Avatar src={contact.profilePicUrl} sx={{ width: 42, height: 42 }} />
																		</ListItemAvatar>
																		<ListItemText primary={contact.pushName} secondary={contact.remoteJid} />
																	</ListItem>
																)
															})}
														</motion.div>
													</List>
												</Card>
												:
												<FuseLoading />
											}
										</motion.div>
									</Box>
								</Grid>
							</Grid>
						</Box>
					}
				</>}
				rightSidebarOpen={sidebarOpen}
				rightSidebarContent={<InstanceSettingsSidebar onSetSidebarOpen={setSidebarOpen} instance={instance} />}
				rightSidebarOnClose={() => setSidebarOpen(false)}
				scroll={isMobile ? 'normal' : 'content'}
				rightSidebarWidth={420}
			/>
			<AnimatePresence><GroupParticipantsDialog open={openGroup} onClose={handleCloseGroupDialog} group={group} /></AnimatePresence>
			<AnimatePresence><SendWhatsAppDialog open={openWhats} onClose={handleCloseWhatsDialog} contact={contact} /></AnimatePresence>
		</>
	);
}

export default withRouter(Instance);
