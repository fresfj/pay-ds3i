import FusePageSimple from '@fuse/core/FusePageSimple';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useCallback, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import ContactsHeader from './modern/ContactsHeader';
import { useBoolean } from '@fuse/hooks/use-boolean';
import axios from 'axios';
import FuseUtils from '@fuse/utils';
import { useSelector } from 'react-redux';
import { selectFilteredContactList, selectGroupedFilteredContacts } from './WhatsappApi';
import ContactsList from './ContactsList';
import withReducer from 'app/store/withReducer';
import reducer from './store';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

/**
 * The WhatsappApp page.
 */
function WhatsappApp() {

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
	const [currentContact, setCurrentContact] = useState<any[]>([]);
	const [selectContact, setSelectContact] = useState<any>();
	const [share, setShare] = useState(false);
	const containerRef = useRef(null);


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
		<Root
			header={<ContactsHeader
				count={filteredData.length}
				onSelectAll={handleSelectAll}
				selectedAll={currentContact.length === contacts.length ? false : true}
			/>}
			content={
				<div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
					<ContactsList
						data={filteredData}
						contacts={currentContact}
						onChangeContact={onChangeContact}
					/>
				</div>
			}
		/>
	);
}

export default withReducer('whatsApp', reducer)(WhatsappApp);