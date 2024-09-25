import React, { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import history from '@history'
import Box from '@mui/material/Box';
import { lighten, ThemeProvider } from '@mui/material/styles';
import { selectMainThemeDark } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Button, CardContent, CardHeader, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Fade, FormControl, Grid, IconButton, InputAdornment, MobileStepper, Popover, Skeleton, Stack, Step, Stepper, TextField, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import { Link, useLocation, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from 'react-redux'
import FuseUtils from '@fuse/utils'
import _ from '@lodash';
import { Formik, Form, useFormik } from 'formik'
import Reaptcha from 'reaptcha'
import { useCookies } from 'react-cookie'
import { useDeepCompareEffect } from '@fuse/hooks';

import { styled } from '@mui/material/styles'
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector'
import StepLabel, { stepLabelClasses } from '@mui/material/StepLabel'

import validationSchema from './formModel/validationSchema'
import checkoutFormModel from './formModel/checkoutFormModel'
import formInitialValues from './formModel/formInitialValues'
import AddressForm from './forms/AddressForm'
import PaymentForm from './forms/PaymentForm'
import LoadingButton from '@mui/lab/LoadingButton';
import clsx from 'clsx';
import firebase from 'firebase/compat/app'
import { addCustomer, addDiscount, addReferral, addToCart, calculateTotalSelector, clearCart, getTotals, removeDiscount, updateProduct } from '../store/cartSlice';
import { OrderDataProps, createOrder, createOrderCartToCustomer, removeCart } from '../store/orderSlice';
import { useGetECommerceProductQuery, useGetECommerceCouponQuery, useCreateConversionTrackingMutation } from '../CheckoutApi';
import { useAppDispatch } from 'app/store/store';
import {
	useCreateCustomersItemMutation,
	useGetCustomersItemQuery,
	useGetCustomersParamsQuery
} from 'src/app/main/apps/customers/CustomersApi'
import InputField from './formFields/InputField';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import FreightForm from './forms/FreightForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Image } from '@fuse/components/image'
import { Iconify } from '@fuse/components/iconify';
import { labelColorDefs, labelColors } from 'src/app/main/apps/shop/components/labelColors';
import ReferralLabels from '@fuse/components/label/referralLabels';


const { formId, formField } = checkoutFormModel

interface QontoStepIconRootProps {
	ownerState?: {
		active: boolean;
	};
}

interface OptionsProps {
	path: string;
	expires: Date;
	secure: boolean;
	partitioned: boolean;
	sameSite: 'none' | 'lax' | 'strict';
}

const Root = styled('div')(({ theme }) => ({
	'& .MuiFilledInput-root': {
		overflow: 'hidden',
		transition:
			'border-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		border: '1px solid #E0E3E7',

		'&:hover': {
			boxShadow: '0 0.15rem 0.25rem rgba(0, 0, 0, 0.25)'
		},

		' &.Mui-focused': {
			outline: 0,
			borderColor: '#86b7fe',
			boxShadow: '0 0 0 0.35rem rgba(13, 110, 253, .25)'
		},

		' &.Mui-error': {
			borderColor: ' #d32f2f',
			color: '#d32f2f',
			' &.Mui-focused': {
				boxShadow: '0 0 0 0.35rem rgba(210, 47, 47, .25)'
			}
		}
	},
	'& .g-recaptcha': {
		display: 'none!important'
	},
	'& table ': {
		'& th:first-of-type, & td:first-of-type': {
			paddingLeft: `${0}!important`
		},
		'& th:last-child, & td:last-child': {
			paddingRight: `${0}!important`
		}
	},
	'& .small-text': {
		fontSize: 14,
		fontWeight: 400,
		color: theme.palette.text.secondary
	},
	'& .product-header': {
		padding: `20px!important`,
		minHeight: `50px`,
		fontWeight: 700,
		fontSize: 16,
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark)
	},
	'& .content-card': {
		padding: '15px 20px',
		display: 'flex',
		alignItems: 'center',
		'& .imagem-produto': {
			backgroundColor: theme.palette.primary.dark,
			minWidth: 120,
			maxWidth: 120,
			borderRadius: '0.6rem',
			marginRight: 15
		},
		'& .product-img': {
			margin: '0 auto',
			display: 'block',
			width: '100%',
			height: '100%',
			objectFit: 'fill',
			borderRadius: 6
		},
		'& .info-card': {
			width: '100%'
		}
	},
	'& .product-footer': {
		alignItems: 'flex-end',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		padding: '1.6rem 1.1rem',
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark),
		'& span': {
			flex: 1,
			fontSize: 14,

			'& h6': {
				flex: 1,
				color: theme.palette.getContrastText(theme.palette.primary.dark)
			},

			'&.desc': {
				fontSize: '1.1rem',
				fontWeight: 400
			},
			'&.total': {
				marginTop: '0.2rem',
				fontSize: '2.6rem',
				fontWeight: 400,
				marginRight: 18,

				'& span.fraction': {
					position: 'absolute',
					lineHeight: 1.8
				}
			}
		}
	},
	'& .btn-checkout': {
		padding: '0 42px',
		height: '44px!important',
		maxHeight: '44px!important',
		border: 'none',
		outline: 'none',
		borderRadius: '0.48rem',
		transition: 'all 0.3s',
		fontSize: 16,
		fontWeight: 600,
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark),
		textTransform: 'uppercase',
		'&:hover': {
			boxShadow:
				'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px',
			transform: 'scale(1.04)'
		}
	}
}))

const QontoStepIconRoot = styled('div')<QontoStepIconRootProps>(({ theme, ownerState }) => ({
	color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
	display: 'flex',
	height: 42,
	alignItems: 'center',
	...(ownerState.active && {
		color: theme.palette.primary.dark
	}),
	'& .QontoStepIcon-completedIcon': {
		color: theme.palette.primary.dark,
		zIndex: 1,
		fontSize: 18
	},
	'& .QontoStepIcon-circle': {
		width: 8,
		height: 8,
		borderRadius: '50%',
		backgroundColor: 'currentColor',
		zIndex: 1
	},
	'& .nu': {
		position: 'absolute',
		padding: 1,
		width: 16,
		height: 16,
		display: 'flex',
		marginLeft: -4,

		'& .ajg': {
			borderRadius: 9999,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgb(199 210 254 / 1)'
		}
	}
}))

