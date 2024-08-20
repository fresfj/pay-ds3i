import FusePageCarded from '@fuse/core/FusePageCarded';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import * as React from 'react';
import FuseLoading from '@fuse/core/FuseLoading';
import InvoiceTab from './tabs/InvoiceTab';
import { useGetInvoiceOrderQuery } from '../InvoiceApi';
import InvoiceToolbar from './InvoiceToolbar';

/**
 * The order.
 */
function Details() {
	const routeParams = useParams();
	const { subscription, customer } = routeParams;

	const {
		data: order,
		isLoading,
		isError
	} = useGetInvoiceOrderQuery({ subscription, customer }, {
		skip: !subscription
	});


	const theme = useTheme();
	const isMobile = useThemeMediaQuery((_theme) => _theme.breakpoints.down('lg'));

	if (isLoading && !order) {
		return <FuseLoading />;
	}

	if (isError || !order) {
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
					There is no such invoice!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/apps/invoice/subscriptions"
					color="inherit"
				>
					Go to Invoice Page
				</Button>
			</motion.div>
		);
	}

	return (
		<FusePageCarded
			header={order &&
				<div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 sm:py-32 px-24 md:px-32">
					{/* <div className="flex flex-1 flex-col py-32 px-24 md:px-32"> */}
					<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
						<motion.div
							initial={{ x: 20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
						>
							<Typography
								className="flex items-center sm:mb-12"
								component={Link}
								role="button"
								to="/apps/invoice"
								color="inherit"
							>
								<FuseSvgIcon size={20}>
									{theme.direction === 'ltr'
										? 'heroicons-outline:arrow-sm-left'
										: 'heroicons-outline:arrow-sm-right'}
								</FuseSvgIcon>
								<span className="mx-4 font-medium">Invoice</span>
							</Typography>
						</motion.div>

						<motion.div
							initial={{ x: -20, opacity: 0 }}
							animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
							className="flex flex-col min-w-0"
						>
							<Typography className="text-20 truncate font-semibold">
								{`Invoice ${order?.reference ? order?.reference : order?.id.replace('sub_', '')}`}
							</Typography>
							<Typography
								variant="caption"
								className="font-medium"
							>
								{`From ${order?.customer?.name}`}
							</Typography>
						</motion.div>
					</div>
					<motion.div
						className="flex flex-1 w-full"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
					>
						<InvoiceToolbar invoice={order} />
					</motion.div>
				</div>
			}
			content={<InvoiceTab order={order} />}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Details;
