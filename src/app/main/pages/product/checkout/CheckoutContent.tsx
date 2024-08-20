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
import { addDiscount, calculateTotalItemsSelector, calculateTotalSelector, clearCart, decrementQuantity, incrementQuantity, itemsCartSelector, removeFromCart, setAddress, setCustomer, setShipping } from '../store/cartSlice';
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
import FormNewAddress from 'src/app/main/apps/account/components/dialogs/FormNewAddress';
import { CheckoutCustomer } from './CheckoutCustomer';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { styled } from "@mui/material/styles";
import BottomSheet from '../components/BottomSheet';


const StyledBreadcrumbs = styled(Breadcrumbs)({
	maxWidth: '100%',
	'.MuiBreadcrumbs-ol': {
		flexWrap: 'nowrap'
	},
	'.MuiBreadcrumbs-separator': {
		flexShrink: 0,
		margin: 0,
	},
	'.MuiBreadcrumbs-li:not(:last-of-type)': {
		overflow: 'hidden'
	}
});

type ProductsTableProps = WithRouterProps & {
	navigate: (path: string) => void;
	isMobile?: boolean;
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

const PRODUCT_CHECKOUT_STEPS = ['CONTACT', 'ADDRESS', 'PAYMENT'];

const TABLE_HEAD = [
	{ id: 'product', label: 'PRODUCT' },
	{ id: 'price', label: 'PRICE' },
	{ id: 'quantity', label: 'QUANTITY' },
	{ id: 'totalAmount', label: 'TOTAL_PRICE', align: 'right' }
];

const PAYMENT_OPTIONS: any[] = [
	{
		value: 'credit',
		label: 'Cartão de crédito',
		description: 'Faça seus pagamentos com o seu cartão de crédito',
	},
	{ value: 'pix', label: 'Pix', description: 'Faça seus pagamentos em poucos segundos' },
];


export type PaymentSchemaType = any;

export const PersonalInfoSchema = zod.object({
	name: zod.string({ required_error: 'Full Name is required' })
		.regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, { message: 'Nome deve conter apenas letras e espaços!' })
		.refine((value) => {
			const words = value.trim().split(' ');
			return words.length >= 2;
		}, {
			message: 'Digite o nome completo'
		}),
	email: zod.string()
		.min(1, { message: 'Email é obrigatório!' })
		.email({ message: 'Formato de email inválido!' }),
	phone: zod.string()
		.min(14, { message: 'Telefone é obrigatório!' })
		.regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, { message: 'Formato de telefone inválido!' }),
	cpfCnpj: zod.string()
		.min(11, { message: 'CPF ou CNPJ é obrigatório!' })
		.regex(/^(\d{3}\.\d{3}\.\d{3}-\d{2}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/, { message: 'Formato de CPF ou CNPJ inválido!' }),
});


const AddressSchema = zod.object({
	address: zod.string().min(1, { message: 'Address is required' }),
	addressNumber: zod.string().min(1, { message: 'Address Number is required' }),
	addressComplement: zod.string().optional(),
	neighborhood: zod.string().min(1, { message: 'Neighborhood is required' }),
	city: zod.string({ required_error: 'City is required' }),
	state: zod.string({ required_error: 'State is required' }),
	zipCode: zod.string({ required_error: 'ZipCode is required' })
});

export const PaymentSchemaSchema = zod.object({
	payment: zod.string().min(1, { message: 'Payment is required!' }),
	delivery: zod.number(),
});

/**
 * The products table.
 */
