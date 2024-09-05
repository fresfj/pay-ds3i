import FusePageSimple from '@fuse/core/FusePageSimple';
import { useCallback, useRef, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import ContactsHeader from './ContactsHeader';
import { useSelector } from 'react-redux';
import { selectFilteredContactList, selectGroupedFilteredContacts } from './WhatsappApi';
import ContactsList from './ContactsList';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import { contactsSelector } from './store/InstanceSlice';
import { InstanceDialog } from './components/InstanceDialog';

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
	const contacts = useSelector(contactsSelector);
	const filteredData = useSelector(selectFilteredContactList(contacts));

	const groupedFilteredCustomers = useSelector(selectGroupedFilteredContacts(filteredData));
	const [currentContact, setCurrentContact] = useState<any[]>([]);
	const [share, setShare] = useState(contacts?.length === 0 ? true : false);
	const [inviteEmail, setInviteEmail] = useState('');

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

	const onChangeContact = useCallback(
		(contactId: string, contactName: string, contactOwner: string) => {
			setCurrentContact(prevSelected =>
				prevSelected.some(contact => contact.id === contactId)
					? prevSelected.filter(contact => contact.id !== contactId)
					: [...prevSelected, { id: contactId, name: contactName, owner: contactOwner }]
			);
		},
		[]
	);

	const handleSelectAll = () => {
		if (currentContact.length === contacts.length) {
			setCurrentContact([]);
		} else {
			setCurrentContact(contacts.map(contact => ({
				id: contact.id,
				name: contact.pushName,
				owner: contact.owner
			})));
		}
	};

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

	if (contacts?.length === 0) {
		return (
			<InstanceDialog
				open={share}
				inviteEmail={inviteEmail}
				onChangeInvite={handleChangeInvite}
				onClose={() => { handleCloseDialog() }}
			/>
		)
	}
	return (
		<Root
			header={<ContactsHeader
				count={filteredData.length}
				onSelectAll={handleSelectAll}
				onOpenSettings={handleOpenDialog}
				selectedAll={currentContact.length === contacts?.length ? false : true}
			/>}
			content={
				<div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
					<ContactsList
						data={filteredData}
						all={contacts?.length}
						contacts={currentContact}
						onChangeContact={onChangeContact}
						onSelectAll={handleSelectAll}
					/>
					<InstanceDialog
						open={share}
						inviteEmail={inviteEmail}
						onChangeInvite={handleChangeInvite}
						onClose={() => { handleCloseDialog() }}
					/>
				</div>
			}
		/>
	);
}

export default withReducer('whatsApp', reducer)(WhatsappApp);