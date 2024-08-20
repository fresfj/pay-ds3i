import React, { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import FuseLoading from '@fuse/core/FuseLoading';
import _ from '@lodash';
import CardActions from '@mui/material/CardActions';
import { Divider, Grid, Paper, Box, Stack } from '@mui/material';
import { Image } from '@fuse/components/image'
import { Iconify } from '@fuse/components/iconify'

import FormNewCard from '../../components/dialogs/FormNewCard';
import FormNewAddress from '../../components/dialogs/FormNewAddress';
import InvoiceHistory from '../../components/InvoiceHistory';
import AlertDialog from '../../components/dialogs/AlertDialog';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useAppDispatch } from 'app/store/store';
import FuseUtils from '@fuse/utils/FuseUtils';
import AddressOption from '../../components/AddressOption';
import PaymentOption from '../../components/PaymentOption';
import BillingEmpty from '../../components/BillingEmpty';
import { useTranslation } from 'react-i18next'

const plans = [
	{
		id: 'white',
		title: 'Plano White',
		price: "99,90",
		img: 'https://firebasestorage.googleapis.com/v0/b/pay-checkout.appspot.com/o/images%2Fccc7f04a.jpg?alt=media&token=8fe3b555-3614-4aa3-b2c2-c1ae560f7d03'
	},
	{
		id: 'purple',
		title: 'Plano Purple',
		price: "139,90",
		img: 'https://firebasestorage.googleapis.com/v0/b/pay-checkout.appspot.com/o/images%2F9fe06885.jpg?alt=media&token=4c6a2101-7f73-4230-8a3f-165884cc9dd3'
	},
	{
		id: 'black',
		title: 'Plano Black',
		price: "179,90",
		img: 'https://firebasestorage.googleapis.com/v0/b/pay-checkout.appspot.com/o/images%2Ff015304d.jpg?alt=media&token=70bb0639-690f-499a-af64-561b9264ea59'
	}
]

