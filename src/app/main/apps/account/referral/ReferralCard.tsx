import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Iconify } from '@fuse/components/iconify';
import { useCallback } from 'react';
import { useAppDispatch } from 'app/store/store';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useCopyToClipboard } from '@fuse/hooks/use-copy-to-clipboard';
import { useSelector } from 'react-redux';
import { selectUser } from 'src/app/auth/user/store/userSlice';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import FuseUtils from '@fuse/utils';
import { AnimatedCounter } from 'react-animated-counter';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Divider, lighten, TableSortLabel, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

function createData(
	name: string,
	calories: number,
	value: number,
	date: string,
	status: string,
) {
	return { name, calories, value, date, status };
}

const rowsLine = [
	createData('Fulano da Silva', 159, 6.0, '2024-09-12', 'PENDING'),
	createData('Fulano da Silva', 237, 9.0, '2024-09-12', 'PENDING'),
	createData('Fulano da Silva', 262, 16.0, '2024-09-12', 'CONFIRMED'),
	createData('Fulano da Silva', 305, 3.7, '2024-09-12', 'RECEIVED'),
	createData('Fulano da Silva', 356, 16.0, '2024-09-12', 'ACTIVE'),
];



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
		id: 'date',
		align: 'right',
		disablePadding: false,
		label: 'DATE',
		sort: true
	}
];

/**
 * The Referral card component.
 */
function ReferralCard() {
	const dispatch = useAppDispatch();
	const { copy } = useCopyToClipboard();
	const { uid } = useSelector(selectUser);
	const { t } = useTranslation('accountApp');

	const fullURL = window.location.href + `?rid=${uid}`;

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

	const handleScroll = () => {
		document.getElementById('section-end').scrollIntoView({ behavior: 'smooth' });
	};

	return (
		<div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
			<div className="flex flex-col container items-center px-24 sm:px-64 pb-32 pt-12 sm:pb-52 sm:pt-60">
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
							<Button
								className="mx-8 whitespace-nowrap text-xl"
								variant="contained"
								color="secondary"
								endIcon={<Iconify icon="solar:copy-bold-duotone" />}

								onClick={() => { onCopy() }}
							>
								<span className="hidden sm:flex mx-8">Seu link</span>
							</Button>
							<Button
								className="mx-8 whitespace-nowrap text-xl"
								variant="outlined"
								color="secondary"
								endIcon={<Iconify icon="solar:link-minimalistic-2-line-duotone" />}
								onClick={handleScroll}
							>
								<span className="hidden sm:flex mx-8">Saiba mais</span>
							</Button>
						</Box>
					</Box>
				</Card>
			</div>
			<div id='section-end' className="flex flex-col items-center px-24 pb-44 pt-32 sm:px-64 sm:pb-88 sm:pt-64">
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
				</div>
			</div>
			<Paper className="flex flex-col rounded-0 items-center px-24 py-40 sm:px-64 sm:pb-40 sm:pt-72">
				<div className="w-full max-w-7xl">
					<div>
						<Typography className="text-4xl font-extrabold leading-tight tracking-tight">
							Suas indicações
						</Typography>
					</div>
					<div className="mt-28 grid w-full grid-cols-1 gap-x-4 gap-y-8 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4 lg:gap-64">
						<Stack spacing={2.5} sx={{ p: 3, pt: 2 }} className='lg:col-span-3 sm:col-span-2'>
							<Stack direction={{ xs: 'column', sm: 'row' }} alignItems="center" justifyContent="space-between">
								<Stack spacing={0.5}>
									<Box component="h4" className='text-xl font-semibold'>
										Você já indicou
									</Box>
									<Box component="span" className='text-2xl font-bold' sx={{ textAlign: 'right' }}>
										<AnimatedCounter value={0} includeDecimals={false} />
									</Box>
								</Stack>
								<Stack spacing={0.5}>
									<Box component="h4" className='text-xl font-semibold'>
										Você já ganhou
									</Box>
									<Box component="span" className='text-2xl font-bold' sx={{ textAlign: 'right' }}>
										{FuseUtils.formatCurrency('0')}
									</Box>
								</Stack>
								<Stack spacing={0.5}>
									<Box component="h4" className='text-xl font-semibold'>
										Você vai receber
									</Box>
									<Box component="span" className='text-2xl font-bold' sx={{ textAlign: 'right' }}>
										{FuseUtils.formatCurrency('0')}
									</Box>
								</Stack>
							</Stack>
						</Stack>
					</div>
				</div>
			</Paper>
			<Divider sx={{ borderStyle: 'dashed' }} />
			<Paper className="flex flex-col rounded-0 items-center px-24 py-40 sm:px-64 sm:pb-80 sm:pt-52">
				<div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">

					{true ?
						<>
							<Typography variant='h5' className='text-xl font-medium text-grey-A400'>
								Você ainda não tem nenhuma indicação registrada
							</Typography>
						</>
						:
						<TableContainer component={Paper}>
							<Table className="w-full min-w-full" aria-label="table">
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
									{rowsLine.map((row) => (
										<TableRow
											key={row.name}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row">
												<Typography className='font-medium'>
													{row.name}
												</Typography>
											</TableCell>
											<TableCell align="right">
												{FuseUtils.formatCurrency(row.value)}
											</TableCell>
											<TableCell
												align="center"
												component="th"
												scope="row"
											>
												<Typography
													className={clsx(
														'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
														row.status === 'PENDING' &&
														'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
														row.status === 'CONFIRMED' &&
														'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50',
														(row.status === 'RECEIVED' ||
															row.status === 'ACTIVE') &&
														'bg-blue-50 text-blue-800 dark:bg-blue-600 dark:text-blue-50'
													)}
												>
													{row.status}
												</Typography>
											</TableCell>
											<TableCell align="right">{row.date}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					}
				</div>
			</Paper>
		</div>
	);

}

export default ReferralCard;
