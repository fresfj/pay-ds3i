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

type ContactsProps = {
	contacts?: any[]
	data?: any[]
	all?: number
	onChangeContact: (id: string, name: string, owner: string) => void
	onSelectAll?: () => void
};

/**
 * The ContactsList component.
 */
function ContactsList({ contacts, data, all, onSelectAll, onChangeContact }: ContactsProps) {
	const [share, setShare] = useState(false);
	const containerRef = useRef(null);

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
						{data.slice(0, visibleCount).map((contact, index) => {
							const selected = contacts.some(selectedContact => selectedContact.id === contact.id);
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
										bgcolor: 'rgb(248 250 252)',
										border: '1px solid transparent',
										flexDirection: 'column',
										alignItems: 'flex-start',
										...((selected) && {
											bgcolor: 'background.paper',
											border: '1px solid rgb(203 213 225)',
											boxShadow: theme.customShadows.z20,
										})
									}}
									onClick={() => onChangeContact(contact.id, contact.pushName, contact.owner)}
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

			{!!contacts?.length && (
				<ContactsActionSelected
					all={all}
					numSelected={contacts.length}
					rowCount={contacts.length}
					selected={contacts}
					onSelectAllItems={onSelectAll}
					action={
						<Button
							color="secondary"
							size="large"
							variant="contained"
							startIcon={<Iconify icon="solar:share-bold" />}
							onClick={handleOpenShareDialog}
						>
							Compartilhar
						</Button>
					}
				/>
			)}

			<ShareDialog
				open={share}
				selected={contacts}
				inviteEmail={inviteEmail}
				onChangeInvite={handleChangeInvite}
				onClose={() => {
					handleCloseShareDialog()
				}}
			/>
		</Box>
	);
}

export default ContactsList;
