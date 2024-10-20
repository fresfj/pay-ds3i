import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Iconify } from '@fuse/components/iconify';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from 'app/store/store';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useCopyToClipboard } from '@fuse/hooks/use-copy-to-clipboard';
import { useSelector } from 'react-redux';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import FuseUtils from '@fuse/utils';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import { AnimatedCounter } from 'react-animated-counter';
import _ from '@lodash';
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Avatar, DialogActions, DialogTitle, Divider, Input, inputClasses, InputProps, lighten, ListItemText, Slider, styled, Tab, TableSortLabel, Tabs, TextField, Tooltip, tooltipClasses, useTheme } from '@mui/material';
import AvatarGroup from '@mui/material/AvatarGroup';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { Link } from 'react-router-dom';
import { m, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useCreateAccountsReferralItemMutation, useGetAccountsReferralQuery } from '../AccountApi';
import { User } from 'src/app/auth/user';
import { textGradient } from 'src/theme/styles';
import { ReferralDialog } from './ReferralDialog';
import format from 'date-fns/format';
import { useBoolean } from '@fuse/hooks/use-boolean';
import FuseLoading from '@fuse/core/FuseLoading';
import firebase from 'firebase/compat/app'
import { SendWhatsAppDialog } from '../components/dialogs/SendWhatsAppDialog';
import { deepOrange } from '@mui/material/colors';
import { AccountHistory } from './widgets/AccountHistory';

type InputAmountProps = InputProps & {
	autoWidth: number;
	amount: number | number[];
	winnings?: number;
};

type ConfirmTransferDialogProps = InputAmountProps &
	DialogProps & {
		contactInfo?: {
			id: string;
			name: string;
			email: string;
			avatarUrl: string;
			referral?: any
		};
		onClose: () => void;
	};

const PrettoSlider = styled(Slider)({
	color: '#5b41b9',
	height: 8,
	'& .MuiSlider-track': {
		border: 'none',
	},
	'& .MuiSlider-thumb': {
		height: 32,
		width: 32,
		backgroundColor: '#fff',
		border: '2px solid currentColor',
		'&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
			boxShadow: 'inherit',
		},
		'&::before': {
			display: 'none',
		},
	},
	'& .MuiSlider-valueLabel': {
		lineHeight: 1.2,
		fontSize: 12,
		background: 'unset',
		padding: 0,
		width: 32,
		height: 32,
		borderRadius: '50% 50% 50% 0',
		backgroundColor: '#5b41b9',
		transformOrigin: 'bottom left',
		transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
		'&::before': { display: 'none' },
		'&.MuiSlider-valueLabelOpen': {
			transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
		},
		'& > *': {
			transform: 'rotate(45deg)',
		},
	},
});

/**
 * The row type.
 */
type rowType = {
	id: string;
	align: 'left' | 'center' | 'right';
	disablePadding: boolean;
	label: string;
	sort: boolean;
};

/**
 * The rows.
 */
const rows: rowType[] = [
	{
		id: 'id',
		align: 'left',
		disablePadding: false,
		label: 'NAME',
		sort: true
	},
	{
		id: 'product',
		align: 'left',
		disablePadding: false,
		label: 'PRODUCT',
		sort: true
	},
	{
		id: 'payment',
		align: 'right',
		disablePadding: false,
		label: 'PAYMENT',
		sort: true
	},
	{
		id: 'status',
		align: 'center',
		disablePadding: false,
		label: 'STATUS',
		sort: true
	},
	{
		id: 'recovery',
		align: 'center',
		disablePadding: false,
		label: 'RECOVERY',
		sort: true
	},
	{
		id: 'date',
		align: 'right',
		disablePadding: false,
		label: 'DATE',
		sort: true
	}
];

function valueLabelFormat(value: number) {
	if (value === 1) {
		return `por indicação`
	} else {
		return `com ${value} indicações`;
	}

}

function calculateValue(value: number) {
	const ganhoPorIndicacao = 20;
	return value * ganhoPorIndicacao;
}

/**
 * The Referral card component.
 */
