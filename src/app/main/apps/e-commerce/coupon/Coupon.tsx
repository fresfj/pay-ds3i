import FuseLoading from '@fuse/core/FuseLoading';
import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import _ from '@lodash';
import { FormProvider, useForm } from 'react-hook-form';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CouponHeader from './CouponHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import { useGetECommerceCouponQuery } from '../ECommerceApi';
import CouponModel from './models/CouponModel';
import RulesTab from './tabs/RulesTab';

/**
 * Form Validation Schema
 */
const schema = z.object({
	code: z.string().nonempty('You must enter a coupon name').min(5, 'The coupon name must be at least 5 characters'),
	description: z.string().nonempty('You must enter a description').min(5, 'The description must be at least 5 characters'),
	value: z.string()
});

/**
 * The coupon page.
 */
function Coupon() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();

	const { couponId } = routeParams;

	const {
		data: coupon,
		isLoading,
		isError
	} = useGetECommerceCouponQuery(couponId, {
		skip: !couponId || couponId === 'new'
	});


	const [tabValue, setTabValue] = useState(0);

	const methods = useForm({
		mode: 'onChange',
		defaultValues: {},
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	useEffect(() => {
		if (couponId === 'new') {
			reset(CouponModel({}));
		}
	}, [couponId, reset]);

	useEffect(() => {
		if (coupon) {
			reset({ ...coupon });
		}
	}, [coupon, reset]);

	/**
	 * Tab Change
	 */
	function handleTabChange(event: SyntheticEvent, value: number) {
		setTabValue(value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	/**
	 * Show Message if the requested coupons is not exists
	 */
	if (isError && couponId !== 'new') {
		return (
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1, transition: { delay: 0.1 } }}
				className="flex flex-col flex-1 items-center justify-center h-full"
			>
				<Typography
					color="text.secondary"
					variant="h5"
				>
					There is no such coupon!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/coupons"
					color="inherit"
				>
					Go to Coupons Page
				</Button>
			</motion.div>
		);
	}

	/**
	 * Wait while coupon data is loading and form is setted
	 */
	if (_.isEmpty(form) || (coupon && routeParams.couponId !== coupon.id && routeParams.couponId !== 'new')) {
		return <FuseLoading />;
	}

	return (
		<FormProvider {...methods}>
			<FusePageCarded
				header={<CouponHeader />}
				content={
					<>
						<Tabs
							value={tabValue}
							onChange={handleTabChange}
							indicatorColor="secondary"
							textColor="secondary"
							variant="scrollable"
							scrollButtons="auto"
							classes={{ root: 'w-full h-64 border-b-1' }}
						>
							<Tab
								className="h-64"
								label="Basic Info"
							/>
							<Tab
								className="h-64"
								label="Rules"
							/>
						</Tabs>
						<div className="p-16 sm:p-24 max-w-3xl">
							<div className={tabValue !== 0 ? 'hidden' : ''}>
								<BasicInfoTab />
							</div>
							<div className={tabValue !== 1 ? 'hidden' : ''}>
								<RulesTab />
							</div>
						</div>
					</>
				}
				scroll={isMobile ? 'normal' : 'content'}
			/>
		</FormProvider>
	);
}

export default Coupon;
