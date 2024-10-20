import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { Iconify } from '@fuse/components/iconify';
import Button from '@mui/material/Button';
import ContactsActionSelected from './components/ContactsActionSelected';
import { useBoolean } from '@fuse/hooks/use-boolean';
import { useTheme } from '@mui/material/styles';
import { ShareDialog } from './components/ShareDialog';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import CardHeader from '@mui/material/CardHeader';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Menu, { MenuProps } from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled, alpha } from '@mui/material/styles';
import { borderColor } from '@mui/system';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemIcon from '@mui/material/ListItemIcon';
import clsx from 'clsx';

type ContactsProps = {
	contacts?: any[]
	data?: any[]
	all?: number
	onChangeContact: (e: any) => void
	onSelectAll?: () => void
};

const StyledMenu = styled((props: MenuProps) => (
	<Menu
		elevation={0}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
))(({ theme }) => ({
	'& .MuiPaper-root': {
		borderRadius: 6,
		marginTop: theme.spacing(1),
		minWidth: 134,
		borderColor: 'transparant',
		color: 'rgb(34, 43, 69)',
		boxShadow:
			'0px 2px 4px -1px rgba(0, 0, 0, 0.1), 0px 4px 5px 0px rgba(0, 0, 0, 0.07), 0px 1px 10px 0px rgba(0, 0, 0, 0.06)',
		'& .MuiMenu-list': {
			padding: '4px 0',
		},
		'& .MuiMenuItem-root': {
			'& .MuiSvgIcon-root': {
				fontSize: 18,
				color: theme.palette.text.secondary,
				marginRight: theme.spacing(1.5),
			},
			'&:active': {
				backgroundColor: alpha(
					theme.palette.primary.main,
					theme.palette.action.selectedOpacity,
				),
			},
		},
	},
}));

/**
 * Remove contatos duplicados com base no campo `id`
 */
const removeDuplicateContacts = (contacts: any[]) => {
	const seen = new Set();
	return contacts.filter(contact => {
		if (seen.has(contact.id)) {
			return false; // Ignora duplicados
		}
		seen.add(contact.id);
		return true;
	});
};

const filterDuplicateContacts = (contacts, key) => {
	const seen = new Set();
	return contacts.filter(contact => {
		const uniqueValue = contact[key];
		if (seen.has(uniqueValue)) {
			return false; // Duplicate found, don't include in the result
		}
		seen.add(uniqueValue); // Add to seen set and include in the result
		return true;
	});
};
/**
 * The ContactsList component.
 */