const PlanCard = ({ title, price, icon, onSelect, selected, planAt = false }) => {
	return (
		<Grid item xs={12} md={4} className={`transition duration-150 ease-in-out ${planAt ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
			<Paper variant="outlined"
				className='relative transition-transform shadow-md border-solid border-1 border-gray-500/[.15] px-22'
				sx={{ borderRadius: '12px', p: 2, border: selected ? '2px solid #007867 !important' : '2px solid transparent', }}
				onClick={() => planAt ? null : onSelect()}
			>
				{planAt && (
					<div
						className="absolute transition-all min-w-28 h-28 text-sm capitalize font-bold inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-green-800 ring-1 ring-inset ring-green-600/20"
						style={{
							lineHeight: '0',
							alignItems: 'center',
							whiteSpace: 'nowrap',
							display: 'inline-flex',
							justifyContent: 'center',
							padding: '0px 6px',
							transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
							top: '8px',
							right: '8px',
						}}
					>
						<Iconify icon={'solar:medal-star-square-bold'} sx={{ width: 18, height: 18 }} />
						Current
					</div>
				)}
				<Box sx={{ display: 'flex', justifyContent: 'left', mb: 4 }}>
					<Image
						className="rounded-lg"
						alt={title}
						src={icon}
						sx={{ width: 136, height: 136 }}
					/>
				</Box>
				<Box>
					<Typography variant="h4" component="h4" className="mb-4 text-xl">{title}</Typography>
				</Box>
				<Stack direction="row" alignItems="center" justifyContent="left">
					<Box><Typography variant="h6" component="h6" className="font-bold mb-4 text-3xl">{price}</Typography></Box>
					<Box>/mês</Box>
				</Stack>
			</Paper>
		</Grid>
	);
}

/**
 * The billing tab.
 */
function BillingTab(props) {
	const { user, updatePlan, updateUser } = props
	const [alert, setAlert] = useState(false);
	const [isValid, setIsValid] = useState(false);
	const formNewCardRef = useRef();
	const [selectedPlan, setSelectedPlan] = useState(null);
	const plan = plans.find((plan) => plan.id === selectedPlan)
	const { received, paymentMethods, addresses, subscriptions } = user?.data?.customer || {}
	const dispatch = useAppDispatch();
	const subscription = received?.filter(obj => obj.object === 'subscription' && obj.status === 'ACTIVE');
	const billingPayment = paymentMethods?.filter(obj => obj.paymentDefault);
	const billingAddress = addresses?.filter(obj => obj.addressDefault);
	const { logoUrl } = billingPayment?.[0]?.creditCard?.number ? FuseUtils.identifyCardBrand(billingPayment[0]?.creditCard?.number as string) : { logoUrl: undefined }
	const { t } = useTranslation('accountApp');

	const handlePlanSelect = (plan) => {
		setSelectedPlan(plan);
		setIsValid(true)
	};

	const handleUpgrade = () => {
		setIsValid(false)

		const data = {
			plan,
			id: received[0].id,
			received: received[0],
			customerId: user?.data?.customer.id,
			customer: user?.data?.customer.customerId,
			paymentMethod: billingPayment[0],
			updated: Boolean(billingPayment[0].creditCard.number.slice(-4) === received[0]?.creditCard?.creditCardNumber)
		}

		updatePlan(data).then((res: any) => {
			if (res.data) {
				updateUser({ data: { customer: { received: [res.data] } } });//data.customer.received
				dispatch(
					showMessage({
						message: 'Plan updated successfully',
						autoHideDuration: 6000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'success'
					}))
			} else {
				dispatch(
					showMessage({
						message: res.error.response.data.description,
						autoHideDuration: 6000,
						anchorOrigin: {
							vertical: 'top',
							horizontal: 'center'
						},
						variant: 'error'
					}))
			}
		})
	}

	const handleCancel = () => {
		setAlert(true)
	}

	if (!subscription) {
		return <BillingEmpty />;
	}

	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	useEffect(() => {
	}, [alert]);
	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			<div className="md:flex">
				<AlertDialog alert={alert} setAlert={setAlert} />
				<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">
								{t('PLAN')}
							</Typography>
						</div>
						<Grid container spacing={6} className="px-32 pt-24">
							{plans.map((item, index) => (
								<PlanCard key={index}
									planAt={Boolean(subscription[0]?.description === item.title)}
									title={item.title}
									price={item.price}
									icon={item.img}
									selected={selectedPlan === item.id}
									onSelect={() => handlePlanSelect(item.id)}
								/>
							))}
						</Grid>

						<CardContent className="px-24 md:px-32 py-24 w-full md:w-5/5">
							<div className="mb-14 mt-32 grid grid-cols-4 gap-x-16">
								<Typography className="col-start-1 col-end-5 md:col-auto font-semibold mb-4 text-15">{t('PLAN')}</Typography>
								<Typography className='col-start-1 col-end-5 md:col-span-3'>{plan ? plan.title : received[0]?.description}</Typography>
							</div>
							<div className="mb-14 grid grid-cols-4 gap-4">
								<Typography className="col-start-1 col-end-5 md:col-auto font-semibold mb-4 text-15">{t('B_NAME')}</Typography>
								<Typography className='col-start-1 col-end-5 md:col-span-3'>{billingAddress ? billingAddress[0]?.name : user.data?.customer.name}</Typography>
							</div>
							<div className="w-full mb-14 grid grid-cols-4 gap-x-16">
								<Typography className="col-start-1 col-end-5 md:col-auto font-semibold mb-4 text-15">{t('B_ANDDRESS')}</Typography>
								<Typography className='col-start-1 col-end-5 md:col-span-3'>{billingAddress ? billingAddress[0]?.addressFormatted?.address : user.data?.customer.shippingAddress.address}</Typography>
							</div>
							<div className="mb-14 grid grid-cols-4 gap-4">
								<Typography className="col-start-1 col-end-5 md:col-auto font-semibold mb-4 text-15">{t('B_PHONE_NUMBER')}</Typography>
								<Typography className='col-start-1 col-end-5 md:col-span-3'>{billingAddress ? billingAddress[0]?.phoneNumber : user.data?.customer.phoneNumbers[0].phoneNumber}</Typography>
							</div>
							<div className="mb-14 grid grid-cols-4 gap-4">
								<Typography className="col-start-1 col-end-5 md:col-auto font-semibold mb-4 text-15">{t('B_PAYMENT_METHOD')}</Typography>
								<div className='grid grid-cols-3 gap-2 content-center justify-start col-start-1 col-end-5 md:col-span-3'>
									<Typography className='flex items-center col-start-1 col-end-3 md:col-span-1'>
										<span className='mr-4'>**** **** ****</span>
										<span> {billingPayment ? billingPayment[0]?.creditCard.number.slice(-4) : received[0]?.creditCard.creditCardNumber}</span>
									</Typography>
									<Image sx={{ maxHeight: 32, maxWidth: 32 }} src={logoUrl ? logoUrl : FuseUtils.cardFlag(received[0]?.creditCard.creditCardBrand)} alt='card-credit' />
								</div>
							</div>
						</CardContent>
						<Divider className='border-dashed' />
						<CardActions className="flex justify-end p-24 w-full">
							<Button
								className="whitespace-nowrap"
								variant="outlined"
								color="error"
								onClick={handleCancel}
							>
								<span className="sm:flex mx-8">{t('CANCEL_PLAN')}</span>
							</Button>

							<Button
								className="whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={!isValid}
								onClick={handleUpgrade}
							>
								<span className="sm:flex mx-8">{t('UPGRADE_PLAN')}</span>
							</Button>
						</CardActions>
					</Card>

					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24 flex items-center">
							<Typography className="flex flex-1 text-2xl font-semibold leading-tight">
								{t('PAYMENT_METHOD')}
							</Typography>
							<div className="-mx-8">
								<FormNewCard ref={formNewCardRef} user={user} updateUser={updateUser} />
							</div>
						</div>
						<CardContent className="px-24 md:px-32 py-24 mb-28">
							<Stack direction={{ xs: 'column', md: 'row' }} className='grid grid-cols-1 md:grid-cols-3 gap-12'>
								{paymentMethods && paymentMethods.map((card, index) => {
									const cardBrand = FuseUtils.identifyCardBrand(card.creditCard.number as string)
									return (
										<Paper
											key={index}
											sx={{
												p: 3,
												width: 1,
												position: 'relative',
												border: (theme) => `solid 1px ${theme.palette.grey[500_32]}`,
											}}
											className='rounded-md border-1'
										>
											<PaymentOption card={card} user={user} updateUser={updateUser} />
											<div className='flex flex-row gap-20'>
												{cardBrand &&
													<Image
														alt="icon"
														src={cardBrand.logoUrl}
														sx={{ marginBottom: 2, maxWidth: 46 }}
													/>
												}
												{card.paymentDefault &&
													<div
														className="transition-all px-8 min-w-28 h-28 text-sm capitalize font-bold inline-flex items-center rounded-md bg-blue-50  py-1 text-blue-800 ring-1 ring-inset ring-blue-600/20">
														{t('DEFAULT')}
													</div>
												}
											</div>
											<Typography variant="subtitle2">**** **** **** {card.creditCard.number.slice(-4)}</Typography>
										</Paper>
									)
								})}
							</Stack>
						</CardContent>
					</Card>

					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-24 md:px-32 pt-24 flex items-center">
							<Typography className="flex flex-1 text-2xl font-semibold leading-tight">
								{t('ADDRESS_BOOK')}
							</Typography>
							<div className="-mx-8">
								<FormNewAddress user={user} updateUser={updateUser} />
							</div>
						</div>

						<CardContent className="px-24 md:px-32 py-24">
							<Stack spacing={3} alignItems="flex-start">
								{addresses && addresses?.map((address, index) => (
									<Paper
										key={index}
										sx={{
											p: 3,
											width: 1,
											bgcolor: 'background.neutral',
										}}
										className='rounded-md border-1 relative'
									>
										<AddressOption address={address} user={user} updateUser={updateUser} />
										<div className='flex flex-row gap-20'>
											<Typography variant="subtitle1" gutterBottom>
												{address.name} ({address.addressType})
											</Typography>
											{address.addressDefault &&
												<div
													className="transition-all px-8 min-w-28 h-28 text-sm capitalize font-bold inline-flex items-center rounded-md bg-blue-50  py-1 text-blue-800 ring-1 ring-inset ring-blue-600/20">
													{t('DEFAULT')}
												</div>
											}
										</div>
										<Typography variant="body2" gutterBottom>
											<Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
												{t('ADDRESS')}
											</Typography>
											{`${address.addressFormatted?.address}`}
										</Typography>

										<Typography variant="body2" gutterBottom>
											<Typography variant="body2" component="span" sx={{ color: 'text.secondary' }}>
												{t('PHONE')}
											</Typography>
											{address.phoneNumber}
										</Typography>
									</Paper>
								))}
							</Stack>
						</CardContent>
					</Card>
				</div>

				<div className="flex flex-col md:w-360">
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="flex items-center px-32 pt-24">
							<Typography className="flex flex-1 text-2xl font-semibold leading-tight">
								{t('INVOICE_HISTORY')}
							</Typography>
						</div>

						<CardContent className="flex flex-wrap px-24 md:px-32">
							<InvoiceHistory subscriptions={subscriptions} />
						</CardContent>
					</Card>
				</div>
			</div>
		</motion.div>
	);
}

export default BillingTab;
