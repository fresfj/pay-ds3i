import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import IconButton from '@mui/material/IconButton';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import Button from '@mui/material/Button';
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import Box from '@mui/system/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { calculateTotalItemsSelector, calculateTotalSelector, decrementQuantity, incrementQuantity, itemsCartSelector, removeFromCart } from '../store/cartSlice';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import FuseUtils from '@fuse/utils/FuseUtils';

import { useAppDispatch } from 'app/store/store';
import { Iconify } from '@fuse/components/iconify';
import { Link, useLocation, useParams } from 'react-router-dom';
import { IncrementerButton } from '../components/IncrementerButton';
import { Label } from '@fuse/components/label/label';
import { ColorPreview } from '@fuse/components/color-utils';
import { useTranslation } from 'react-i18next';

type propsOpen = {
	onOpen: (newValue: boolean) => void
}
/**
 * The contacts sidebar content.
 */
function ContactsSidebarContent({ onOpen }: propsOpen) {
	const cart = useSelector(itemsCartSelector);
	const total = useSelector(calculateTotalSelector)
	const totalItems = useSelector(calculateTotalItemsSelector);
	const { t } = useTranslation('shopApp');
	const dispatch = useAppDispatch();
	const location = useLocation();
	const firstPart = location.pathname.split('/')[1]

	const handleIncrement = (itemId) => {
		dispatch(incrementQuantity(itemId));
	};

	const handleDecrement = (itemId) => {
		dispatch(decrementQuantity(itemId));
	};

	const handleRemove = (itemId) => {
		dispatch(removeFromCart(itemId));
	};

	return (
		<Box className="flex flex-col flex-auto max-w-full w-md" sx={{ display: 'flex', flexDirection: 'column', height: '100vh', p: 4 }}>
			<IconButton
				className="absolute top-0 right-0 my-16 mx-32 z-10"
				size="large"
				onClick={() => onOpen(false)}
			>
				<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
			</IconButton>

			<Box sx={{ flex: '0 1 auto', position: 'relative' }}>
				<Typography variant="h5">
					{t('CART')}
					<Typography component="span" sx={{ color: 'text.secondary' }}>
						&nbsp;(
						{totalItems} item)
					</Typography>
				</Typography>
			</Box>
			<Box sx={{ flex: '1 1 auto', overflowY: 'auto', mt: 4 }} >
				<Stack spacing={2} mb={4} divider={<Divider orientation="horizontal" flexItem />}>
					{cart?.products?.map((row) => (
						<Stack key={row.id} spacing={2} direction="row" alignItems="center">
							<Avatar
								variant="rounded"
								alt={row.name}
								src={_.find(row.images, { id: row.featuredImageId })?.url}
								sx={{ width: 80, height: 80 }}
							/>

							<Stack spacing={2} direction="column" justifyContent="space-between" sx={{ width: '100vw' }}>
								<Stack spacing={0.5}>
									<Typography noWrap variant="h4" className='text-lg font-medium' sx={{ width: { md: 'auto', xs: 190 } }}>
										{row.name}
									</Typography>
									{row?.sizes &&
										<Stack
											direction="row"
											alignItems="center"
											sx={{ typography: 'body2', color: 'text.secondary' }}>
											size: <Label sx={{ ml: 0.5, textTransform: 'uppercase' }}> {row.sizes} </Label>
											<Divider orientation="vertical" sx={{ mx: 1, height: 16 }} />
											<ColorPreview sx={{ ml: 0.5 }} colors={row.colors} />
										</Stack>
									}
								</Stack>

								<Stack
									direction="row"
									justifyContent="space-between"
									alignItems="center"
									sx={{ typography: 'body2', color: 'text.secondary' }}
								>
									<Typography noWrap variant="subtitle2" className='text-lg font-semibold'>
										{FuseUtils.formatCurrency(row.value)}
									</Typography>
									<IncrementerButton
										quantity={row.quantity}
										onRemovase={() => handleRemove(row.id)}
										onDecrease={() => handleDecrement(row.id)}
										onIncrease={() => handleIncrement(row.id)}
										disabledDecrease={row.quantity <= 1}
										disabledIncrease={row.quantity >= row.available}
									/>
								</Stack>
							</Stack>
						</Stack>
					))}
					<Stack spacing={2}
						direction="row"
						alignItems="center"
						component={Link}
						to={firstPart === 'apps' ? '/apps/shop/products' : '/product'}
					>
						<Box display="flex" justifyContent="center" alignItems="center" border="1px dashed #ccc" borderRadius={2}
							sx={{ width: 80, height: 80 }}
						>
							<Iconify className='text-grey-700' icon="eva:plus-fill" width={34} />
						</Box>

						<Typography noWrap variant="h4" className='text-lg font-medium no-underline hover:underline'>
							{t('SEE_MORE_PRODUCT')}
						</Typography>
					</Stack>
				</Stack>

			</Box>
			<Box
				className="flex items-center py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
				sx={{ flex: '0 1 auto' }}
			>
				<Box className="flex flex-col flex-auto" sx={{ display: 'flex', flexDirection: 'column' }}>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography
							component="span"
							variant="body2"
							sx={{ flexGrow: 1, color: 'text.secondary' }}
						>
							{t('DISCOUNT')}
						</Typography>
						<Typography component="span" variant="subtitle2">
							{cart.discount.value ? FuseUtils.formatCurrency(-cart.discount.value) : '-'}
						</Typography>
					</Box>
					<Box display="flex" justifyContent="space-between" alignItems="center">
						<Typography variant="subtitle1" className='text-xl font-semibold'>{t('TOTAL')}</Typography>
						<Typography variant="h6" fontWeight="bold">{FuseUtils.formatCurrency(total)}</Typography>
					</Box>
					<Box display="flex" justifyContent="center" mt={2}>
						<Button
							className="ml-8 text-xl py-8 transition duration-300 ease-in-out hover:scale-105"
							variant="contained"
							color="secondary"
							fullWidth
							component={Link}
							to={firstPart === 'apps' ? '/apps/shop/checkout' : '/product/checkout'}
						>
							{t('BUY_NOW')}
						</Button>
					</Box>
				</Box>
			</Box>
		</Box>
	);
}

export default ContactsSidebarContent;
