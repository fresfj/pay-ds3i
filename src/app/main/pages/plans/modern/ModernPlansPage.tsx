import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { darken } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import ModernPricingItemType from './ModernPricingItemType';
import { CheckoutPlans } from '../components/CheckoutPlans';
import { useForm, FormProvider } from 'react-hook-form';
import { selectFilteredProducts, useGetShopProductsQuery } from '../../product/ShopApi';
import { useSelector } from 'react-redux';
import { useRouter } from '@fuse/hooks/use-router';
import { useLocation } from 'react-router-dom';

type FormValues = {
	plan: string;
};

/**
 * The modern pricing page.
 */
function ModernPlansPage() {
	const [period, setPeriod] = useState<ModernPricingItemType['period']>('month');
	const methods = useForm();
	const [sortBy, setSortBy] = useState('featured');
	const { data, isLoading } = useGetShopProductsQuery();
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
			router.push(`/checkout/${data.plan}?rid=${customerId}`);
		} else {
			router.push(`/checkout/${data.plan}`);
		}

	};

	return (
		<div className="relative flex min-w-0 flex-auto flex-col overflow-hidden">
			<div className="relative overflow-hidden px-24 pb-48 pt-32 sm:px-64 sm:pb-96 sm:pt-80">
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
						<h2 className="text-xl font-semibold">PLANOS</h2>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
					>
						<div className="mt-4 text-center text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
							Quantas gramas de<br />creatina você consome diariamente?
						</div>
					</motion.div>
				</div>
				<div className="mt-20 flex justify-center sm:mt-80">
					<div className="w-full max-w-sm md:max-w-7xl">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.2 } }}
						>
							<FormProvider {...methods}>
								<form>
									{!isLoading &&
										<>
											<CheckoutPlans onApplyShipping={handleApplyShipping} options={products} />
											<div className="container flex flex-col px-40">
												<Button
													className="text-xl py-8 transition duration-300 ease-in-out hover:scale-105"
													variant="contained"
													color="secondary"
													onClick={() => methods.handleSubmit(onSubmit)()}
													fullWidth
												>
													Continuar
												</Button>
											</div>
										</>
									}
								</form>
							</FormProvider>
						</motion.div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ModernPlansPage;
