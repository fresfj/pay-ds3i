import FusePageSimple from '@fuse/core/FusePageSimple';
import { useCallback, useRef, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import * as React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import ContactsHeader from './ContactsHeader';
import { useSelector } from 'react-redux';
import { selectFilteredContactList, selectFilteredGroupList } from './WhatsappApi';
import ContactsList from './ContactsList';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import { contactsSelector, groupsSelector } from './store/InstanceSlice';
import { InstanceDialog } from './components/InstanceDialog';
import GroupsHeader from './GroupsHeader';
import GroupsList from './GroupsList';

const Root = styled(FusePageSimple)(({ theme }) => ({
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		boxShadow: `inset 0 0 0 1px  ${theme.palette.divider}`
	}
}));

/**
 * The WhatsGroupApp page.
 */
function WhatsGroupApp() {
	const groups = useSelector(groupsSelector);
	const filteredData = useSelector(selectFilteredGroupList(groups));

	const [currentGroup, setCurrentGroup] = useState<any[]>([]);
	const [share, setShare] = useState(groups?.length === 0 ? true : false);
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

	const onChangeGroup = useCallback(
		(contactId: string, contactName: string, contactOwner: string, size: number) => {
			setCurrentGroup(prevSelected =>
				prevSelected.some(contact => contact.id === contactId)
					? prevSelected.filter(contact => contact.id !== contactId)
					: [...prevSelected, { id: contactId, name: contactName, owner: contactOwner, size }]
			);
		},
		[]
	);

	const handleSelectAll = () => {
		if (currentGroup.length === groups.length) {
			setCurrentGroup([]);
		} else {
			setCurrentGroup(groups.map(contact => ({
				id: contact.id,
				name: contact.pushName,
				owner: contact.owner,
				size: contact.size
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


	return (
		<Root
			header={<GroupsHeader onOpenSettings={handleOpenDialog} />}
			content={
				<div className="w-full p-12 pt-16 sm:pt-24 lg:ltr:pr-0 lg:rtl:pl-0">
					<GroupsList
						data={filteredData}
						all={groups?.length}
						groups={currentGroup}
						onChangeContact={onChangeGroup}
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

export default withReducer('whatsApp', reducer)(WhatsGroupApp);