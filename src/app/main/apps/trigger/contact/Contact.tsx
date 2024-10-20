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
import CouponHeader from './ContactHeader';
import BasicInfoTab from './tabs/BasicInfoTab';
import { useGetContactQuery } from '../TriggerApi';
import CouponModel from './models/CouponModel';
import RulesTab from './tabs/RulesTab';

/**
 * Form Validation Schema
 */
const schema = z.object({
	name: z.string().min(5, 'The name must be at least 5 characters'),
	//contacts: z.array(z.string().min(1, 'Each contact must be at least 1 character')).min(1, 'Contacts must have at least one item'),
})

/**
 * The coupon page.
 */
function Campaign() {
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const routeParams = useParams();

	const { contactId } = routeParams;

	const {
		data: contact,
		isLoading,
		isError
	} = useGetContactQuery(contactId, {
		skip: !contactId || contactId === 'new'
	});

	const [tabValue, setTabValue] = useState(0);

	const methods = useForm({
		mode: 'onChange',
		resolver: zodResolver(schema)
	});

	const { reset, watch } = methods;

	const form = watch();

	console.log(`form`, form)
	useEffect(() => {
		if (contactId === 'new') {
			reset(CouponModel({}));
		}
	}, [contactId, reset]);

	useEffect(() => {
		if (contact) {
			reset({ ...contact });
		}
	}, [contact, reset]);

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
	if (isError && contactId !== 'new') {
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
					to="/apps/settings/trigger"
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


	if (_.isEmpty(form) || (contact && routeParams.contactId !== contact.id && routeParams.contactId !== 'new')) {
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
								label="Contacts"
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

export default Campaign;
