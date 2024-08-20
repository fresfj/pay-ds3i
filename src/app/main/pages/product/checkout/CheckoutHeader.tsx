import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useAppDispatch } from 'app/store/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { resetSearchText } from '../store/searchTextSlice';
import { calculateTotalItemsSelector, itemsCartSelector } from '../store/cartSlice';
import { useTranslation } from 'react-i18next';
import Slide from '@mui/material/Slide';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { Iconify } from '@fuse/components/iconify';
import _ from '@lodash';
import { Dialog, DialogTitle, DialogContent, IconButton, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider, Portal, Stack, Box, Badge } from '@mui/material';
import { Link } from 'react-router-dom';
import FuseUtils from '@fuse/utils';

interface Props {
	isMobile?: boolean;
}

/**
 * The products header.
 */
function ProductsHeader({ isMobile }: Props) {
	const dispatch = useAppDispatch();
	const totalItems = useSelector(calculateTotalItemsSelector);
	const [open, setOpen] = useState(false);
	const { products, discount, subTotal, total, shipping } = useSelector(itemsCartSelector);

	const { t } = useTranslation('shopApp');
	const displayShipping = shipping.value !== null ? 'Free' : '-';


	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	useEffect(() => {
		return () => {
			dispatch(resetSearchText());
		};
	}, [totalItems]);

	return (
		<>
			{isMobile &&
				<>
					<Portal>
						<AppBar sx={{ zIndex: 9999 }} onClick={handleClickOpen} style={{ cursor: 'pointer' }}>
							<Toolbar className='flex-1 w-full justify-between'>
								<Typography variant="body1" component="div">
									<Iconify icon={open ? `uiw:up` : `uiw:down`} width={18} className='mr-4' />
									Resumo da compra
								</Typography>
								<Typography variant="body1" component="div">
									{FuseUtils.formatCurrency(total)}
								</Typography>
							</Toolbar>
						</AppBar>
					</Portal>
					<Dialog
						open={open}
						onClose={handleClose}
						componentsProps={{ backdrop: { style: { top: 55 } } }}
						sx={{
							zIndex: (theme) => theme.zIndex.appBar - 99,
							'& .MuiModal-root': {
								zIndex: (theme) => theme.zIndex.appBar
							},
							'& .MuiDialog-paper': {
								borderRadius: 0,
								width: '100vw',
								position: 'absolute',
								top: 56,
								margin: 0,
								zIndex: (theme) => theme.zIndex.appBar - 99
							}
						}}
					>
						<DialogContent dividers sx={{ px: 2 }}>
							<Stack spacing={2.5} mb={4} mt={2}>
								{products.length > 0 && products?.map((row) => (
									<Stack spacing={2} direction="row" alignItems="center">
										<Badge badgeContent={row.quantity} color="secondary">
											<Avatar
												variant="rounded"
												alt={row.name}
												src={_.find(row.images, { id: row.featuredImageId })?.url}
												sx={{ width: 64, height: 64 }}
											/>
										</Badge>
										<Stack spacing={0.5}>
											<Typography noWrap variant="subtitle2" sx={{ width: { md: 340, xs: 220 } }}>
												{row.name}
											</Typography>

											<Stack
												direction="row"
												alignItems="center"
												sx={{ typography: 'body2', color: 'text.secondary' }}
											>
												{FuseUtils.formatCurrency(row.value)}
											</Stack>
										</Stack>
									</Stack>
								))}

								<Link
									color="text.primary"
									to={`/product`}
									style={{ textDecoration: 'none' }}
								>
									<Stack spacing={2} direction="row" alignItems="center">
										<Box
											display="flex"
											alignItems={'center'}
											justifyContent={'center'}
											sx={{ width: 64, height: 64 }}
										>
											<Iconify icon="solar:add-square-line-duotone" width={64} height={64} />
										</Box>
										<Stack spacing={0.5}>
											<Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }} className='no-underline hover:underline'>
												Adicionar mais produtos
											</Typography>
										</Stack>
									</Stack>
								</Link>
							</Stack>
							<Stack spacing={0.5}>
								<Box display="flex">
									<Typography
										component="span"
										variant="body2"
										sx={{ flexGrow: 1, color: 'text.secondary' }}
									>
										{t('SUBTOTAL')}
									</Typography>
									<Typography component="span" variant="subtitle2">
										{FuseUtils.formatCurrency(subTotal)}
									</Typography>
								</Box>

								<Box display="flex">
									<Typography
										component="span"
										variant="body2"
										sx={{ flexGrow: 1, color: 'text.secondary' }}
									>
										{t('DISCOUNT')}
									</Typography>
									<Typography component="span" variant="subtitle2">
										{discount.value ? FuseUtils.formatCurrency(-discount.value) : '-'}
									</Typography>
								</Box>

								<Box display="flex">
									<Typography
										component="span"
										variant="body2"
										sx={{ flexGrow: 1, color: 'text.secondary' }}
									>
										{t('SHIPPING')}
									</Typography>
									<Typography component="span" variant="subtitle2">
										{shipping.value ? FuseUtils.formatCurrency(shipping.value) : displayShipping}
									</Typography>
								</Box>

								<Divider sx={{ borderStyle: 'dashed' }} />

								<Box display="flex">
									<Typography component="span" variant="subtitle1" sx={{ flexGrow: 1 }}>
										{t('TOTAL')}
									</Typography>

									<Box sx={{ textAlign: 'right' }}>
										<Typography
											component="span"
											variant="subtitle1"
											sx={{ display: 'block', color: 'error.main' }}
										>
											{FuseUtils.formatCurrency(total)}
										</Typography>
									</Box>
								</Box>
							</Stack>
						</DialogContent>
					</Dialog>
				</>
			}
			<div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 flex-1 w-full justify-between py-32 px-24 md:px-32">
				<div className="flex flex-col space-y-8 sm:space-y-0">
					<motion.span
						className="flex items-end"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.2 } }}
					>
						<Typography
							className="text-20 md:text-32 font-extrabold tracking-tight leading-none"
							role="button"
						>{t('CHECKOUT')}</Typography>
					</motion.span>
					{/* {totalItems > 0 && (
					<motion.span
						initial={{ y: -20, opacity: 0 }}
						animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					>
						<Typography
							className="text-14 font-medium mx-2"
							color="text.secondary"
						>
							{t('PRODUCTS_IN_CART', { total: totalItems })}
						</Typography>
					</motion.span>
				)} */}
				</div>
			</div>
		</>
	);
}

export default ProductsHeader;
