import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { changeLanguage, LanguageType, selectCurrentLanguage, selectLanguages } from 'app/store/i18nSlice';
import { useAppDispatch } from 'app/store/store';
import IconButton from '@mui/material/IconButton';
import { m } from 'framer-motion';
import { usePopover, CustomPopover } from '@fuse/components/custom-popover';
import { varHover } from '@fuse/components/animate';
import { FlagIcon } from '@fuse/components/iconify';
import MenuList from '@mui/material/MenuList';

/**
 * The language switcher.
 */
function LanguageSwitcher() {
	const currentLanguage = useSelector(selectCurrentLanguage);
	const languages = useSelector(selectLanguages);
	const [menu, setMenu] = useState<null | HTMLElement>(null);
	const dispatch = useAppDispatch();

	const langMenuClick = (event: React.MouseEvent<HTMLElement>) => {
		setMenu(event.currentTarget);
	};

	const langMenuClose = () => {
		setMenu(null);
	};

	function handleLanguageChange(lng: LanguageType) {
		dispatch(changeLanguage(lng.id));

		langMenuClose();
	}

	const popover = usePopover();

	return (
		<>
			<IconButton
				className="h-40"
				onClick={langMenuClick}

				component={m.button}
				whileTap="tap"
				whileHover="hover"
				variants={varHover(1.05)}
				sx={{
					p: 0,
					width: 40,
					height: 40,
					...(popover.open && { bgcolor: 'action.selected' })
				}}
			>
				<FlagIcon code={currentLanguage.flag} />
			</IconButton>

			<CustomPopover
				open={Boolean(menu)}
				anchorEl={menu}
				onClose={langMenuClose}
			>
				<MenuList sx={{ width: 160, minHeight: 72 }}>
					{languages.map((lng) => (
						<MenuItem
							key={lng.id}
							onClick={() => handleLanguageChange(lng)}
							selected={lng.id === currentLanguage.id}
						>
							<ListItemIcon className="min-w-40">
								<FlagIcon code={lng.flag} />
							</ListItemIcon>
							<ListItemText primary={lng.title} />
						</MenuItem>
					))}
				</MenuList>
			</CustomPopover>
		</>
	);
}

export default LanguageSwitcher;