const QontoConnector = styled(StepConnector)(({ theme }) => ({
	[`&.${stepConnectorClasses.alternativeLabel}`]: {
		top: 20,
		left: 'calc(-50% + 16px)',
		right: 'calc(50% + 16px)'
	},
	[`&.${stepConnectorClasses.active}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: theme.palette.primary.dark,
			boxShadow: '0 0 1px 1px rgba(0,0,0,.25), inset 0 1px hsla(0,0%,100%,.07)',
			transition: 'width 1s ease-in-out',
			position: 'relative'
		}
	},
	[`&.${stepConnectorClasses.completed}`]: {
		[`& .${stepConnectorClasses.line}`]: {
			borderColor: theme.palette.primary.dark,
			boxShadow: '0 0 1px 1px rgba(0,0,0,.25), inset 0 1px hsla(0,0%,100%,.07)',
			transition: 'width 1s ease-in-out',
			position: 'relative'
		}
	},
	[`& .${stepConnectorClasses.line}`]: {
		borderColor:
			theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
		borderTopWidth: 4,
		borderRadius: 2,
		boxShadow: 'inset 0 1px 2px rgba(0,0,0,.25), 0 1px hsla(0,0%,100%,.06)',
		backgroundImage:
			'linear-gradient(180deg,hsla(0,0%,100%,.3),hsla(0,0%,100%,.05))',
		overflow: 'visible'
	}
}))

const ColorStepLabel = styled(StepLabel)(({ theme }) => ({
	[`& .${stepLabelClasses.label}`]: {
		[`&.${stepLabelClasses.active}`]: {
			color: theme.palette.primary.dark
		},
		[`&.${stepLabelClasses.completed}`]: {
			color: theme.palette.primary.dark
		}
	}
}))

const _renderTextoProcess = (params, process) => {
	const dispatch = useAppDispatch()
	const [texto, setTexto] = useState('Autenticação...')
	const { order } = useSelector((state: any) => state.checkoutApp)

	useEffect(() => {
		if (process && order) {
			setTimeout(() => history.push(`/thanks/${order?.id}`), 7500)
		}
	}, [order, dispatch])

	useEffect(() => {
		const intervalo = setInterval(() => {
			setTexto(textoAtual => {
				switch (textoAtual) {
					case 'Autenticação...':
						return 'Verificação...'
					case 'Verificação...':
						return 'Finalizando...'
					case 'Finalizando...':
						return 'Confirmação...'
					default:
						return 'Autenticação...'
				}
			})
		}, 3500)
		return () => clearInterval(intervalo)
	}, [texto, process])
	return (
		<Fade in={true} style={{ transitionDelay: '200ms' }}>
			<Typography variant="h6" component="div" mr={2}>
				{texto}
			</Typography>
		</Fade>
	)
}

const determineSteps = (products) => {
	if (products[0]?.type === 'digital') {
		return ['Informações', 'Pagamento'];
	}
	return ['Informações', 'Entrega', 'Pagamento'];
};


/**
 * The checkout.
 */
function CheckoutPage() {
	const mainThemeDark = useSelector(selectMainThemeDark)
	const dispatch = useAppDispatch();
	const routeParams = useParams()
	const [process, setProcess] = useState(false)
	const [loading, setLoading] = useState(true)
	const [loadingButton, setLoadingButton] = useState(false)
	const [activeStep, setActiveStep] = useState(0)
	const [validate, setValidate] = useState(true)
	const [active, setActive] = useState(true)
	const total = useSelector(calculateTotalSelector)
	const { cart } = useSelector((state: any) => state.checkoutApp)
	const [createCustomer] = useCreateCustomersItemMutation()
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const currentAmount = searchParams.get('amount') || '';
	const [amount, setAmount] = useState(currentAmount)
	const [steps, setSteps] = useState(determineSteps(cart?.products));

	const cookiesLabel = [
		'_fbp',
		'_fbc',
		'rid',
		'cartId',
		'fullName',
		'birthday',
		'email',
		'phone',
		'cpfCnpj',
		'zipcode',
		'address',
		'addressNumber',
		'complement'
	]
	const [cookies, setCookie, removeCookie] = useCookies(cookiesLabel)
	const captchaRef = useRef<Reaptcha>(null)
	const formikRef = useRef()
	const [reCaptchaReady, setReCaptchaReady] = useState(false)
	const currentValidationSchema = validationSchema[activeStep]
	const isLastStep = activeStep === steps.length - 1
	const [cartId, setCartId] = useState(cookies?.cartId || '')
	const [discount, setDiscount] = useState(0)
	const [discountApplied, setDiscountApplied] = useState('')
	const [valueInstallments, setValueInstallments] = useState([])
	const [customerData, setCustomerData] = useState<any>({ email: cookies?.email, cpfCnpj: cookies?.cpfCnpj })
	const [couponData, setCouponData] = useState()
	const { data: customer } = useGetCustomersParamsQuery(customerData, { skip: !customerData })
	const { data: coupon }: any = useGetECommerceCouponQuery(couponData, { skip: !couponData })
	const [isMobile, setIsMobile] = useState(false)
	const [isSmallScreen, setIsSmallScreen] = useState(false)
	const [isReturningUser, setIsReturningUser] = useState(false);
	const currentUrl = window.location.href
	const [createConversionTracking] = useCreateConversionTrackingMutation()
	const period = searchParams.get('period') || '';
	const customerId = searchParams.get('rid') || '';

	const { data: referralCustomer } = useGetCustomersItemQuery(customerId, { skip: !customerId });

	useEffect(() => {
		const initializeFingerprint = async () => {
			const fp = await FingerprintJS.load();
			const result = await fp.get();
			const visitorId = result.visitorId;

			const returningUser = localStorage.getItem('visitorId') === visitorId;

			window.addEventListener('beforeunload', handleBeforeNavigate);

			if (returningUser) {
				setIsReturningUser(true);
			} else {
				setIsReturningUser(false);
				localStorage.setItem('visitorId', visitorId);
			}
		};

		const handleBeforeUnload = (event) => {
			event.preventDefault();
			const message = 'Tem certeza que deseja sair? Você perderá sua oferta especial!';
			event.returnValue = message;
			return message;
		};

		const handleBeforeNavigate = () => {
			alert('Não saia! Você tem uma oferta especial aqui!');
		};

		const verificarTamanhoDaTela = () => {
			setIsMobile(window.innerWidth <= 768);
			setIsSmallScreen(window.innerWidth <= 1024);
		};

		window.removeEventListener('beforeunload', handleBeforeUnload);
		window.removeEventListener('beforeunload', handleBeforeNavigate);
		window.addEventListener('resize', verificarTamanhoDaTela);
		initializeFingerprint();
		verificarTamanhoDaTela();
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('beforeunload', handleBeforeNavigate);
			window.removeEventListener('resize', verificarTamanhoDaTela);
		};
	}, []);

	const {
		data: product,
		isLoading,
		isError
	} = useGetECommerceProductQuery(routeParams.id, {
		skip: routeParams.id === 'billing'
	})

	const handleLoadReCaptcha = () => {
		setReCaptchaReady(true)
	}

	async function handleLocation(values, actions) {
		try {
			const location: any = await FuseUtils.getLocation(
				`${values.address}, ${values.addressNumber} - ${values.neighborhood}, ${values.city} - ${values.state}, ${values.zipcode}`
			)

			const address: any = {
				address: location?.address,
				lat: location?.lat,
				lng: location?.lng
			}
			actions.setFieldValue('invoiceAddress', address)
			actions.setFieldValue('shippingAddress', address)
			return address
		} catch (error) {
			console.error(error)
		}
	}

	const _handleBack = () => {
		setActiveStep(activeStep - 1)
	}

	const removeCookies = async () => {
		const options: OptionsProps = {
			path: '/',
			expires: new Date(0),
			secure: true,
			partitioned: true,
			sameSite: 'none'
		}
		cookiesLabel.forEach(cookie => { removeCookie(cookie, options) })
	}

	const _submitForm = async (values: OrderDataProps, actions: any) => {

		setProcess(true)

		if (customer && customer.length > 0) {

			await dispatch(createOrder({ ...values, customerId: customer[0].id } as any)).then(async ({ payload }) => {

				fBEvent('Purchase', customer[0])
				gLogEvent('purchase')
				setTimeout(() => {
					fBEvent('Subscribe', customer[0])
					setProcess(false)
					actions.setSubmitting(false)
					setActiveStep(activeStep + 1)
					removeCookies()
				}, 9000)
			})
		} else {
			const customerNew = {
				email: values.email,
				cpfCnpj: values.cpfCnpj,
				birthday: values.birthday,
				address: values.address,
				addressNumber: values.addressNumber,
				complement: values.complement,
				neighborhood: values.neighborhood,
				city: values.city,
				state: values.state,
				postalCode: values.zipcode,
				invoiceAddress: values.invoiceAddress,
				shippingAddress: values.shippingAddress,
				title: '',
				background: '',
				company: '',
				notes: '',
				tags: [],
				emails: [{ email: values.email, label: 'default' }],
				phoneNumbers: [{ country: 'br', phoneNumber: values.phone, label: 'default' }],
				name: values.fullName,
				updatedAt: new Date(),
				createdAt: new Date()
			}
			createCustomer({ customer: customerNew } as any)
				.unwrap()
				.then(async (action) => {
					await dispatch(createOrder({ ...values, customerId: action.id } as any)).then(async ({ payload }) => {

						gLogEvent('purchase')
						fBEvent('Purchase', customerNew)

						setTimeout(() => {
							fBEvent('Subscribe', customerNew)
							setProcess(false)
							actions.setSubmitting(false)
							setActiveStep(activeStep + 1)
							removeCookies()
						}, 9000)
					})
				});
		}

		dispatch(removeCart(cartId))
	}

	const _handleSubmit = async (values: OrderDataProps, actions: any) => {
		const expires = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000)
		const options: OptionsProps = {
			path: '/',
			expires,
			secure: true,
			partitioned: true,
			sameSite: 'none'
		}

		setLoadingButton(true)
		if (isLastStep) {
			if (reCaptchaReady) {
				captchaRef.current.execute()
			}
			_submitForm(values, actions)
		} else {
			setActiveStep(activeStep + 1)
			actions.setTouched({})
			actions.setSubmitting(false)
			setCustomerData({ email: values.email, cpfCnpj: values.cpfCnpj } as any)
			if (activeStep + 1 === 1 && active) {
				handleLocation(values, actions).then(async (local) => {
					const data = { ...values, invoiceAddress: local, shippingAddress: local }

					const customerData = {
						customerId: values?.customerId ? values?.customerId : null,
						avatar: null,
						background: null,
						name: values.fullName,
						cpfCnpj: values.cpfCnpj,
						emails: [{ email: values.email, label: 'default' }],
						phoneNumbers: [
							{ country: 'br', phoneNumber: values.phone, label: 'default' }
						],
						title: '',
						company: '',
						birthday: values?.birthday,
						email: values.email,
						phone: values.phone,
						address: values.address,
						addressNumber: values.addressNumber,
						complement: values.complement,
						neighborhood: values.neighborhood,
						city: values.city,
						state: values.state,
						postalCode: values.zipcode,
						invoiceAddress: local,
						shippingAddress: local,
						notes: '',
						tags: []
					}

					dispatch(addCustomer(customerData))

					if (!cartId) {
						await dispatch(createOrderCartToCustomer(data)).then(({ payload }) => {
							setCartId(payload.id)
							setCookie('cartId', payload.id, options)
						})
					}
				})
			}
		}

		const customerSlice = {
			email: values.email,
			cpfCnpj: values.cpfCnpj,
			birthday: values.birthday,
			address: values.address,
			addressNumber: values.addressNumber,
			complement: values.complement,
			neighborhood: values.neighborhood,
			city: values.city,
			state: values.state,
			postalCode: values.zipcode,
			invoiceAddress: values?.invoiceAddress,
			shippingAddress: values?.shippingAddress,
			title: '',
			background: '',
			company: '',
			notes: '',
			tags: [],
			emails: [{ email: values.email, label: 'default' }],
			phoneNumbers: [{ country: 'br', phoneNumber: values.phone, label: 'default' }],
			name: values.fullName
		}

		if (cart?.customer === null) {
			dispatch(addCustomer(customerSlice))
		}

		cookiesLabel.forEach(campo => {
			if (campo !== 'cartId') {
				setCookie(campo, values[campo], options)
			}
		})

		fBEvent('ViewContent', customerSlice)

		setTimeout(() => {
			setLoadingButton(false)
		}, 1500)
	}

	const _handleSubmitOn = (values) => {
		if (values.paymentMethod === 'pix' || values.paymentMethod === 'boleto') {
			setValidate(false)
		} else {
			setValidate(true)
		}
	}


	const _renderStepContent = (step) => {
		const subscriptionOption = subscription(product?.subscriptionOptions)

		switch (steps[step]) {
			case 'Informações':
				return <AddressForm formField={formField} />
			case 'Entrega':
				return <FreightForm formField={{ ...formField, cart, subscriptionOption }} />
			case 'Pagamento':
				return <PaymentForm formField={{ ...formField, subscriptionOption }} cookies={cookies} />
			default:
				return <div className='flex flex-col justify-center items-center'>
					<Alert severity="warning" className='my-32'>
						<AlertTitle>Ops! Parece que houve um problema no processamento do seu pagamento</AlertTitle>
						Verifique os dados do cartão de crédito e tente novamente ou entre em contato com nosso suporte para obter ajuda adicional.<br />Lamentamos o inconveniente!
					</Alert>
					<Button
						size="large"
						startIcon={<FuseSvgIcon className="text-48" size={24}>feather:phone-call</FuseSvgIcon>}
						className="rounded-md shadow-sm hover:scale-125 ease-in-out duration-300 delay-150 w-2/3" target="_blank" component="a" href='https://wa.link/pth9mm'>Falar com suporte</Button>
				</div>
		}
	}

	const QontoStepIcon = (props) => {
		const { active, completed, className } = props
		return (
			<QontoStepIconRoot ownerState={{ active }} className={className}>
				{active && (
					<span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 nu">
						<span className="ajg"></span>
					</span>
				)}
				{completed ? (
					<FuseSvgIcon className="QontoStepIcon-completedIcon">
						material-outline:done_all
					</FuseSvgIcon>
				) : (
					<div className="QontoStepIcon-circle" />
				)}
			</QontoStepIconRoot>
		)
	}

	const formatCurrencyMap = number => {
		let currency,
			fraction,
			values = ''
		const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
			style: 'currency',
			currency: 'BRL'
		})

		CURRENCY_FORMATTER.formatToParts(number)
			.map(({ type, value }) => {
				switch (type) {
					case 'currency':
						return (currency = value)
					case 'fraction':
						return (fraction = value)
					default:
						return (values += value)
				}
			})
			.join('')
		return (
			<>
				<span className="currency">{currency}</span>
				{values}
				<span className="fraction">{fraction}</span>
			</>
		)
	}

	const formik = useFormik({
		initialValues: formikRef,
		onSubmit: _handleSubmitOn
	})

	const removePromoCode = () => {
		formik.values.current?.setFieldValue(`coupon`, '')

		setLoading(false)
		setDiscount(0)
		setDiscountApplied('')
		dispatch(removeDiscount())
		dispatch(getTotals())

		dispatch(
			showMessage({
				message: 'Cupom Removido!',
				autoHideDuration: 6000,
				anchorOrigin: {
					vertical: 'top',
					horizontal: 'right'
				},
				variant: 'error'
			}))
	}

	const getFirstAndLastName = (fullName: any) => {
		let firstName, lastName;
		if (fullName) {
			const nameParts = fullName?.trim().split(' ');
			firstName = nameParts[0];
			lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
			return { firstName, lastName };
		} else {
			return { firstName, lastName };
		}

	};

	const fBEvent = (event: any, customer: any) => {
		createConversionTracking({
			event,
			cart: cart,
			customer,
			pixel: { url: currentUrl, cookies }
		})
	}

	const gLogEvent = (event: any) => {
		const analytics = firebase.analytics()
		const { firstName, lastName } = getFirstAndLastName(cart?.customer?.name)
		const items = cart?.products.map(product => ({
			item_id: product.id,
			item_name: product.name,
			item_category: product?.categories ? product?.categories[0] : '',
			item_variant: product.handle,
			item_brand: 'Creabox',
			price: product.value
		}));

		const params = {
			currency: 'BRL',
			shipping: cart?.shipping?.value,
			coupon: cart?.discount?.code,
			value: Number(cart?.total).toFixed(2),
			user_data: {
				name: cart?.customer?.name,
				email_address: cart?.customer?.email,
				phone_number: cart?.customer?.phoneNumbers[0]?.phoneNumber,
				address: {
					first_name: firstName,
					last_name: lastName,
					city: cart?.customer?.city,
					region: cart?.customer?.state,
					postal_code: cart?.customer?.postalCode,
					country: 'bra',
				},
			},
			items: items
		};


		analytics.logEvent(event, params);
	}

	const checkPromoCode = async (e: any) => {
		const promoCode = formik.values.current?.values.coupon.toUpperCase()

		if (promoCode.length >= 5) {

			const couponsRef = firebase
				.firestore()
				.collection('coupons')
				.where('code', '==', promoCode)

			try {
				couponsRef
					.get()
					.then(querySnapshot => {
						const couponsDB = querySnapshot.docs.map((doc, index) => doc.data())
						const subTotal = ((total * parseFloat(couponsDB[0].value)) / 100)
						setDiscount(subTotal)
						setDiscountApplied(couponsDB[0].amount.value)
						dispatch(addDiscount({
							value: subTotal,
							code: couponsDB[0].code,
							applied: couponsDB[0].amount.value
						}))
						dispatch(getTotals())

						dispatch(
							showMessage({
								message: `${promoCode}, aplicado`,
								autoHideDuration: 6000,
								anchorOrigin: {
									vertical: 'top',
									horizontal: 'right'
								},
								variant: 'success'
							}))

						gLogEvent('add_shipping_info')
					})
					.catch(error => {
						console.error('Requested coupon do not exist. F - catch:', error.message)
						setDiscount(0)
						setDiscountApplied('')
						dispatch(removeDiscount())
						dispatch(getTotals())
						dispatch(
							showMessage({
								message: 'Cupom Inválido!',
								autoHideDuration: 6000,
								anchorOrigin: {
									vertical: 'top',
									horizontal: 'right'
								},
								variant: 'error'
							}))
					})
			} catch (error) {
				console.error('Requested coupon do not exist.', error.message)
			}
		} else {
			setDiscount(0)
			setDiscountApplied('')
			dispatch(removeDiscount())
			dispatch(getTotals())
			dispatch(
				showMessage({
					message: 'Cupom Inválido!',
					autoHideDuration: 6000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'right'
					},
					variant: 'error'
				}))
		}
	}

	useEffect(() => {

		if (formik.values.current?.values.cpfCnpj && formik.values.current?.values.email) {
			setCustomerData({ email: formik.values.current?.values.email, cpfCnpj: formik.values.current?.values.cpfCnpj })
		} else if (cookies.cpfCnpj && cookies.email) {
			setCustomerData({ email: cookies.email, cpfCnpj: cookies.cpfCnpj })
		}

		if (customer && customer.length > 0) {
			dispatch(addCustomer(customer[0]))
		}

		dispatch(getTotals())

		if (referralCustomer?.referral && referralCustomer?.referral?.status) {
			dispatch(
				addReferral(
					{
						id: referralCustomer.id,
						name: referralCustomer.name,
						...referralCustomer?.referral
					}
				)
			)

			const subTotal = ((total * referralCustomer?.referral.discount) / 100)
			setDiscount(subTotal)
			setDiscountApplied(`${referralCustomer?.referral.discount}%`)
			dispatch(addDiscount({
				value: subTotal,
				code: 'REFERRAL',
				applied: `${referralCustomer?.referral.discount}%`
			}))
		}

	}, [setCustomerData, setCouponData, customer, total])

	const subscription = (options) => {
		if (!options || options.length === 0) return null;
		const foundOption = options.find((option) => option.type.toLowerCase() === period.toLowerCase());
		return foundOption || options[0];
	}

	useDeepCompareEffect(() => {
		dispatch(clearCart())

		if (product) {
			dispatch(addToCart({
				...product,
				quantity: 1,
				value: Number(product?.isSubscription ? subscription(product?.subscriptionOptions)?.value : product?.priceTaxIncl)
			}))
		}

		if (amount && routeParams.id === 'billing') {
			dispatch(addToCart({
				id: 1,
				name: 'Pagamento',
				image: '',
				images: [{ id: 1, name: 'Pagamento' }],
				upProducts: [],
				quantity: 1,
				installments: 0,
				value: Number(amount)
			}))
		}

		setTimeout(() => {
			dispatch(getTotals())
			setLoading(false)
		}, 800)

	}, [routeParams, product])

	useEffect(() => {
		const ferchInstallments = async () => {
			const installments = []
			const installmentValue = []
			const installmentCount = cart.products[0]?.isSubscription
				? subscription(cart.products[0]?.subscriptionOptions)?.installments :
				cart.products[0]?.installments ? cart.products[0]?.installments : 1

			for (let index = 1; index <= installmentCount; index++) {
				let value = null
				const fees = 0.0292 / (1 - 1 / Math.pow(1 + 0.0292, index))
				const add = fees * total * index
				const addition = add - total
				const totalFees = fees * total * index

				if (index >= 1 && index <= 3) {
					value = {
						value: index,
						label: <><small className='installments text-base'>{index}x de</small> {formatCurrencyMap((total / index))}</>
					}
				} else {
					value = {
						value: index,
						label: <><small className='installments text-base'>{index}x de</small> {formatCurrencyMap((fees * total))}</>
					}
				}

				installments.push(value)
				installmentValue.push({
					id: index,
					total: index !== 1 ? totalFees.toFixed(2) : total.toFixed(2),
					value: index !== 1 ? (fees * total).toFixed(2) : total.toFixed(2)
				})
			}

			setValueInstallments(installments)

		}

		if (cart.products.length > 0 && cart.products[0]?.name) {
			gLogEvent('view_cart')
		}

		ferchInstallments()
		setSteps(determineSteps(cart.products));
	}, [cart.products, setValueInstallments, total]);


	const [open, setOpen] = React.useState(false);

	const handleClickListItem = () => {
		setOpen(true);
	}

	const handleClose = (newValue?: string) => {
		setOpen(false);

		if (newValue !== amount && !isNaN(Number(newValue))) {
			const newSearchParams = new URLSearchParams(location.search);
			newSearchParams.set('amount', newValue);
			const newUrl = `${location.pathname}?${newSearchParams.toString()}`;
			dispatch(updateProduct({ id: 1, newValue }));
			setAmount(newValue)
			history.push(newUrl);
		}
	}

	return (
		<Root className="flex flex-col flex-auto min-w-0 pb-0 sm:pb-96">
			<ThemeProvider theme={mainThemeDark}>
				<Box
					className="relative pb-112 px-16 sm:pb-208 sm:px-64 overflow-hidden bg-auto bg-no-repeat bg-top"
					sx={{
						backgroundImage: "url('assets/images/etc/banner-ick.png')",
						backgroundColor: '#710ffa',
						color: theme =>
							theme.palette.getContrastText(theme.palette.primary.main)
					}}
				>
					<div className={clsx('FusePageCarded-header', 'container flex flex-col justify-center')}>
						<div className="mt-20 mr-10 pt-16 sm:pt-32 h-144">
							<img className="hidden object-contain h-48 w-full translate-x-6 scale-125 z-50" src='assets/images/logo/logo-box-white.png' />
						</div>
					</div>
					<svg
						className="absolute inset-0 pointer-events-none"
						viewBox="0 0 960 540"
						width="100%"
						height="100%"
						preserveAspectRatio="xMidYMax slice"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g
							className="text-gray-700 opacity-25"
							fill="none"
							stroke="currentColor"
							strokeWidth="100"
						>
							<circle r="34" cx="196" cy="23" />
							<circle r="34" cx="790" cy="491" />
						</g>
					</svg>
				</Box>
			</ThemeProvider>
			<div className="flex flex-col items-center px-4 sm:px-40">
				<Box className="w-full max-w-sm md:max-w-7xl -mt-64 sm:-mt-96">
					<Formik
						innerRef={formikRef}
						initialValues={formInitialValues(cookies)}

						validationSchema={!validate || (steps.length === activeStep + 1) ? false : currentValidationSchema}
						onSubmit={_handleSubmit}
					>
						{({ isSubmitting, errors, values, setFieldValue }) => (
							<Form id={formId}>
								<Grid container spacing={2} className="product">
									<Grid item xs={12} md={8} className="order-last md:order-first">
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1, transition: { delay: 0.2 } }}
										>
											<Card className="relative mb-30 pt-0 sm:px-20 rounded-6 shadow hover:shadow-lg transition-shadow ease-in-out duration-150">
												<CardContent>
													<div className="py-4">
														<MobileStepper
															variant="dots"
															steps={3}
															position="static"
															activeStep={activeStep}
															nextButton={<></>}
															backButton={
																activeStep !== 0 && (
																	<Button
																		variant="outlined"
																		sx={{ borderRadius: 2 }}
																		startIcon={
																			<FuseSvgIcon>
																				heroicons-outline:arrow-narrow-left
																			</FuseSvgIcon>
																		}
																		onClick={_handleBack}
																	>
																		Voltar
																	</Button>
																)
															}
															sx={{
																flexGrow: 1,
																height: 60,
																bgcolor: 'transparent',
																justifyContent:
																	activeStep !== 0 ? 'space-between' : 'end',
																'& .MuiMobileStepper-dot': {
																	backgroundColor: 'primary.dark'
																},
																'& .MuiMobileStepper-dotActive ~ .MuiMobileStepper-dot':
																{
																	backgroundColor: '#eaeaf0'
																}
															}}
														/>
													</div>
													<Stack spacing={2}>
														<Stepper
															alternativeLabel={isMobile}
															activeStep={activeStep}
															connector={<QontoConnector />}
														>
															{steps.map(label => (
																<Step key={label}>
																	<ColorStepLabel StepIconComponent={QontoStepIcon}>
																		<Typography
																			variant="h4"
																			component="h2"
																			className="text-lg md:text-2xl md:m-8 antialiased font-semibold text-sky-400/75"
																		>
																			{label}
																		</Typography>
																	</ColorStepLabel>
																</Step>
															))}
														</Stepper>
													</Stack>

													<Reaptcha
														ref={captchaRef}
														size="invisible"
														sitekey="6LeMznUpAAAAAL8J6VHcqTKW1nUlXWHlC79SpLUm"
														onLoad={handleLoadReCaptcha}
														onVerify={recaptchaResponse => {
															setFieldValue('recaptcha', recaptchaResponse)
														}}
													/>
													{_renderStepContent(activeStep)}
													{(isMobile || isSmallScreen) ?
														<AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
															<Toolbar className='flex flex-col'>
																<div className="product-footer" style={{ background: 'transparent' }}>
																	<div className="grid grid-cols-3 gap-4 content-center items-center">
																		<div className="col-start-1 text-left">
																			<span className="text-white" style={{ fontSize: 16 }}>Valor total previsto</span>
																		</div>
																		<div className="col-end-4 col-span-2 content-center text-right">
																			{cart?.shipping?.delivery &&
																				<>
																					<h4 className="mb-0 text-white">
																						{`Entrega ${cart?.shipping.value > 0 ? FuseUtils.formatCurrency(cart?.shipping.value) : `Grátis`}`}
																					</h4>
																				</>
																			}
																			{discount > 0 ?
																				<>
																					<small className='mx-2 small-medium'>
																						<del style={{ textDecoration: 'line-through #dc3545', marginRight: 8 }}>{FuseUtils.formatCurrency(cart?.subTotal)}</del>
																						<span className="total proportional-nums">{(formatCurrencyMap(cart?.subTotal - discount))}</span>
																					</small>

																					<h4 className="mb-0 text-white">
																						{('Desconto de')} <>{FuseUtils.formatCurrency(discount)}</>
																					</h4>
																				</>
																				:
																				loading ? <Skeleton className="total" animation="wave" width="60%" /> :
																					<span className="total proportional-nums">
																						{values?.paymentMethod === 'card' && valueInstallments.length > 1 ?
																							values.installments
																								? valueInstallments[values.installments - 1].label
																								: valueInstallments[(cart.products[0]?.isSubscription ? subscription(cart.products[0]?.subscriptionOptions)?.installments : valueInstallments.length) - 1].label
																							: formatCurrencyMap(total)
																						}
																					</span>
																			}
																			{amount && (
																				<div className="flex flex-col justify-center w-full mt-12">
																					<div className="p-8 grid justify-items-center">
																						<Button className='w-[90%] rounded-8' variant="outlined" onClick={handleClickListItem}>Alterar valor</Button>
																					</div>
																				</div>
																			)}
																		</div>
																	</div>
																</div>
																<div className="mb-6 w-full">
																	<LoadingButton
																		fullWidth
																		className="bg-[#710ffa] hover:bg-[#5b05d4] text-lg font-semibold uppercase min-h-44 px-4 py-2 rounded-md shadow-sm ease-in-out duration-300"
																		onClick={() => _handleSubmitOn(values)}
																		loading={isSubmitting || loadingButton}
																		loadingPosition='end'
																		endIcon={<></>}
																		type="submit"
																		variant="contained"
																		color="primary"
																	>
																		{isSubmitting || loadingButton ? (
																			<span
																				className="flex items-center"
																				style={{ color: '#828199' }}
																			>
																				Loading…
																			</span>
																		) : (
																			<span>
																				{isLastStep
																					?
																					<div className='flex items-center'>
																						<span>Adquirir Agora</span>
																						<FuseSvgIcon className='inline-block mx-8'>heroicons-outline:check</FuseSvgIcon>
																					</div>
																					: <div className='flex items-center'>
																						<span>Próximo</span>
																						<FuseSvgIcon className='inline-block mx-8'>heroicons-outline:arrow-narrow-right</FuseSvgIcon>
																					</div>}
																			</span>
																		)}
																	</LoadingButton>
																</div>
															</Toolbar>
														</AppBar>
														:
														<div className="mt-20">
															<LoadingButton
																fullWidth
																className="btn btn-checkout btn-success px-4 py-2 rounded-md shadow-sm ease-in-out duration-300"
																onClick={() => _handleSubmitOn(values)}
																type="submit"
																variant="contained"
																color="primary"
																loading={isSubmitting || loadingButton}
																loadingPosition='end'
																endIcon={<></>}
															>
																{isSubmitting || loadingButton ? (
																	<span
																		className="flex items-center"
																		style={{ color: '#828199' }}
																	>
																		Loading…
																	</span>
																) : (
																	<span>
																		{isLastStep
																			?
																			<div className='flex items-center'>
																				<span>Adquirir Agora</span>
																				<FuseSvgIcon className='inline-block mx-8'>heroicons-outline:check</FuseSvgIcon>
																			</div>
																			: <div className='flex items-center'>
																				<span>Próximo</span>
																				<FuseSvgIcon className='inline-block mx-8'>heroicons-outline:arrow-narrow-right</FuseSvgIcon>
																			</div>}
																	</span>
																)}
															</LoadingButton>
														</div>
													}
												</CardContent>
												<div className="flex flex-col items-center my-24 px-12 text-justify">
													<p className="small text-wrap mb-0">
														<small>
															Este site é criptografadas e protegido por reCAPTCHA e
															Google.{' '}
															<a
																href="https://policies.google.com/privacy"
																target="_blank"
																title="Política de privacidade"
															>
																Política de privacidade
															</a>{' '}
															e{' '}
															<a
																href="https://policies.google.com/terms"
																target="_blank"
																title="Termos de serviço"
															>
																Termos de serviço
															</a>{' '}
															se aplicam.
														</small>
													</p>
													<p className="small text-wrap mb-0">
														<small>
															DPay está processando este pedido à serviço de{' '}
															<b>DIGITAL STAGE</b>. Ao prosseguir você está
															concordando com os{' '}
															<a
																href="https://creabox.com.br/termos-de-compra/"
																target="_blank"
																title="Termos de compra"
															>
																Termos de compra
															</a>
														</small>
													</p>
													<div className="grid grid-cols-5 gap-4 mt-8 justify-items-center content-center items-center">
														<Image src="assets/images/flags/payment/visa.svg" alt="Visa" />
														<Image src="assets/images/flags/payment/mastercard.svg" alt="Mastercard" />
														<Image src="assets/images/flags/payment/dinners.svg" alt="dinners" />
														<Image src="assets/images/flags/payment/hipercard.svg" alt="hipercard" />
														<Image src="assets/images/flags/payment/elo.svg" alt="elo" />
													</div>
												</div>
											</Card>
										</motion.div>
									</Grid>
									<Grid item xs={12} md={4} className='relative md:sticky top-10 h-fit'>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1, transition: { delay: 0.3 } }}
										>
											<Card
												sx={{ height: 'max-content' }}
												className="relative rounded-6 shadow hover:shadow-lg transition-shadow ease-in-out duration-150"
											>
												<CardHeader
													sx={{ padding: 0 }}
													title={
														<Typography
															className="flex content-center product-header p-0 text-white text-48"
															component={'div'}
														>
															<FuseSvgIcon className="inline-block">heroicons-solid:shield-check</FuseSvgIcon>
															<span className="px-6">COMPRA 100% SEGURA</span>
														</Typography>
													}
												/>
												<CardContent sx={{ padding: '0 !important' }}>
													{referralCustomer?.referral && referralCustomer?.referral.status &&
														<motion.div
															initial={{ opacity: 0 }}
															animate={{ opacity: 1, transition: { delay: 0.3 } }}
														>
															<ReferralLabels referralCustomer={{ name: referralCustomer.name, referral: referralCustomer.referral }}
															/>
															<Divider sx={{ borderStyle: 'dashed', my: 2 }} />
														</motion.div>
													}
													{cart?.products.length > 0 ? (
														cart.products.map((item, k) => {
															const subscriptionOption = subscription(item.subscriptionOptions);
															return (
																<div key={k}>
																	{k > 0 ? <Divider /> : ''}
																	<div className="content-card">
																		<div className="imagem-produto">
																			{(item?.images?.length > 0 || item?.image) && !loading ? (

																				item.featuredImageId ? (
																					<Image
																						className="w-full block rounded product-img"
																						sx={{ width: 120, height: 120 }}
																						src={_.find(item.images, { id: item.featuredImageId })?.url}
																						alt={item.name}
																						visibleByDefault
																						ratio={{ xs: '1/1', sm: '1/1' }}

																					/>
																				) : (
																					<Image
																						className="w-full block rounded product-img"
																						sx={{ width: 120, height: 120 }}
																						src={`${item?.image ? item?.image : 'assets/images/apps/ecommerce/on-payment.png'}`}
																						alt={item.name}
																						visibleByDefault
																						ratio={{ xs: '1/1', sm: '1/1' }}
																					/>
																				)

																			) : (
																				<Skeleton
																					sx={{ borderRadius: 2 }}
																					animation="wave"
																					variant="rounded"
																					width={120}
																					height={120}
																				/>
																			)}
																		</div>
																		<div className="info-card">
																			<div className="product-name">
																				<Typography variant="h6">
																					{loading ? (
																						<Skeleton animation="wave" width="100%" />)
																						:
																						item.name
																					}
																				</Typography>
																			</div>
																			<div className="product-price">
																				<small className="d-block small-text">
																					{loading ? (
																						<Skeleton animation="wave" width="100%" />
																					) : (
																						<>
																							{
																								item?.isSubscription ?
																									`${subscriptionOption?.installments}x de ${FuseUtils.formatCurrency((subscriptionOption?.value / subscriptionOption?.installments))} - ${subscriptionOption?.type}`
																									:
																									`${FuseUtils.formatCurrency(item.value)} ${item.subscription ? item.cycle : 'à vista'}`
																							}
																						</>
																					)}
																				</small>
																			</div>
																		</div>
																	</div>
																</div>
															)
														})
													) : (
														<div className="content-card" key={1}>
															<div className="imagem-produto">
																<Skeleton
																	sx={{ borderRadius: 2 }}
																	animation="wave"
																	variant="rounded"
																	width={120}
																	height={120}
																/>
															</div>
															<div className="info-card">
																<div className="product-name">
																	<Typography variant="h6">
																		<Skeleton animation="wave" width="100%" />
																	</Typography>
																</div>
																<div className="product-price">
																	<Skeleton animation="wave" width="100%" />
																</div>
															</div>
														</div>
													)}
													{cart?.products[0]?.coupon &&
														<div className='discount-card m-20'>
															<Accordion>
																<AccordionSummary
																	aria-controls="panel1a-content"
																	id="panel1a-header"
																	expandIcon={<FuseSvgIcon className="text-48" size={24} color="action">heroicons-outline:chevron-down</FuseSvgIcon>}
																>
																	<div className='flex items-center'>
																		<FuseSvgIcon className="text-48" size={24}>heroicons-outline:ticket</FuseSvgIcon>
																		<Typography className='px-2' component='h6' variant='subtitle1'>Tem um cupom de desconto?</Typography>
																	</div>
																</AccordionSummary>
																<AccordionDetails>

																	<div className="flex">
																		{discount === 0 ?
																			<Autocomplete
																				freeSolo
																				options={[]}
																				renderTags={() => null}
																				renderInput={(params: any) => (
																					<InputField {...params}
																						InputProps={{
																							endAdornment: (
																								<InputAdornment position="end">
																									<Button className='uppercase rounded-md' sx={{ mr: -0.5, mt: -2.2 }} disabled={discount !== 0 || !values.coupon ? true : false} onClick={checkPromoCode}>
																										Aplicar
																									</Button>
																								</InputAdornment>
																							),
																						}}
																						name={formField.coupon.name}
																						label={formField.coupon.label}
																						fullWidth
																					/>
																				)}
																				fullWidth
																				sx={{
																					'& .MuiInputBase-root': {
																						paddingRight: '20px !important'
																					}
																				}}
																			/>
																			:
																			<Chip
																				color='success'
																				label={`${values?.coupon ? values?.coupon.toUpperCase() : 'INDICAÇÃO'} (${discountApplied} OFF)`}
																				onDelete={removePromoCode}
																			/>
																		}
																	</div>
																</AccordionDetails>
															</Accordion>
														</div>
													}
													{(!isMobile || !isSmallScreen) && (
														<div className="product-footer">
															<span className="text-white">Valor total previsto</span>
															{cart?.shipping?.delivery &&
																<>
																	<h4 className="mb-0 text-white">
																		{`Entrega ${cart?.shipping.value > 0 ? FuseUtils.formatCurrency(cart?.shipping.value) : `Grátis`}`}
																	</h4>
																</>
															}
															{discount > 0 ?
																<>
																	<small className='mx-2 small-medium'>
																		<del style={{ textDecoration: 'line-through #dc3545', marginRight: 8 }}>{FuseUtils.formatCurrency(cart?.subTotal)}</del>
																		<span className="total proportional-nums">{(formatCurrencyMap(cart?.subTotal - discount))}</span>
																	</small>

																	<h4 className="mb-0 text-white">
																		{('Desconto de')} <>{FuseUtils.formatCurrency(discount)}</>
																	</h4>
																</>
																:
																loading ? <Skeleton className="total" animation="wave" width="60%" /> :
																	<span className="total proportional-nums">
																		{values?.paymentMethod === 'card' && valueInstallments.length > 1 ?
																			values.installments
																				? valueInstallments[values.installments - 1].label
																				: valueInstallments[(cart.products[0]?.isSubscription ?
																					subscription(cart.products[0]?.subscriptionOptions)?.installments : valueInstallments.length) - 1].label
																			: formatCurrencyMap(total)
																		}
																	</span>
															}
															{amount && (
																<div className="flex flex-col justify-center w-full mt-12">
																	<div className="p-8 grid justify-items-center">
																		<Button className='w-[90%] rounded-8' variant="outlined" onClick={handleClickListItem}>Alterar valor</Button>
																	</div>
																</div>
															)}
														</div>
													)}
												</CardContent>
											</Card>
										</motion.div>
									</Grid>
								</Grid>
							</Form>
						)}
					</Formik>
				</Box>
				<Dialog
					open={process}
					fullWidth
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
					style={{ backdropFilter: 'blur(5px)' }}
				>
					<DialogTitle className='text-center'>{'Validação em andamento'}</DialogTitle>
					<DialogContent sx={{ marginY: 2 }}>
						<Grid
							container
							direction="row"
							justifyContent="center"
							alignItems="center"
						>
							{_renderTextoProcess(routeParams, process)}
							<CircularProgress color="inherit" />
						</Grid>
					</DialogContent>
				</Dialog>
				<ConfirmationDialogRaw
					id="ringtone-menu"
					keepMounted
					open={open}
					onClose={handleClose}
					value={amount}
				/>
			</div >
		</Root >
	);
}

export default CheckoutPage;

export interface ConfirmationDialogRawProps {
	id: string;
	keepMounted: boolean;
	value: string;
	open: boolean;
	onClose: (value?: string) => void;
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
	const { onClose, value: valueProp, open, ...other } = props;
	const [value, setValue] = useState(valueProp);
	const [error, setError] = useState(false);

	useEffect(() => {
		if (!open) {
			setValue(valueProp);
		}
	}, [valueProp, open]);

	const handleCancel = () => {
		onClose();
	};

	const handleOk = () => {
		onClose(value);
	}

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const inputValue = (event.target as HTMLInputElement).value
		const regex = /^\d*\.?\d{0,2}$/

		const floatValue = parseFloat(inputValue)
		const isInRange = floatValue >= 25 && floatValue <= 5000
		setValue(inputValue)

		if (regex.test(inputValue) && isInRange) {
			setError(false)
		} else {
			setError(true)
		}
	}

	return (
		<Dialog
			sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 }, color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
			fullWidth
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			style={{ backdropFilter: 'blur(5px)' }}
			maxWidth="xs"
			onClose={handleCancel}
			open={open}
			{...other}
		>
			<DialogTitle>Alterar valor</DialogTitle>
			<IconButton
				aria-label="close"
				onClick={handleCancel}
				sx={{
					position: 'absolute',
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
				}}
			>
				<FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
			</IconButton>
			<DialogContent dividers>
				<FormControl fullWidth>
					<TextField id="filled-basic" type='tel' value={value} onChange={handleInputChange} label="Novo valor"
						variant="filled"
						error={error}
						helperText={error ? 'O valor deve estar entre R$ 25 e R$ 5.000' : ''}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">R$</InputAdornment>
							)
						}} />
				</FormControl>
			</DialogContent>
			<DialogActions className='grid gap-4 grid-cols-2'>
				<Button className='rounded-8' autoFocus onClick={handleCancel}>
					Cancelar
				</Button>
				<Button className='rounded-8' variant='contained' color="secondary" onClick={handleOk}>Salvar</Button>
			</DialogActions>
		</Dialog>
	);
}