import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { ChangeEvent, MouseEvent, useMemo, useState } from 'react';
import { useAppDispatch } from 'app/store/store';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { OutlinedInput } from '@mui/material';
import Hidden from '@mui/material/Hidden';
import { useParams } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import { useSelector } from 'react-redux';
import MailListTitle from './MailListTitle';
import {
	useApplyMailboxMailActionMutation,
	useGetMailboxFoldersQuery,
	useGetMailboxLabelsQuery,
	useGetMailboxMailsQuery
} from '../MailboxApi';
import { selectSearchText, setSearchText } from '../store/searchTextSlice';
import { deselectAllMails, selectSelectedMailIds, setSelectedMailIds } from '../store/selectedMailIdsSlice';
import _ from '../../../../../@lodash/@lodash';

type MailToolbarProps = {
	onToggleLeftSidebar: () => void;
};

type MenuType = {
	select: null | HTMLElement;
	folders: null | HTMLElement;
	labels: null | HTMLElement;
};

/**
 * The mail toolbar.
 */
function MailToolbar(props: MailToolbarProps) {
	const { onToggleLeftSidebar } = props;
	const dispatch = useAppDispatch();

	const routeParams = useParams();

	const { data: mails, isLoading: isMailsLoading } = useGetMailboxMailsQuery(routeParams);
	const mailIds = mails?.map((mail) => mail.id);
	const { data: folders, isLoading: isFoldersLoading } = useGetMailboxFoldersQuery();
	const { data: labels, isLoading: isLabelsLoading } = useGetMailboxLabelsQuery();

	const [setActionToMails] = useApplyMailboxMailActionMutation();

	const searchText = useSelector(selectSearchText);

	const { t } = useTranslation('mailboxApp');

	const selectedMailIds = useSelector(selectSelectedMailIds);

	const trashFolderId = useMemo(() => _.find(folders, { slug: 'trash' })?.id, [folders]);

	const defaultMenuState = {
		select: null,
		folders: null,
		labels: null
	};
	const [menu, setMenu] = useState<MenuType>(defaultMenuState);

	function handleMenuOpen(event: MouseEvent<HTMLButtonElement>, _menu: string) {
		setMenu({
			...menu,
			[_menu]: event.currentTarget
		});
	}

	function handleMenuClose() {
		setMenu(defaultMenuState);
	}

	function handleCheckChange(event: ChangeEvent<HTMLInputElement>) {
		return event.target.checked ? handleSelectAll() : handleDeselectAll();
	}

	function handleSelectAll() {
		dispatch(setSelectedMailIds(mailIds));
		handleMenuClose();
	}

	function handleDeselectAll() {
		dispatch(deselectAllMails());
		handleMenuClose();
	}

	function handleSelectByParameter(parameter: string, value: boolean) {
		const selectedMails = mails.filter((mail) => {
			const entityParameter = mail[parameter] as boolean;

			return entityParameter ? entityParameter === value : false;
		});

		const newMailIds = selectedMails.map((mail) => mail.id);

		dispatch(setSelectedMailIds(newMailIds));

		handleMenuClose();
	}

	if (isMailsLoading || isFoldersLoading || isLabelsLoading) {
		return <FuseLoading />;
	}

	return (
		<div className="sticky top-0 z-10">
			<Box
				sx={{ backgroundColor: 'background.default' }}
				className="flex items-center w-full min-h-64 py-12 sm:py-0 space-x-8 px-8 border-b "
			>
				<div className="flex items-center">
					<Hidden lgUp>
						<IconButton
							onClick={() => onToggleLeftSidebar()}
							aria-label="open left sidebar"
							size="small"
						>
							<FuseSvgIcon>heroicons-outline:menu</FuseSvgIcon>
						</IconButton>
					</Hidden>

					<MailListTitle />
				</div>

				<OutlinedInput
					className="flex flex-1 items-center px-16 rounded-full"
					fullWidth
					placeholder={t('SEARCH_PLACEHOLDER')}
					value={searchText}
					onChange={(ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
					startAdornment={
						<InputAdornment position="start">
							<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
						</InputAdornment>
					}
					inputProps={{
						'aria-label': 'Search'
					}}
					size="small"
				/>
			</Box>

			<Box
				className="flex items-center w-full min-h-56 px-8 border-b space-x-8"
				sx={{ backgroundColor: 'background.paper' }}
			>
				<Checkbox
					onChange={handleCheckChange}
					checked={selectedMailIds?.length === mails?.length && selectedMailIds?.length > 0}
					indeterminate={selectedMailIds?.length !== mails?.length && selectedMailIds?.length > 0}
					size="small"
				/>

				<IconButton
					size="small"
					aria-label="More"
					aria-haspopup="true"
					onClick={(ev) => handleMenuOpen(ev, 'select')}
				>
					<FuseSvgIcon size={16}>heroicons-outline:chevron-down</FuseSvgIcon>
				</IconButton>

				<Menu
					id="select-menu"
					anchorEl={menu.select}
					open={Boolean(menu.select)}
					onClose={handleMenuClose}
				>
					<MenuItem onClick={handleSelectAll}>All</MenuItem>
					<MenuItem onClick={handleDeselectAll}>None</MenuItem>
					<MenuItem
						onClick={() => {
							handleSelectByParameter('unread', false);
						}}
					>
						Read
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleSelectByParameter('unread', true);
						}}
					>
						Unread
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleSelectByParameter('starred', true);
						}}
					>
						Starred
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleSelectByParameter('starred', false);
						}}
					>
						Unstarred
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleSelectByParameter('important', true);
						}}
					>
						Important
					</MenuItem>
					<MenuItem
						onClick={() => {
							handleSelectByParameter('important', false);
						}}
					>
						Unimportant
					</MenuItem>
				</Menu>

				{selectedMailIds.length > 0 && (
					<>
						<div className="border-r-1 h-32 w-1 mx-12 my-0" />

						<Tooltip title="Delete">
							<IconButton
								onClick={() => {
									setActionToMails({
										type: 'folder',
										value: trashFolderId,
										ids: selectedMailIds
									});
								}}
								aria-label="Delete"
								size="small"
							>
								<FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
							</IconButton>
						</Tooltip>

						<Tooltip title="Move to folder">
							<IconButton
								aria-label="More"
								aria-haspopup="true"
								onClick={(ev) => handleMenuOpen(ev, 'folders')}
								size="small"
							>
								<FuseSvgIcon>heroicons-outline:folder</FuseSvgIcon>
							</IconButton>
						</Tooltip>

						<Menu
							id="folders-menu"
							anchorEl={menu.folders}
							open={Boolean(menu.folders)}
							onClose={handleMenuClose}
						>
							{folders.length > 0 &&
								folders.map((folder) => (
									<MenuItem
										onClick={() => {
											setActionToMails({
												type: 'folder',
												value: folder.id,
												ids: selectedMailIds
											});
											handleMenuClose();
										}}
										key={folder.id}
									>
										{folder.title}
									</MenuItem>
								))}
						</Menu>

						<Tooltip title="Add label">
							<IconButton
								aria-label="label"
								aria-haspopup="true"
								onClick={(ev) => handleMenuOpen(ev, 'labels')}
								size="small"
							>
								<FuseSvgIcon>heroicons-outline:tag</FuseSvgIcon>
							</IconButton>
						</Tooltip>

						<Menu
							id="labels-menu"
							anchorEl={menu.labels}
							open={Boolean(menu.labels)}
							onClose={() => handleMenuClose()}
						>
							{labels.length > 0 &&
								labels.map((label) => (
									<MenuItem
										onClick={() => {
											setActionToMails({
												type: 'label',
												value: label.id,
												ids: selectedMailIds
											});

											handleMenuClose();
										}}
										key={label.id}
									>
										{label.title}
									</MenuItem>
								))}
						</Menu>

						<Tooltip title="Mark as unread">
							<IconButton
								onClick={() => {
									setActionToMails({ type: 'unread', value: true, ids: selectedMailIds });
								}}
								aria-label="Mark as unread"
								size="small"
							>
								<FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
							</IconButton>
						</Tooltip>

						<Tooltip title="Set important">
							<IconButton
								onClick={() => {
									setActionToMails({ type: 'important', value: true, ids: selectedMailIds });
								}}
								aria-label="important"
								size="small"
							>
								<FuseSvgIcon className="text-red-600 dark:text-red-500">
									heroicons-outline:exclamation-circle
								</FuseSvgIcon>
							</IconButton>
						</Tooltip>

						<Tooltip title="Set starred">
							<IconButton
								onClick={() => {
									setActionToMails({ type: 'starred', value: true, ids: selectedMailIds });
								}}
								aria-label="important"
								size="small"
							>
								<FuseSvgIcon className="text-orange-500 dark:text-red-400">
									heroicons-outline:star
								</FuseSvgIcon>
							</IconButton>
						</Tooltip>
					</>
				)}
			</Box>
		</div>
	);
}

export default MailToolbar;