function ProductsTable(props: ProductsTableProps) {
	const { navigate, isMobile } = props;
	const dispatch = useAppDispatch();
	const { updateUser } = useAuth();
	const user = useSelector(selectUser);
	const CARDS_OPTIONS: any[] = []
	const cart = useSelector(itemsCartSelector);
	const total = useSelector(calculateTotalSelector)
	const totalItems = useSelector(calculateTotalItemsSelector);
	const [activeStep, setActiveStep] = useState(0);
	const [completed, setCompleted] = useState(false);
	const { t } = useTranslation('shopApp');

	const empty = !cart?.products?.length;
	const [isOpen, setIsOpen] = useState(false);

	const toggleBottomSheet = () => {
		setIsOpen(!isOpen);
	};

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

	const defaultValues = {
		name: cart?.customer?.name || '',
		email: cart?.customer?.email || '',
		phone: cart?.customer?.phone || '',
		cpfCnpj: cart?.customer?.cpfCnpj || '',
		addressType: 'Home',
		addressDefault: false,
		address: cart?.address?.address || '',
		addressNumber: cart?.address?.addressNumber || '',
		addressComplement: cart?.address?.addressComplement || '',
		neighborhood: cart?.address?.neighborhood || '',
		delivery: 0,
		payment: '',
	};

	const currentSchema = activeStep === 0 ? PersonalInfoSchema : AddressSchema;

	const methods = useForm<PaymentSchemaType>({
		mode: 'onChange',
		resolver: zodResolver(currentSchema),
		defaultValues,
	});

	const {
		handleSubmit,
		formState: { isSubmitting, isValid, dirtyFields, errors },
	} = methods;


	const onSubmit = handleSubmit(async (data) => {
		handleNext()
		try {
			if (activeStep === 0) {
				dispatch(setCustomer(data))
			} else if (activeStep === 1) {
				dispatch(setAddress(data))
			}
			return true;
		} catch (error) {
			if (error instanceof zod.ZodError) {
				console.log('Erros de validação:', error.errors);
			}
			return false;
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
						to="/product"
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
		<div className="w-full flex flex-col min-h-full space-y-12 sm:space-y-0 px-0 md:px-32">
			{PRODUCT_CHECKOUT_STEPS && PRODUCT_CHECKOUT_STEPS.length > 0 && (
				<StyledBreadcrumbs
					aria-label="breadcrumb"
					className='mx-12 md:mx-20'
					separator={<NavigateNextIcon fontSize="small" />}
				>
					{PRODUCT_CHECKOUT_STEPS.map((step, index) =>
						index <= activeStep ? (
							<Typography key={index} className='cursor-pointer' color={index === activeStep ? "text.primary" : "inherit"}
								component={'li'}
								onClick={() => handleGoTo(index)}>
								{t(`shopApp:${step}`)}
							</Typography>
						) : (
							<Typography key={index} className='cursor-not-allowed' color="inherit">{t(`shopApp:${step}`)}</Typography>
						)
					)}
				</StyledBreadcrumbs>
			)}
			<Grid container spacing={3} mt={4}>
				{completed && (
					<CheckoutOrderComplete open onReset={handleReset} onDownloadPDF={() => { }} />
				)}
				<FormProvider {...methods}>
					<Grid item xs={12} md={8}>
						<form noValidate autoComplete="off">
							<>
								{activeStep === 0 && <CheckoutCustomer />}
								{activeStep === 1 && <CheckoutBillingAddress customer={cart.customer} onBackStep={handleBack} onNextStep={handleNext} />}
								{activeStep === 2 && <>
									<CheckoutDelivery onApplyShipping={handleApplyShipping} options={DELIVERY_OPTIONS} />
									<CheckoutPaymentMethods options={{ payments: PAYMENT_OPTIONS, cards: CARDS_OPTIONS, user, updateUser }} sx={{ my: 3 }} />
								</>}
								<Stack className='container px-12 justify-center items-center' direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 2, md: 4 }} justifyContent="space-between">
									{activeStep >= 0 &&
										<>
											{/* <Button
												component={Link}
												to="/product"
												color="inherit"
												className='px-12'
												startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
											>
												{t('CONTINUE_SHOPPING')}
											</Button> */}

											<Button
												className="px-12 text-xl py-8 transition duration-300 ease-in-out hover:scale-105"
												variant="contained"
												color="secondary"
												size="large"
												type="submit"
												disabled={_.isEmpty(dirtyFields) || !isValid}
												onClick={handleSubmit(onSubmit)}
												fullWidth
											>
												{activeStep === 0 && <>Continuar</>}
												{activeStep === 1 && <>Salvar Endereço</>}
												{activeStep === 2 && <>Fazer Pedido</>}
											</Button>
										</>

									}
								</Stack>
							</>
						</form>
					</Grid>
					<Grid item xs={12} md={4}>
						{!isMobile &&
							<>
								{cart.address && activeStep === 2 &&
									<CheckoutBillingInfo billing={cart} onBackStep={handleBack} />
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
							</>
						}


						{activeStep === 20 &&
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
			<BottomSheet open={isOpen} onClose={toggleBottomSheet} />
		</div>
	);
}

export default withRouter(ProductsTable);
