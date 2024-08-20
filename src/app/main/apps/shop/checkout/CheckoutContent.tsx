import _ from '@lodash';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useState } from 'react';
import withRouter from '@fuse/core/withRouter';
import FuseLoading from '@fuse/core/FuseLoading';
import { WithRouterProps } from '@fuse/core/withRouter/withRouter';
import * as React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import { addDiscount, calculateTotalItemsSelector, calculateTotalSelector, clearCart, decrementQuantity, incrementQuantity, itemsCartSelector, removeFromCart, setShipping } from '../store/cartSlice';
import { Iconify } from '@fuse/components/iconify';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import { CheckoutCartProduct } from './CheckoutCartProduct';
import CardHeader from '@mui/material/CardHeader';
import { useAppDispatch } from 'app/store/store';
import { TableHeadCustom } from './TableHeadCustom';
import Grid from '@mui/material/Grid';
import { CheckoutSummary } from './CheckoutSummary';
import { CheckoutSteps } from './CheckoutSteps';
import { CheckoutBillingAddress } from './CheckoutBillingAddress';
import FormNewAddress from '../../account/components/dialogs/FormNewAddress';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import { CheckoutBillingInfo } from './CheckoutBillingInfo';
import { CheckoutDelivery } from './CheckoutDelivery';
import { useForm, FormProvider } from 'react-hook-form';
import { CheckoutPaymentMethods } from './CheckoutPaymentMethods';
import LoadingButton from '@mui/lab/LoadingButton';

import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckoutOrderComplete } from './CheckoutOrderComplete';
import { removeStorage } from '@fuse/hooks/useLocalStorage';
import { useTranslation } from 'react-i18next';