function ReferralCard() {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { copy } = useCopyToClipboard();
	const user = useSelector(selectUser) as User;
	const userId = user.data.customer.id
	const { t } = useTranslation('accountApp');
	const [open, setOpen] = useState<boolean>(false);
	const [openWhats, setOpenWhats] = useState<boolean>(false);
	const [value, setValue] = useState<number>(25);
	const [winnings, setWinnings] = useState<number>(0);
	const { data, isLoading } = useGetAccountsReferralQuery(user);
	const baseURL = `${window.location.protocol}//${window.location.host}`;
	const fullURL = `${baseURL}/plans?rid=${userId}`
	const confirm = useBoolean();
	const [client, setClient] = useState('')
	const [amount, setAmount] = useState(0);
	const [tabValue, setTabValue] = useState(0);
	const [autoWidth, setAutoWidth] = useState(34);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const contactInfo = {
		id: userId,
		name: user.data.displayName ? user.data.displayName : user.data.customer.name,
		email: user.data.customer.email,
		avatarUrl: user.data.customer.photoURL,
		referral: user.data.customer?.referral,
		balance: user.data.customer?.balance
	}

	useEffect(() => {
		if (amount) {
			handleAutoWidth();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [amount]);

	useEffect(() => {
		const unsubscribe = firebase.firestore().collection('customers').doc(userId).onSnapshot((doc) => {
			if (doc.exists) {
				setWinnings(doc.data()?.balance | 0);
			} else {
				console.log('Documento não encontrado!');
			}
		});
		return () => unsubscribe();
	}, [userId]);

	useEffect(() => {
		if (data) {
			const count = verificarStatus(data)
			setAmount(count * 20)
		}
	}, [data, client]);

	const handleAutoWidth = useCallback(() => {
		const getNumberLength = amount.toString().length;
		setAutoWidth(getNumberLength * 34);
	}, [amount]);

	const handleChangeInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(Number(event.target.value));
	}, []);

	const handleBlur = useCallback(() => {
		if (amount < 0) {
			setAmount(0);
		} else if (amount > MAX_AMOUNT) {
			setAmount(MAX_AMOUNT);
		}
	}, [amount]);

	const handleChange = (event: Event, newValue: number | number[]) => {
		if (typeof newValue === 'number') {
			setValue(newValue);
		}
	};

	const handleOpenDialog = () => {
		setOpen(true);
	};

	const handleCloseDialog = () => {
		setOpen(false);
	};

	const handleOpenWhatsDialog = (client: any) => {
		setClient({ ...client, url: fullURL })
		setOpenWhats(true);
	};

	const handleCloseWhatsDialog = () => {
		setOpenWhats(false);
	};

	const onCopy = useCallback(
		() => {
			dispatch(
				showMessage({
					message: 'Copied!',
					autoHideDuration: 6000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'right'
					},
					variant: 'success'
				}))
			copy(fullURL);

		},
		[copy]
	);

	const verificarStatus = (data) => {
		return data.filter((transacao) =>
			transacao.status.some(
				(status) => status.name === 'AUTHORIZED' || status.name === 'RECEIVED' || status.name === 'CONFIRMED'
			)
		)?.length;
	};

	const handleScroll = () => {
		document.getElementById('section-end').scrollIntoView({ behavior: 'smooth' });
	};

	function handleChangeTab(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

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
	return (
		<div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
			<div className="flex flex-col container items-center px-24 sm:px-64 pb-32 pt-12 sm:pb-52 sm:pt-36">
				<Card sx={{ display: { md: 'flex', sx: 'none' }, width: '100%', mx: 4 }}>
					<CardMedia
						component="img"
						sx={{ width: { md: 500, sx: '100vw' } }}
						image="assets/images/etc/quemindica.png"
						alt="Live from space album cover"
					/>
					<Box sx={{ display: 'flex', flexDirection: 'column', p: 4 }}>
						<CardContent sx={{ flex: '1 0 auto' }}>
							<Typography component="div" variant="h4" className='font-semibold'>
								Comece a participar do Indique e Ganhe
							</Typography>
						</CardContent>
						<CardContent sx={{ flex: '2 0 auto' }}>
							<ol className="list-decimal text-xl ">
								<li className='flex gap-14 mb-8 items-center'>
									<span className="bg-light-green-A400 flex min-w-36 min-h-36 items-center justify-center rounded-full font-bold">1</span>
									Compartilhe o seu link
								</li>
								<li className='flex gap-14 mb-8 items-center'>
									<span className="bg-light-green-A400 flex min-w-36 min-h-36 items-center justify-center rounded-full font-bold">2</span>
									Certifique-se de que a venda foi feita por meio dele</li>
								<li className='flex gap-14 items-center'>
									<span className="bg-light-green-A400 flex min-w-36 min-h-36 items-center justify-center rounded-full font-bold">3</span>
									Você receberá a confirmação após a primeira venda</li>
							</ol>
						</CardContent>
						<Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
							{user.data.customer?.referral ?
								<Button
									className="mx-8 whitespace-nowrap text-xl"
									variant="contained"
									color="secondary"
									endIcon={<Iconify icon="solar:copy-bold-duotone" />}

									onClick={() => { onCopy() }}
								>
									<span className="sm:flex mx-8">Seu link</span>
								</Button>
								:
								<Button
									onClick={handleOpenDialog}
									className="mx-8 whitespace-nowrap text-xl"
									variant="contained"
									color="secondary"
									endIcon={<Iconify icon="solar:chat-round-money-bold-duotone" />}
								>
									Indique agora
								</Button>
							}
							<Button
								className="mx-8 whitespace-nowrap text-xl"
								variant="outlined"
								color="secondary"
								endIcon={<Iconify icon="solar:link-minimalistic-2-line-duotone" />}
								onClick={handleScroll}
							>
								<span className="sm:flex mx-8">Saiba mais</span>
							</Button>
						</Box>
					</Box>
				</Card>
			</div>
			<Box
				sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', mt: 4 }}
				className="px-24 py-40 sm:px-64 sm:py-48 "
			>
				<div id='section-end' className="flex flex-col items-center px-24 sm:px-64">
					<div className="w-full max-w-7xl">
						<div className="grid w-full grid-cols-1 text-center md:text-start gap-x-24 items-center gap-y-48 sm:grid-cols-2 lg:gap-x-64">
							<div>
								<Typography variant='h4' component="div" className='m-0' gutterBottom>
									Você pode ganhar
								</Typography>
								<Box
									component={m.span}
									animate={{ backgroundPosition: '200% center' }}
									transition={{
										duration: 20,
										ease: 'linear',
										repeat: Infinity,
										repeatType: 'reverse',
									}}
									className="text-9xl font-500 font-['Cera_Pro']"
									sx={{
										...textGradient(
											`300deg, ${theme.palette.secondary.main} 0%, #5b41b9 25%, ${theme.palette.secondary.main} 50%, #5b41b9 75%, ${theme.palette.secondary.main} 100%`
										),
										backgroundSize: '400%'
									}}
								>
									R$ {calculateValue(value).toLocaleString('pt-BR')}
								</Box>
								<Typography variant='h5' component="div" className="leading-5 font-['Cera_Pro']" gutterBottom>
									{valueLabelFormat(value)}
								</Typography>
								<PrettoSlider
									value={value}
									min={1}
									step={1}
									max={50}
									scale={calculateValue}
									getAriaValueText={valueLabelFormat}
									valueLabelFormat={valueLabelFormat}
									onChange={handleChange}
									valueLabelDisplay="off"
									aria-labelledby="non-linear-slider"
								/>

								<Typography variant='body2' className='text-lg'>
									Ganhe muito dinheiro indicando os planos da CREABOX! A pessoa que adquirir por sua indicação recebe R$10 de desconto adicional no site</Typography>
							</div>
							<CardMedia
								component="img"
								className='overflow-visible relative'
								sx={{ height: '33vh' }}
								image="assets/images/etc/MessageConversation.png"
								alt="Live from space album cover"
							/>
						</div>
					</div>
				</div>
			</Box>
			<Box
				sx={{ backgroundColor: '#fcf5eb', color: '#222222' }}
				className="flex flex-col items-center px-24 py-32 sm:px-64 sm:py-72"
			>
				<div className="w-full max-w-7xl">
					<div className='overflow w-full'>
						{isMobile ?
							<img src='/assets/images/avatars/bg_t_wp_s.png' />
							:
							<img alt="balões de texto" src="/assets/images/avatars/bg_t_wp.png" />
						}
					</div>
					<div className='flex flex-col items-center text-center justify-center'>
						<Typography className="text-6xl font-bold leading-tight tracking-tight">
							Compartilhe os planos da CREABOX no seu WhatsApp
						</Typography>
						<Typography
							className="mt-8 text-xl"
							color="text.secondary"
						>
							Envie mensagens para seus contatos no WhatsApp com segurança e sem riscos. É rápido, fácil e gratuito!
						</Typography>

						<Button
							size='large'
							className="my-32 whitespace-nowrap text-2xl"
							variant="contained"
							color="secondary"
							component={Link}
							to="whatsapp"
							sx={{
								backgroundColor: '#25d366',
								color: '#111b21',
								transition: 'all 0.3s ease-in-out',
								'&:hover': {
									backgroundColor: '#1ebf57',
									color: '#ffffff',
									transform: 'scale(1.05)',
								},
							}}
						>
							<span className="sm:flex mx-8">Usar ferramenta exclusiva</span>
						</Button>
					</div>
					<div className='overflow w-full'>
						{isMobile ?
							<img alt="individuais" src="/assets/images/avatars/bg_b_wp_s.png" />
							:
							<img alt="individuais" src="/assets/images/avatars/bg_b_wp.png" />
						}
					</div>
				</div>
			</Box>
			{!user.data.customer?.referral &&
				<div id='section-end' className="flex flex-col items-center px-24 pb-44 pt-32 sm:px-64 sm:pb-64 sm:pt-64">
					<div className="w-full max-w-7xl">
						<div>
							<Typography className="text-4xl font-extrabold leading-tight tracking-tight">
								Como participar do Indique e Ganhe?
							</Typography>
							<Typography
								className="mt-8 max-w-xl text-xl"
								color="text.secondary"
							>
								Veja como é simples ganhar uma renda extra indicando para os seus amigos.
							</Typography>
						</div>
						<div className="mt-48 grid w-full grid-cols-1 gap-x-24 gap-y-48 sm:mt-64 sm:grid-cols-2 lg:gap-x-64">
							<div>
								<Typography variant='h5' className="text-3xl font-bold">1</Typography>
								<Typography
									variant='h6'
									className="mt-8 leading-6"
									color="text.secondary"
								>
									Para começar, cadastre-se no nosso programa de indicação (leva menos de 3 minutos).
								</Typography>
							</div>
							<div>
								<Typography variant='h5' className="text-3xl font-bold">2</Typography>
								<Typography
									variant='h6'
									className="mt-2 leading-6"
									color="text.secondary"
								>
									Em seguida, criaremos um link de divulgação exclusivo para você.
								</Typography>
							</div>
							<div>
								<Typography variant='h5' className="text-3xl font-bold">3</Typography>
								<Typography
									variant='h6'
									className="mt-8 leading-6"
									color="text.secondary"
								>
									Compartilhe seu link e certifique-se de que a compra seja feita por meio dele.
								</Typography>

							</div>
							<div>
								<Typography variant='h5' className="text-3xl font-bold">4</Typography>
								<Typography
									variant='h6'
									className="mt-8 leading-6"
									color="text.secondary"
								>
									Pronto! Quando a venda for concluída, você receberá sua comissão em conta.
								</Typography>

							</div>
						</div>
						<div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center mt-36">
							<Button
								onClick={handleOpenDialog}
								className="mt-32 px-48 text-xl"
								size="large"
								color="secondary"
								variant="contained"
							>
								Indique agora
							</Button>
						</div>
					</div>
				</div>
			}

			<Paper className="flex flex-col rounded-0 items-center px-24 py-40 sm:px-64 sm:pb-40 sm:pt-72">
				<div className="w-full max-w-7xl">
					<div>
						<Typography className="text-4xl font-extrabold leading-tight tracking-tight">
							Suas indicações
						</Typography>
					</div>
					<div className="mt-28 grid w-full grid-cols-1 gap-x-4 gap-y-8 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4 lg:gap-64">
						<Stack spacing={2.5} sx={{ p: 3, pt: 2 }} className='lg:col-span-4 sm:col-span-2'>
							<Stack direction={{ xs: 'column', sm: 'row' }} gap={2} alignItems="center" justifyContent="space-between">
								<Stack spacing={0.5}>
									<Box component="h4" className='text-xl font-semibold'>
										Você já indicou
									</Box>
									<Box component="span" className='text-2xl font-bold' sx={{ textAlign: 'right' }}>
										<AnimatedCounter value={data?.length} includeDecimals={false} />
									</Box>
								</Stack>
								<Stack spacing={0.5}>
									<Box component="h4" className='text-xl font-semibold'>
										Você vai receber
									</Box>
									<Box component="span" className='text-2xl font-bold' sx={{ textAlign: 'right' }}>
										{FuseUtils.formatCurrency(data?.length > 0 ? data?.length * 20 : 0)}
									</Box>
								</Stack>
								<Stack spacing={0.5}>
									<Box component="h4" className='text-xl font-semibold'>
										Você já ganhou
									</Box>
									<Box component="span" className='text-2xl font-bold' sx={{ textAlign: 'right' }}>
										{FuseUtils.formatCurrency(winnings)}
									</Box>
								</Stack>
								<Stack spacing={0.5}>
									<Stack
										direction="row"
										spacing={2}
										sx={{
											pb: 1,
											justifyContent: "space-between",
											alignItems: "center",
										}}
									>
										<Typography>
											Saldo disponível:
										</Typography>
										<Typography variant='inherit' component='span' className="font-['Cera_Pro'] font-semibold text-lg">
											{FuseUtils.formatCurrency(winnings)}
										</Typography>
									</Stack>
									<Button
										fullWidth
										size="large"
										color="secondary"
										variant="contained"
										disabled={amount === 0}
										onClick={confirm.onTrue}
										className='hover:scale-110 transition delay-150 duration-300 ease-in-out'
									>
										Solicitar transferência
									</Button>
								</Stack>
							</Stack>
						</Stack>
					</div>
				</div>
			</Paper>
			<Divider />
			<div className="mx-auto w-full max-w-7xl text-center flex flex-col rounded-0 items-center px-24 py-40 sm:px-64 sm:pb-80 sm:pt-52">
				{data?.length === 0 ?
					<>
						<Typography variant='h5' className='text-xl font-medium text-grey-A400'>
							Você ainda não tem nenhuma indicação registrada
						</Typography>
					</>
					:
					<>
						<div className="w-full min-w-full mb-20">
							<Tabs
								value={tabValue}
								onChange={handleChangeTab}
								indicatorColor="secondary"
								textColor="inherit"
								variant="scrollable"
								scrollButtons={false}
								className="w-full -mx-4 min-h-40"
								classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
								TabIndicatorProps={{
									children: (
										<Box
											sx={{ bgcolor: 'text.disabled' }}
											className="w-full h-full rounded-full opacity-20"
										/>
									)
								}}
							>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
									disableRipple
									label="Histórico de Indicações"
								/>
								<Tab
									className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12"
									disableRipple
									label="Histórico da Conta"
								/>
							</Tabs>
						</div>

						<motion.div
							className="w-full min-w-full"
							variants={container}
							initial="hidden"
							animate="show"
						>
							<Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden h-full">
								{tabValue === 0 &&
									<motion.div variants={item}>
										<TableContainer component={Paper}>
											<Table aria-label="table">
												<TableHead>
													<TableRow className="h-48 sm:h-64">
														{rows.map((row) => {
															return (
																<TableCell
																	sx={{
																		backgroundColor: (theme) =>
																			theme.palette.mode === 'light'
																				? lighten(theme.palette.background.default, 0.4)
																				: lighten(theme.palette.background.default, 0.02)
																	}}
																	className="p-4 md:p-16"
																	key={row.id}
																	align={row.align}
																	padding={row.disablePadding ? 'none' : 'normal'}
																>
																	{row.sort && (
																		<Tooltip
																			title="Sort"
																			placement={row.align === 'right' ? 'bottom-end' : 'bottom-start'}
																			enterDelay={300}
																		>
																			<TableSortLabel
																				className="font-semibold"
																			>
																				{t(row.label)}
																			</TableSortLabel>
																		</Tooltip>
																	)}
																</TableCell>
															);
														})}
													</TableRow>
												</TableHead>
												<TableBody>
													{data && [...data].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((row, k) => (
														<TableRow
															key={row.id}
															sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
														>
															<TableCell component="th" scope="row">
																<Typography className='font-medium'>
																	{row.customer.firstName}
																</Typography>
																<Typography className='font-normal text-xs'>
																	{row.customer.email}
																</Typography>
															</TableCell>
															<TableCell align="right">
																{Boolean(row.products.length) && (
																	<div className="flex items-center">
																		<AvatarGroup max={2}>
																			{row.products.map((product, index) => (
																				<Tooltip
																					key={index}
																					placement="top"
																					title={product.name}
																					slotProps={{
																						popper: {
																							sx: {
																								[`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
																									{ marginBottom: '0px' },
																							},
																						},
																					}}
																				>
																					<Avatar
																						sx={{ bgcolor: deepOrange[500] }}
																						alt={product.name}
																						className='inline-block rounded-lg ring-2 ring-white bg-white'
																						src={product.images ? _.find(product.images, { id: product.featuredImageId })?.url : 'assets/images/apps/ecommerce/creabox-box.png'}
																					/>
																				</Tooltip>
																			))}
																		</AvatarGroup>
																	</div>
																)}
															</TableCell>
															<TableCell align="right">
																{FuseUtils.formatCurrency(row.total)}
															</TableCell>
															<TableCell
																align="center"
																component="th"
																scope="row"
															>
																<Typography
																	className={clsx(
																		'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
																		row.status[0].name === 'PENDING' &&
																		'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
																		row.status[0].name === 'CONFIRMED' &&
																		'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50',
																		(row.status[0].name === 'RECEIVED' ||
																			row.status[0].name === 'ACTIVE' ||
																			row.status[0].name === 'RECEIVED_IN_CASH' ||
																			row.status[0].name === 'AUTHORIZED') &&
																		'bg-blue-50 text-blue-800 dark:bg-blue-600 dark:text-blue-50'
																	)}
																>
																	{row.status[0].name}
																</Typography>
															</TableCell>
															<TableCell align="center" width={100}>
																{row.status[0].name === 'PENDING' &&
																	<Tooltip
																		placement="top"
																		title={
																			<>
																				Recuperação de carrinho<br />
																				Enviar whats para {row.customer.firstName}
																			</>
																		}
																		slotProps={{
																			popper: {
																				sx: {
																					[`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
																						{ marginBottom: '0px' },
																				},
																			},
																		}}
																	>
																		<Iconify onClick={() => handleOpenWhatsDialog(row.customer)} className='cursor-pointer hover:scale-110 transition delay-150 duration-300 ease-in-out' icon="fa-brands:whatsapp-square" sx={{ color: '#25d366' }} width={33} />
																	</Tooltip>
																}
															</TableCell>
															<TableCell align="right">{format(new Date(row.date), 'yyyy-MM-dd')}</TableCell>
														</TableRow>
													))}
												</TableBody>
											</Table>
										</TableContainer>
									</motion.div>
								}
							</Paper>
							{tabValue === 1 &&
								<AccountHistory userId={userId} />
							}
						</motion.div>
					</>
				}
			</div>

			<ReferralDialog open={open} onClose={handleCloseDialog} />
			<AnimatePresence><SendWhatsAppDialog open={openWhats} onClose={handleCloseWhatsDialog} clientInfo={client} /></AnimatePresence>
			<ConfirmTransferDialog
				amount={amount}
				winnings={winnings}
				onBlur={handleBlur}
				open={confirm.value}
				autoWidth={autoWidth}
				onClose={confirm.onFalse}
				contactInfo={contactInfo}
				onChange={handleChangeInput}
			/>


		</div>
	);

}

const STEP = 5;
const MIN_AMOUNT = 0;
const MAX_AMOUNT = 500;

function InputAmount({ autoWidth, amount, onBlur, onChange, sx, ...other }: InputAmountProps) {
	return (
		<Box sx={{ display: 'flex', mr: 1, justifyContent: 'center', ...sx }}>
			<Box className="leading-5 font-['Cera_Pro']" component="span" sx={{ typography: 'h5' }}>R$</Box>
			<Input
				className="font-['Cera_Pro']"
				disableUnderline
				size="small"
				value={amount}
				onChange={onChange}
				onBlur={onBlur}
				inputProps={{
					step: STEP,
					min: MIN_AMOUNT,
					max: MAX_AMOUNT,
					type: 'number',
					id: 'input-amount',
				}}
				sx={{
					[`& .${inputClasses.input}`]: {
						p: 0,
						typography: 'h3',
						textAlign: 'center',
						width: autoWidth,
					},
				}}
				{...other}
			/>
		</Box>
	);
}

function ConfirmTransferDialog({
	open,
	amount,
	winnings,
	onBlur,
	onClose,
	onChange,
	autoWidth,
	contactInfo,
}: ConfirmTransferDialogProps) {
	const [loading, setLoading] = useState(false);
	const [description, setDescription] = useState('');
	const [transfer, setTransfer] = useState<any>('');
	const [error, setError] = useState('');
	const [createTransfer] = useCreateAccountsReferralItemMutation();

	const handleClear = async () => {
		setLoading(true);
		setTimeout(() => {
			setLoading(false);
			setError('')
			setTransfer('')
		}, 2800);
	}

	const handleClick = async () => {
		setLoading(true);

		if (Number(amount) > winnings) {
			setLoading(false);
			return false
		}

		await createTransfer({ ...contactInfo, description, value: amount })
			.unwrap()
			.then((action) => {
				setTransfer(action)
			}).catch((error) => {
				if (error.response) {
					console.log('Erro de resposta da API:', error.response.data)
					setError(error.response.data)
				} else if (error.request) {
					console.log('Nenhuma resposta recebida da API:', error.request)
				} else {
					console.log('Erro na configuração da requisição:', error.message)
				}
			})

		setTimeout(() => {
			setLoading(false);
			//onClose();
		}, 2800);
	};

	return (
		<Dialog open={open} fullWidth maxWidth="xs" onClose={onClose}>
			<DialogTitle>Transferir para</DialogTitle>
			<AnimatePresence>
				{!loading ? (
					<motion.div
						className="box"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{
							duration: 0.8,
							delay: 0.2,
							ease: [0, 0.71, 0.2, 1.01]
						}}
					>
						{transfer || error ?
							<>
								{error ?
									<Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
										<Iconify icon={'solar:bill-cross-bold-duotone'} className='text-red-700' width={68} />
										<Typography variant='h6' className='text-red-700'>Pix não realizado</Typography>
										<Typography variant='body1' className='text-grey-700'>{error}</Typography>
									</Box>
									:
									<Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', justifyContent: 'center' }}>
										<Iconify icon={'solar:bill-check-bold-duotone'} className='text-green-700' width={68} />
										<Typography variant='h6' className='text-green-700'>Pix realizado com sucesso</Typography>
										<Typography variant='body1' className='text-grey-700'>
											Sua transação foi concluída com sucesso.
										</Typography>

										{transfer &&
											<Box className="text-left font-['Cera_Pro']">
												<Divider className="my-20 border-dashed border-b border-gray-300" />

												<Typography variant='body1' className='text-grey-700 mb-8'>
													Dados Transação
												</Typography>
												<ul className="list-inside list-none leading-6">
													<li className='text-ellipsis overflow-hidden'>Identificador: <strong>{transfer.id}</strong></li>
													<li>Valor: <strong>{FuseUtils.formatCurrency(transfer.value)}</strong></li>
													<li>Data: <strong>{format(new Date(transfer.scheduleDate), 'dd/MM/yyyy')}</strong></li>
												</ul>
											</Box>
										}
									</Box>
								}
							</>
							: <Box sx={{ px: 3, gap: 3, display: 'flex', flexDirection: 'column' }}>
								<Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
									<Avatar src={contactInfo?.avatarUrl} sx={{ width: 48, height: 48 }} />
									<ListItemText
										primary={contactInfo?.name}
										secondary={
											<>
												{contactInfo?.referral?.pix?.pixAddressKey
													? `Chave Pix: ${contactInfo?.referral?.pix?.pixAddressKey}` : ''}
											</>
										}
										secondaryTypographyProps={{ component: 'span', mt: 0.5 }}
									/>
								</Box>

								<InputAmount
									onBlur={onBlur}
									onChange={onChange}
									autoWidth={autoWidth}
									amount={amount}
									disableUnderline={false}
									sx={{ justifyContent: 'flex-end' }}
								/>

								<TextField fullWidth multiline rows={3} placeholder="Descrição da transação..." onChange={(event) => setDescription(event.target.value)} />
							</Box>
						}
					</motion.div>
				) :
					<FuseLoading />
				}
			</AnimatePresence>
			<DialogActions>
				<Button onClick={onClose} variant='outlined' color='error'>Cancelar</Button>

				<motion.div
					whileTap={{ scale: 0.95 }}
					transition={{ duration: 0.2 }}
				>
					{!transfer && !error ?
						<Button
							color="success"
							variant="contained"
							disabled={amount === 0 || loading}
							onClick={handleClick}
							sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
						>

							{loading ? (
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 0.5 }}
								>
									<Iconify icon="line-md:loading-loop" color="#25d366" width={32} />
								</motion.div>
							) : (
								"Transferir"
							)}
						</Button>
						:
						<Button
							color="inherit"
							variant="contained"
							onClick={handleClear}
							sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
						>
							Fazer novamente
						</Button>
					}
				</motion.div>

			</DialogActions>
		</Dialog>
	);
}


export default ReferralCard;