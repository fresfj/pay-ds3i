import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useAppDispatch } from 'app/store/store';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { ChangeEvent, useEffect, useState } from 'react';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useSelector } from 'react-redux';
import { resetSearchText, selectSearchText, setSearchText } from '../store/searchTextSlice';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { Iconify } from '@fuse/components/iconify';
import Stack from '@mui/material/Stack';
import FuseUtils from '@fuse/utils';

/**
 * The contacts header.
 */

type ContactsItemProps = {
	count?: number;
	onSelectAll: () => void
	selectedAll: boolean
};

function ContactsHeader({ count, onSelectAll, selectedAll }: ContactsItemProps) {
	const dispatch = useAppDispatch();
	const searchText = useSelector(selectSearchText);

	useEffect(() => {
		return () => {
			dispatch(resetSearchText());
		};
	}, []);

	return (
		<div className="p-24 sm:p-32 w-full">
			<div className="flex flex-col">
				<motion.span
					initial={{ x: -20 }}
					animate={{ x: 0, transition: { delay: 0.2 } }}
				>
					<Typography className="text-24 md:text-32 font-extrabold tracking-tight leading-none">
						Contatos
					</Typography>
				</motion.span>
				<motion.span
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
				>
					<Typography
						component={motion.span}
						className="text-14 font-medium ml-2"
						color="text.secondary"
					>
						{`você tem ${count} ${count === 1 ? `Contato` : `Contatos`}`}
						{` e você poderá ganhar até ${FuseUtils.formatCurrency(count * 20)} com indicações.`}
					</Typography>
				</motion.span>
			</div>
			<div className="flex flex-1 items-center mt-16 -mx-8">

				<Box
					component={motion.div}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 rounded-full"
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
						value={searchText}
						inputProps={{
							'aria-label': 'Search'
						}}
						onChange={(ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
					/>
				</Box>
				<Stack direction="row" alignItems="center" ml={2}>
					{/* <div className='w-40'>
						<Checkbox
							onClick={onSelectAll}
							checked={!selectedAll}
							icon={<Iconify icon="eva:radio-button-off-fill" />}
							checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
							sx={{ width: 1, height: 1 }}
						/>
					</div> */}
					<Button
						onClick={onSelectAll}
						className="px-12 text-lg whitespace-nowrap"
						color="secondary"
						variant="contained"
						endIcon={
							selectedAll ? <Iconify icon="eva:radio-button-off-fill" /> : <Iconify icon="eva:checkmark-circle-2-fill" />
						}
					>
						{selectedAll ? 'Desmarcar todos' : 'Selecionar todos'}
					</Button>
				</Stack>
			</div>
		</div>
	);
}

export default ContactsHeader;