function ContactsList({ contacts, data, all, onSelectAll, onChangeContact }: ContactsProps) {
	const [share, setShare] = useState(false);
	const containerRef = useRef(null);
	const [selectedContact, setSelectedContact] = useState(null);
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const [visibleCount, setVisibleCount] = useState(24);
	const showMoreContacts = () => {
		setVisibleCount(prevCount => prevCount + 24);
	};

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

	const theme = useTheme();

	const [inviteEmail, setInviteEmail] = useState('');

	const handleOpenShareDialog = () => {
		setShare(true);
	};

	const handleCloseShareDialog = () => {
		setShare(false);
	};

	const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setInviteEmail(event.target.value);
	}, []);

	function stringToColor(string: string) {
		let hash = 0;
		let i;

		for (i = 0; i < string.length; i += 1) {
			hash = string.charCodeAt(i) + ((hash << 5) - hash);
		}

		let color = '#';

		for (i = 0; i < 3; i += 1) {
			const value = (hash >> (i * 8)) & 0xff;
			color += `00${value.toString(16)}`.slice(-2);
		}
		return color;
	}

	function stringAvatar(name: string) {
		const nameParts = name.split(' ');
		let initials;
		if (nameParts.length === 1) {
			initials = `${nameParts[0][0]}${nameParts[0][0]}`;
		} else {
			initials = `${nameParts[0][0]}${nameParts[1][0]}`;
		}

		return {
			sx: {
				mx: 'auto',
				width: { xs: 64, md: 82 },
				height: { xs: 64, md: 82 },
				bgcolor: stringToColor(name),
			},
			children: initials,
		};
	}



	const handleClick = (event, contact) => {
		setAnchorEl(event.currentTarget);
		setSelectedContact(contact);
	}

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleEdit = (e: any) => {
		handleClose();
	};

	const handleDelete = async (e: any) => {
		onChangeContact(e)
		handleClose();
	};

	return (
		<Box ref={containerRef}>
			<motion.div
				variants={container}
				initial="hidden"
				animate="show"
			>
				<Collapse in={true} unmountOnExit>
					<Box
						display="grid"
						gridTemplateColumns={{
							xs: 'repeat(1, 1fr)',
							sm: 'repeat(2, 1fr)',
							md: 'repeat(3, 1fr)',
							lg: 'repeat(4, 1fr)',
						}}
						gap={2}
					>
						{data.map((contact, index) => {

							return (
								<Card
									variant="outlined"
									className="rounded-2xl mt-14 relative flex flex-col shadow hover:shadow-lg overflow-hidden transition-shadow ease-in-out duration-150"
									key={contact.id}
									sx={{
										display: 'flex',
										borderRadius: 2,
										cursor: 'pointer',
										position: 'relative',
										bgcolor: 'rgb(248 250 252)',
										border: '1px solid transparent',
										flexDirection: 'column',
										transition: 'all 0.3s ease-in-out',

									}}
									component={motion.div}
									variants={item}
								>
									<CardHeader
										action={
											<>
												<IconButton aria-label="settings" onClick={(e) => handleClick(e, contact)}>
													<MoreVertIcon />
												</IconButton>
												<StyledMenu
													anchorEl={anchorEl}
													open={open}
													onClose={handleClose}
													MenuListProps={{
														'aria-labelledby': 'demo-customized-button',
													}}
													anchorOrigin={{
														vertical: 'top',
														horizontal: 'left',
													}}
													transformOrigin={{
														vertical: 'top',
														horizontal: 'left',
													}}
												>
													<MenuItem onClick={() => handleEdit(selectedContact)}>
														<ListItemIcon>
															<Iconify icon="solar:pen-new-square-line-duotone" />
														</ListItemIcon>
														Editar
													</MenuItem>
													<MenuItem onClick={() => handleDelete(selectedContact)}>
														<ListItemIcon>
															<Iconify icon="solar:trash-bin-minimalistic-linear" />
														</ListItemIcon>
														Excluir
													</MenuItem>
												</StyledMenu>
											</>
										}
										title={<Typography className="text-lg font-medium leading-5">{contact.name}</Typography>}
										className="border-b-1"
									/>
									<CardContent
										component={NavLinkAdapter}
										to={contact.id}
									>
										<div className="flex flex-col flex-auto w-full">
											<Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
												<Badge
													overlap="circular"
													anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
													badgeContent={
														<>
															<div className={`${contact.integration !== 'WHATSAPP-BAILEYS' ? 'bg-green-A700' : 'bg-deep-purple-A200'} text-white rounded-full w-28 h-28 flex justify-center items-center`}>
																<Iconify icon="ic:outline-whatsapp" />
															</div>
														</>
													}
												>
													<Avatar
														alt={contact.name}
														src={contact.profilePicUrl}
														className="object-cover transition-transform delay-150 duration-300 ease-in-out uppercase"
														{...stringAvatar(contact.name)}
													/>
												</Badge>
												<ListItemText
													primary={contact?.profileName}
													secondary={contact.ownerJid ? contact.ownerJid.replace('@s.whatsapp.net', '') : ''}
												/>
											</Box>

										</div>
										{/* <Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
										<Tooltip
											title={contact.connectionStatus}
										>
											<Chip
												className="font-semibold text-12 mx-4 mb-6"
												label={contact.connectionStatus}
												size="small"
											/>
										</Tooltip>
									</Stack> */}
										<div className="flex justify-between items-center px-16 mt-24">
											<div className="flex items-center space-x-8">
												{contact._count.Contact > 0 && (
													<span className="flex items-center space-x-2">
														<Iconify icon="solar:user-circle-bold-duotone" color="action" />
														<Typography color="text.secondary">{contact._count.Contact}</Typography>
													</span>
												)}
												{/* {contact._count.Chat > 0 && (
													<span className="flex items-center space-x-2">
														<Iconify icon="solar:chat-line-bold-duotone" color="action" />
														<Typography color="text.secondary">{contact._count.Chat}</Typography>
													</span>
												)} */}
												{contact._count.Message > 0 && (
													<span className="flex items-center space-x-2">
														<Iconify icon="solar:chat-round-line-bold-duotone" color="action" />
														<Typography color="text.secondary">{contact._count.Message}</Typography>
													</span>
												)}
											</div>
											<div className="flex items-center space-x-8">
												<Chip
													size="small"
													className={clsx(
														'flex items-center font-semibold text-12',
														contact.connectionStatus === 'close'
															? 'bg-red-A400 text-red-50'
															: contact.connectionStatus === 'open'
																? 'bg-green-A400 text-green-50'
																: 'bg-orange-A400 text-orange-50'
													)}
													sx={{
														'& .MuiChip-icon': {
															color: 'inherit'
														}
													}}
													label={
														contact.connectionStatus === 'close'
															? 'Desconectado'
															: contact.connectionStatus === 'open'
																? 'Conectado'
																: 'Conectando'
													}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							)
						})}
					</Box>
					{visibleCount < data.length && (
						<div className="flex flex-col flex-auto w-full text-center">
							<Stack spacing={2} sx={{ flexWrap: 'wrap', mt: 4, justifyContent: "center", alignItems: 'center' }}>
								<Button
									size='large'
									onClick={showMoreContacts}
									variant="contained"
									color="secondary"
									startIcon={<Iconify icon="solar:refresh-bold-duotone" />}>
									Mostrar Mais
								</Button>
							</Stack>
						</div>
					)}

				</Collapse>
			</motion.div>
		</Box>
	);
}

export default ContactsList;
