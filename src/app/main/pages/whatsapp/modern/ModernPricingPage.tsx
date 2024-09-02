import { useCallback, useEffect, useRef, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import ModernPricingCard from './ModernPricingCard';
import ModernPricingFeatureItem from './ModernPricingFeatureItem';
import ModernPricingItemType from './ModernPricingItemType';
import { Image } from '@fuse/components/image'
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import Avatar from '@mui/material/Avatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/system/Stack';
import { Iconify } from '@fuse/components/iconify';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';
import { useBoolean } from '@fuse/hooks/use-boolean';
import { useSelector } from 'react-redux';
import ContactsHeader from './ContactsHeader';
import { GroupedCustomers, selectFilteredContactList, selectGroupedFilteredContacts } from '../WhatsappApi';
import withReducer from 'app/store/withReducer';
import reducer from '../store';
import { ContactsActionSelected } from '../components/ContactsActionSelected';
import Collapse from '@mui/material/Collapse';
import { ShareDialog } from '../components/ShareDialog';

/**
 * The modern pricing page.
 */
function ModernPricingPage() {
	const [period, setPeriod] = useState<ModernPricingItemType['period']>('month');
	const [qrcode, setQrcode] = useState<any>('')
	const [instance, setInstance] = useState<any>('')
	const [contacts, setContacts] = useState<any>(
		[
			{
				id: "5541996741650@s.whatsapp.net",
				owner: "IND_6ecd942f",
				profilePictureUrl: "https://pps.whatsapp.net/v/t61.24694-24/433970171_470376462039460_8083483580614673028_n.jpg?ccb=11-4&oh=01_Q5AaIMxrERfu8I57gOZKxRahXXzuJpC4wgXJyqETF2G09CAa&oe=66DF4F0B&_nc_sid=5e03e0&_nc_cat=101",
				pushName: "Ale",
				__v: 0,
				_id: "66d243f8384ab584e8cad6b9"
			},
			{
				id: "5511981312897@s.whatsapp.net",
				owner: "IND_6ecd942f",
				profilePictureUrl: null,
				pushName: "Pablo Richili",
				__v: 0,
				_id: "66d24671384ab584e8cbb334"
			},
			{
				id: "554199601055@s.whatsapp.net",
				owner: "IND_6ecd942f",
				profilePictureUrl:
					"https://pps.whatsapp.net/v/t61.24694-24/290481032_737131310932102_7603825189067806735_n.jpg?ccb=11-4&oh=01_Q5AaIGOPVdNusDVX325c1Su-oWHLA7CMXWBeYkt27t7RJYRa&oe=66DF6BF0&_nc_sid=5e03e0&_nc_cat=109",
				pushName: "Francisco",
				__v: 0,
				_id: "66d24672384ab584e8cbb4cf"
			},
			{
				id: "55419960105511@s.whatsapp.net",
				owner: "IND_6ecd942f",
				profilePictureUrl:
					"https://pps.whatsapp.net/v/t61.24694-24/290481032_737131310932102_7603825189067806735_n.jpg?ccb=11-4&oh=01_Q5AaIGOPVdNusDVX325c1Su-oWHLA7CMXWBeYkt27t7RJYRa&oe=66DF6BF0&_nc_sid=5e03e0&_nc_cat=109",
				pushName: "Francisco",
				__v: 0,
				_id: "66d24672384ab584e8cbb4c11f"
			}
		])


	const filteredData = useSelector(selectFilteredContactList(contacts));
	const groupedFilteredCustomers = useSelector(selectGroupedFilteredContacts(filteredData));

	const token = '7fd370f4caddb0db67f1c3965830f963'
	const config = {
		headers: {
			'Content-Type': 'application/json',
			'apikey': token
		}
	}

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

	const handleSendContacts = async () => {
		const response = await axios.post('https://n8n.parceriasdenegocios.com.br/webhook-test/testeenvioo', contacts)

		console.log(`response`, response)
	}

	const handleGetAllContacts = async () => {
		const { data: response } = await axios.post(`https://api.parceriasdenegocios.com.br/chat/findContacts/${instance?.instanceName}`, {}, config)
		setContacts(response)
	}

	const handleGetQrcode = async () => {
		const { data: response } = await axios.get(`https://api.parceriasdenegocios.com.br/instance/connect/${instance?.instanceName}`, config)

		console.log(`handleGetQrcode`, response)

		if (response?.instance) {
			return setQrcode('')
		} else {
			setQrcode(response.base64)
		}

	}

	const handleCreateInstance = async () => {
		if (qrcode || instance) {
			return false
		}

		const uid = FuseUtils.generateGUID()
		const data = {
			"instanceName": `IND_${uid}`,
			"qrcode": true,
			"integration": "WHATSAPP-BAILEYS",
			"reject_call": true,
			"groupsIgnore": true,
			"alwaysOnline": false,
			"readMessages": false,
			"readStatus": false,
			"syncFullHistory": false,
			"webhookByEvents": true,
			"webhookBase64": true,
			"webhookEvents": [
				"APPLICATION_STARTUP"
			],
			"rabbitmqEnabled": true,
			"rabbitmqEvents": [
				"APPLICATION_STARTUP"
			],
			"sqsEnabled": true,
			"sqsEvents": [
				"APPLICATION_STARTUP"
			],
			"chatwootSignMsg": true,
			"chatwootReopenConversation": false,
			"chatwootConversationPending": false,
			"chatwootImportContacts": true,
			"chatwootMergeBrazilContacts": true,
			"typebotListeningFromMe": true
		}

		const { data: response } = await axios.post(`https://api.parceriasdenegocios.com.br/instance/create`, data, config)
		setInstance(response.instance)
		setQrcode(response.qrcode.base64)
	}

	const [currentContact, setCurrentContact] = useState<any[]>([]);
	const [selectContact, setSelectContact] = useState<any>();
	const [share, setShare] = useState(false);
	const containerRef = useRef(null);

	const theme = useTheme();
	const checkbox = useBoolean();

	const onChangeContact = useCallback(
		(contactId: string) => {
			setCurrentContact(prevSelected =>
				prevSelected.includes(contactId)
					? prevSelected.filter(id => id !== contactId)
					: [...prevSelected, contactId]
			);
		},
		[]
	);

	const handleSelectAll = () => {
		if (currentContact.length === contacts.length) {
			setCurrentContact([]);
		} else {
			setCurrentContact(contacts.map(contact => contact.id));
		}
	};

	const [inviteEmail, setInviteEmail] = useState('');

	const handleOpenShareDialog = () => {
		console.log(`ssss`)
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

	return (
		<div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">

			<div className="flex flex-col w-full px-24 sm:px-32">
				<div className="flex flex-col sm:flex-row flex-auto sm:items-center min-w-0 my-32 sm:my-48">
					<div className="flex flex-auto items-center min-w-0">
						<Avatar
							sx={{
								background: (theme) => darken(theme.palette.background.default, 0.05),
								color: (theme) => theme.palette.text.secondary
							}}
							className="flex-0 w-64 h-64"
							alt="user photo"
						>

						</Avatar>
						<div className="flex flex-col min-w-0 mx-16">
							<Typography className="text-2xl md:text-5xl font-semibold tracking-tight leading-7 md:leading-snug truncate">
								{`Welcome back!`}
							</Typography>

							<div className="flex items-center">
								<FuseSvgIcon
									size={20}
									color="action"
								>
									heroicons-solid:bell
								</FuseSvgIcon>
								<Typography
									className="mx-6 leading-6 truncate"
									color="text.secondary"
								>
									You have 2 new messages and 15 new tasks
								</Typography>
							</div>
						</div>
					</div>
					<div className="flex items-center mt-24 sm:mt-0 sm:mx-8 space-x-12">
						<Button
							className="whitespace-nowrap"
							variant="contained"
							color="primary"
							startIcon={<FuseSvgIcon size={20}>heroicons-solid:mail</FuseSvgIcon>}
						>
							Messages
						</Button>
						<Button
							className="whitespace-nowrap"
							variant="contained"
							color="secondary"
							startIcon={<FuseSvgIcon size={20}>heroicons-solid:cog</FuseSvgIcon>}
						>
							Settings
						</Button>
					</div>
				</div>

			</div>

			<div className="relative overflow-hidden px-24 pb-48 pt-32 sm:px-64 sm:pb-96 sm:pt-80">
				<svg
					className="pointer-events-none absolute inset-0 -z-1"
					viewBox="0 0 960 540"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMax slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Box
						component="g"
						sx={{ color: 'divider' }}
						className="opacity-20"
						fill="none"
						stroke="currentColor"
						strokeWidth="100"
					>
						<circle
							r="234"
							cx="196"
							cy="23"
						/>
						<circle
							r="234"
							cx="790"
							cy="491"
						/>
					</Box>
				</svg>
				<div className="flex flex-col items-center">
					{!instance &&
						<Button
							className="mt-32 px-48 text-lg"
							size="large"
							color="secondary"
							variant="contained"
							onClick={handleCreateInstance}
						>
							Gerar QR-code 1
						</Button>
					}
					{(instance && qrcode) &&
						<Button
							className="mt-32 px-48 text-lg"
							size="large"
							color="secondary"
							variant="contained"
							onClick={handleGetQrcode}
						>
							Gerar QR-code 2
						</Button>
					}
					{(instance && !qrcode && contacts.length === 0) &&
						<Button
							className="mt-32 px-48 text-lg"
							size="large"
							color="secondary"
							variant="contained"
							onClick={handleGetAllContacts}
						>
							Gerar Contatos
						</Button>
					}
					{qrcode &&
						<Image
							alt={"QR-code"}
							src={qrcode}
							loading="lazy"
							className="filter grayscale blur-md transition-transform group-hover:scale-110 duration-400"
						/>
					}

				</div>

			</div>

			<Paper className="flex flex-col items-center px-24 py-40 sm:px-64 sm:pb-80 sm:pt-72">
				<div className="w-full max-w-7xl">


					<Button
						className="mt-32 px-48 text-lg"
						size="large"
						color="secondary"
						variant="contained"
						onClick={handleSendContacts}
					>
						Enviar para os meus contatos
					</Button>


					<Box ref={containerRef}>
						<motion.div
							variants={container}
							initial="hidden"
							animate="show"
						//className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-24 w-full min-w-0"
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
									gap={3}
								>

									{filteredData.map((contact, index) => {
										const selected = currentContact.includes(contact.id);
										return (
											<Paper
												variant="outlined"
												component={motion.div}
												variants={item}
												className="items-center rounded-2xl mt-14"
												key={contact.id}
												sx={{
													p: 2.5,
													display: 'flex',
													borderRadius: 2,
													cursor: 'pointer',
													position: 'relative',
													bgcolor: 'transparent',
													flexDirection: 'column',
													alignItems: 'flex-start',
													...((selected) && {
														bgcolor: 'background.paper',
														boxShadow: theme.customShadows.z20,
													})
												}}
												onClick={() => onChangeContact(contact.id)}
											>
												<div className="flex flex-col flex-auto w-full">
													<Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
														<Avatar
															alt={contact.pushName}
															src={contact.profilePictureUrl}
															className="object-cover"
															{...stringAvatar(contact.pushName)}
														/>
														<ListItemText primary={contact.pushName} secondary={contact.id.replace('@s.whatsapp.net', '')} />
													</Box>
												</div>
												<Stack direction="row" alignItems="center" sx={{ top: 8, right: 8, position: 'absolute' }}>
													<Checkbox
														checked={selected}
														icon={<Iconify icon="eva:radio-button-off-fill" />}
														checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
														inputProps={{ id: `favorite-checkbox-${contact.id}`, 'aria-label': `Favorite checkbox` }}
														sx={{ width: 1, height: 1 }}
													/>
												</Stack>
											</Paper>
										)
									})}
								</Box>


							</Collapse>
						</motion.div>

						{!!currentContact?.length && (
							<ContactsActionSelected
								numSelected={currentContact.length}
								rowCount={currentContact.length}
								selected={currentContact}
								action={
									<Button
										color="primary"
										size="small"
										variant="contained"
										startIcon={<Iconify icon="solar:share-bold" />}
										onClick={handleOpenShareDialog}
									>
										Compartir
									</Button>
								}
							/>
						)}
					</Box>
				</div>
			</Paper>

			<ShareDialog
				open={share}
				inviteEmail={inviteEmail}
				onChangeInvite={handleChangeInvite}
				onClose={() => {
					handleCloseShareDialog()
				}}
			/>

		</div>
	);
}

export default withReducer('whatsApp', reducer)(ModernPricingPage);