type ProductsTableProps = WithRouterProps & {
	navigate: (path: string) => void;
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

const DELIVERY_OPTIONS: any[] = [
	{ value: 0, label: 'Free', description: '5-7 days delivery' },
	{ value: 10, label: 'Standard', description: '3-5 days delivery' },
	{ value: 20, label: 'Express', description: '2-3 days delivery' },
];

const STORAGE_KEY = 'shopApp_cart';

const PRODUCT_CHECKOUT_STEPS = ['CART', 'ADDRESS', 'PAYMENT'];

const TABLE_HEAD = [
	{ id: 'product', label: 'PRODUCT' },
	{ id: 'price', label: 'PRICE' },
	{ id: 'quantity', label: 'QUANTITY' },
	{ id: 'totalAmount', label: 'TOTAL_PRICE', align: 'right' },
	{ id: '' },
];

const PAYMENT_OPTIONS: any[] = [
	{
		value: 'credit',
		label: 'Cartão de crédito',
		description: 'Faça seus pagamentos com o seu cartão de crédito',
	},
	{ value: 'pix', label: 'Pix', description: 'Faça seus pagamentos em poucos segundos' },
];


export type PaymentSchemaType = zod.infer<typeof PaymentSchema>;

export const PaymentSchema = zod.object({
	payment: zod.string().min(1, { message: 'Payment is required!' }),
	delivery: zod.number(),
});

/**
 * The products table.
 */
function ProductsTable(props: ProductsTableProps) {
	const { navigate } = props;
	const dispatch = useAppDispatch();
	const { updateUser } = useAuth();
	const user = useSelector(selectUser);
	const { customer } = useSelector((state: any) => state.user?.data);
	const CARDS_OPTIONS: any[] = customer?.billings
	const cart = useSelector(itemsCartSelector);
	const total = useSelector(calculateTotalSelector)
	const totalItems = useSelector(calculateTotalItemsSelector);
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState(false);
	const { t } = useTranslation('shopApp');

	const empty = !cart?.products?.length;

	const handleIncrement = (itemId) => {
		dispatch(incrementQuantity(itemId));
	};

	const handleDecrement = (itemId) => {
		dispatch(decrementQuantity(itemId));
	};

	const handleRemove = (itemId) => {
		dispatch(removeFromCart(itemId));
	};

	const handlApplyDiscount = () => {
		const newDiscount = { value: 5, code: 'DISCOUNT5', applied: '5%' }
		dispatch(addDiscount(newDiscount))
	};

	const handleNext = () => {
		if (activeStep < PRODUCT_CHECKOUT_STEPS.length - 1) {
			setActiveStep(prevStep => prevStep + 1);
		} else {
			setCompleted(true);
		}
	};

	const handleBack = () => {
		if (activeStep > 0) {
			setActiveStep(prevStep => prevStep - 1);
		}
	};

	const handleGoTo = (step: number) => {
		setActiveStep(step);
	};

	const handleReset = () => {
		setActiveStep(0);
		setCompleted(false);
		removeStorage(STORAGE_KEY);
		dispatch(clearCart())
	};

	const handleApplyShipping = (e) => {
		const free = parseFloat(parseFloat(e.value).toFixed(2))
		dispatch(setShipping({ value: free, delivery: true, title: e.label }))
	}

	const defaultValues = { delivery: 0, payment: '' };

	const methods = useForm<PaymentSchemaType>({
		resolver: zodResolver(PaymentSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		formState: { isSubmitting },
	} = methods;

	const onSubmit = handleSubmit(async (data) => {
		handleNext()
		try {
			console.info('DATA', data);
		} catch (error) {
			console.error(error);
		}
	});

	if (!cart) {
		return (
			<div className="flex items-center justify-center h-full w-full">
				<FuseLoading />
			</div>
		);
	}

	if (empty) {
		return (
			<div className='flex flex-1 items-center justify-center h-full'>
				<div className='flex flex-col items-center justify-center'>
					<div className='flex flex-col items-center justify-center mb-36'>
						<Box
							component="img"
							alt="empty content"
							src={`/assets/icons/empty/ic-cart.svg`}
							sx={{ width: 1, maxWidth: 160 }}
						/>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.1 } }}
						>
							<Typography
								color="text.secondary"
								variant="h5"
							>
								{t('CART_EMPTY_TITLE')}
							</Typography>
						</motion.div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.1 } }}
						>
							<Typography
								color="text.secondary"
								variant="body1"
							>
								{t('CART_EMPTY_SUBTITLE')}
							</Typography>
						</motion.div>
					</div>
					<Button
						component={Link}
						to="/apps/shop"
						color="inherit"
						startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
					>
						{t('CONTINUE_SHOPPING')}
					</Button>
				</div>
			</div>
		);
	}


	return (
		<div className="w-full flex flex-col min-h-full space-y-12 sm:space-y-0 px-24 md:px-32">
			<Grid container justifyContent={completed ? 'center' : 'flex-start'}>
				<Grid item xs={12} md={12}>
					<CheckoutSteps activeStep={activeStep} steps={PRODUCT_CHECKOUT_STEPS} />
				</Grid>
			</Grid>
			<Grid container spacing={3} mt={4}>
				{completed && (
					<CheckoutOrderComplete open onReset={handleReset} onDownloadPDF={() => { }} />
				)}
				<FormProvider {...methods}>
					<Grid item xs={12} md={8}>
						<form noValidate autoComplete="off">
							<>
								{activeStep === 0 &&
									<>
										<Card sx={{ mb: 3 }}>
											<CardHeader
												title={
													<Typography variant="h6">
														{t('CART')}
														<Typography component="span" sx={{ color: 'text.secondary' }}>
															&nbsp;(
															{totalItems} item)
														</Typography>
													</Typography>
												}
												sx={{ mb: 3 }}
											/>
											<Table sx={{ minWidth: 720 }}>
												<TableHeadCustom headLabel={TABLE_HEAD} />
												<TableBody>
													{cart?.products?.map((row) => (
														<CheckoutCartProduct
															key={row.id}
															row={row}
															onDelete={() => handleRemove(row.id)}
															onDecrease={() => handleDecrement(row.id)}
															onIncrease={() => handleIncrement(row.id)}
														/>

													))}
												</TableBody>
											</Table>
										</Card>
									</>
								}
								{activeStep === 1 && <CheckoutBillingAddress customer={customer} onNextStep={handleNext} />}
								{activeStep === 2 && <>
									<CheckoutDelivery onApplyShipping={handleApplyShipping} options={DELIVERY_OPTIONS} />
									<CheckoutPaymentMethods options={{ payments: PAYMENT_OPTIONS, cards: CARDS_OPTIONS, user, updateUser }} sx={{ my: 3 }} />
								</>}
								<Stack direction="row" justifyContent="space-between">
									{activeStep === 0 ?
										<Button
											component={Link}
											to="/apps/shop"
											color="inherit"
											className='px-12'
											startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
										>
											{t('CONTINUE_SHOPPING')}
										</Button>
										:
										<>
											<Button
												size="small"
												color="inherit"
												onClick={handleBack}
												className='px-12'
												startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
											>
												{t('BACK')}
											</Button>
											{activeStep === 1 &&
												<FormNewAddress user={user} updateUser={updateUser} />
											}
										</>
									}
								</Stack>
							</>
						</form>
					</Grid>
					<Grid item xs={12} md={4}>
						{cart.address && activeStep === 2 &&
							<CheckoutBillingInfo billing={cart.address} onBackStep={handleBack} />
						}

						<CheckoutSummary
							total={total}
							activeStep={activeStep}
							products={cart?.products}
							discount={cart.discount.value}
							subtotal={cart.subTotal}
							shipping={cart.shipping.value}
							onApplyDiscount={handlApplyDiscount}
							onEdit={(e) => handleGoTo(e)}
						/>

						{activeStep === 0 &&
							<Button
								fullWidth
								size="large"
								type="submit"
								variant="contained"
								disabled={empty}
								onClick={handleNext}
							>
								{t('CONFIRM')}
							</Button>
						}
						{activeStep === 2 &&
							<LoadingButton
								fullWidth
								size="large"
								type="submit"
								variant="contained"
								loading={isSubmitting}
								onClick={onSubmit}
							>
								{t('BUY_NOW')}
							</LoadingButton>
						}

					</Grid>
				</FormProvider>
			</Grid>
		</div>
	);
}

export default withRouter(ProductsTable);
