import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import ModernPricingItemType from './ModernPricingItemType';
import { CheckoutPlans } from '../components/CheckoutPlans';
import { useForm, FormProvider } from 'react-hook-form';
import { selectFilteredProducts, useGetShopPlansQuery } from '../../product/ShopApi';
import { useSelector } from 'react-redux';
import { useRouter } from '@fuse/hooks/use-router';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Stack from '@mui/material/Stack';

type FormValues = {
	plan: string;
};

/**
 * The modern pricing page.
 */
function ModernPlansPage() {
	const [period, setPeriod] = useState<ModernPricingItemType['period']>('semestral');
	const methods = useForm();
	const [sortBy, setSortBy] = useState('featured');
	const { data, isLoading } = useGetShopPlansQuery();
	const products = useSelector(selectFilteredProducts(data, sortBy));
	const router = useRouter();
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)
	const customerId = searchParams.get('rid') || '';

	const handleApplyShipping = (e) => {
		//console.log(e.id)
	}

	const onSubmit = (data: FormValues) => {
		if (customerId) {
			router.push(`/checkout/${data.plan}?rid=${customerId}&period=${period}`);
		} else {
			router.push(`/checkout/${data.plan}?period=${period}`);
		}

	};
	return (
		<div className="flex h-screen w-screen flex-col items-center">
			<div className="relative flex min-w-0 flex-auto flex-col">
				<div className="relative overflow-visible px-4 pb-48 pt-32 sm:px-64 sm:pb-96 sm:pt-80">
					<svg
						className="pointer-events-none absolute inset-0 -z-1"
						viewBox="0 0 960 540"
						width="100%"
						height="100%"
						preserveAspectRatio="xMidYMax slice"
						xmlns="http://www.w3.org/2000/svg"
					>
						<Box
							component="g"
							sx={{ color: 'divider' }}
							className="opacity-20"
							fill="none"
							stroke="currentColor"
							strokeWidth="100"
						>
							<circle
								r="234"
								cx="196"
								cy="23"
							/>
							<circle
								r="234"
								cx="790"
								cy="491"
							/>
						</Box>
					</svg>
					<div className="flex flex-col items-center">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.05 } }}
						>
							<h2 className="text-lg sm:text-xl font-semibold">PLANOS</h2>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, y: 40 }}
							animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
						>
							<div className="mt-4 text-center text-3xl font-extrabold leading-tight tracking-tight sm:text-6xl">
								Quantas gramas de<br />creatina você consome diariamente?
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.2 } }}
						>
							<Box
								className="mt-32 flex items-center overflow rounded-full p-2 sm:mt-64"
								sx={{ backgroundColor: (theme) => darken(theme.palette.background.default, 0.05) }}
							>

								<Box
									component="button"
									className={clsx(
										'h-40 md:h-48 cursor-pointer items-center text-lg md:text-xl rounded-full px-24 font-medium',
										period === 'trimestral' && 'shadow'
									)}
									onClick={() => setPeriod('trimestral')}
									sx={{ width: { xs: 120, md: 140 }, backgroundColor: period === 'trimestral' ? 'background.paper' : '' }}
									type="button"
								>
									Trimestral
								</Box>

								<Box sx={{ position: 'relative', width: { xs: 120, md: 140 } }}>
									<Box
										sx={{
											position: 'absolute',
											top: { xs: -18.5, md: -20.5 },
											left: '50%',
											transform: 'translateX(-50%)',
											backgroundColor: '#7505FB',
											color: '#ecdffd',
											borderRadius: '6px',
											padding: '4px 6px',
											fontSize: { xs: 10, md: 12 },
											textAlign: 'center',
											width: '80%',
											fontWeight: '600',
										}}
									>
										Economize R$60
									</Box>
									<Stack
										direction="row"
										useFlexGap
										sx={{
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Box
											component="button"
											className={clsx(
												'h-40 md:h-48 cursor-pointer items-center text-lg md:text-xl rounded-full px-24 font-medium',
												period === 'semestral' && 'shadow'
											)}
											onClick={() => setPeriod('semestral')}
											sx={{ width: { xs: 120, md: 140 }, backgroundColor: period === 'semestral' ? 'background.paper' : '' }}
											type="button"
										>
											Semestral
										</Box>
									</Stack>
								</Box>
								<Box sx={{ position: 'relative', width: { xs: 120, md: 140 } }}>
									<Box
										sx={{
											position: 'absolute',
											top: { xs: -21, md: -23 },
											left: '50%',
											transform: 'translateX(-50%)',
											backgroundColor: '#7505FB',
											color: '#ecdffd',
											borderRadius: '6px',
											padding: '4px 6px',
											fontSize: { xs: 12, md: 14 },
											textAlign: 'center',
											width: '100%',
											fontWeight: '600',
										}}
									>
										Economize R$150
									</Box>
									<Stack
										direction="row"
										useFlexGap
										sx={{
											justifyContent: "center",
											alignItems: "center",
										}}
									>
										<Box
											component="button"
											className={clsx(
												'h-40 md:h-48 cursor-pointer items-center text-lg md:text-xl rounded-full px-24 font-medium',
												period === 'anual' && 'shadow'
											)}
											onClick={() => setPeriod('anual')}
											sx={{ width: { xs: 120, md: 140 }, backgroundColor: period === 'anual' ? 'background.paper' : '' }}
											type="button"
										>
											Anual
										</Box>
									</Stack>
								</Box>
							</Box>
						</motion.div>
					</div>
					<div className="relative mt-20 flex justify-center sm:mt-40">
						<div className="relative w-full max-w-sm md:max-w-7xl">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, transition: { delay: 0.2 } }}
							>
								<FormProvider {...methods}>
									<form>
										{!isLoading &&
											<div className="relative w-full h-screen">
												<CheckoutPlans period={period} onApplyShipping={handleApplyShipping} options={products} />
												<div style={{
													background: 'linear-gradient(to top, hsla(0, 0%, 100%, 0.01), hsla(0, 0%, 100%, 0.03))',
													backdropFilter: 'blur(2px)',
													WebkitBackdropFilter: 'blur(2px)',
												}}
													className='container px-40 sticky bottom-0 flex w-full justify-center py-4 mdl:hidden'>
													<Button
														className="text-xl py-8 my-8 transition-[background,color] duration-300 ease-in-out hover:scale-105 flex-row w-full px-6 h-12 rounded-full justify-center inline-flex gap-2 items-center text-neutral-800 font-medium disabled:bg-neutral-200 disabled:text-neutral-500 disabled:hover:bg-neutral-200 whitespace-nowrap bg-green-lime-500 hover:bg-green-lime-500 max-w-[50vw]"
														variant="contained"
														color="secondary"
														onClick={() => methods.handleSubmit(onSubmit)()}
														fullWidth
													>
														Continuar
													</Button>
												</div>
											</div>
										}

									</form>
								</FormProvider>
							</motion.div>

						</div>
					</div>
				</div>

			</div>
		</div>
	);
}

export default ModernPlansPage;
