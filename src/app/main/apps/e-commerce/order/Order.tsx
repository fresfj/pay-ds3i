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
import OrderDetailsTab from './tabs/OrderDetailsTab';
import ProductsTab from './tabs/ProductsTab';
import { useGetECommerceOrderQuery, useGetECommerceProductQuery } from '../ECommerceApi';
import axios from 'axios';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useAppDispatch } from 'app/store/store';
const API_BACKEND = import.meta.env.VITE_API_BACKEND

/**
 * The order.
 */
function Order() {
	const dispatch = useAppDispatch();
	const routeParams = useParams();
	const { orderId } = routeParams;
	const [isDisabled, setIsDisabled] = useState(false);

	const {
		data: order,
		isLoading,
		isError
	} = useGetECommerceOrderQuery(orderId, {
		skip: !orderId
	});


	const theme = useTheme();
	const isMobile = useThemeMediaQuery((_theme) => _theme.breakpoints.down('lg'));

	const [tabValue, setTabValue] = useState(0);

	function handleTabChange(event: React.SyntheticEvent, value: number) {
		setTabValue(value);
	}

	const { data: product } = useGetECommerceProductQuery(order?.products[0]?.id, { skip: !order?.products[0]?.id })

	let updatedOrder = null
	if (product) {
		const updatedProducts = order?.products.map((item, index) => {
			if (index === 0) {
				return { ...item, sku: product.sku };
			}
			return item;
		});
		updatedOrder = { ...order, products: updatedProducts };
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	if (isError) {
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
					There is no such order!
				</Typography>
				<Button
					className="mt-24"
					component={Link}
					variant="outlined"
					to="/apps/e-commerce/orders"
					color="inherit"
				>
					Go to Orders Page
				</Button>
			</motion.div>
		);
	}




	const handleBling = async () => {
		setIsDisabled(true);

		if (updatedOrder) {
			dispatch(showMessage({ message: 'Não há informações', variant: 'error' }))
		}

		try {
			const response = await axios.post(`${API_BACKEND}bling`, updatedOrder);
			await new Promise(resolve => setTimeout(resolve, 2000))
			dispatch(showMessage({ message: 'Seu pedido foi gerado no Bling', variant: 'success' }))
		} catch (error) {
			dispatch(showMessage({ message: error.response.data, variant: 'error' }))
		} finally {
			setIsDisabled(false);
		}
	};

	return (
		<FusePageCarded
			header={
				order && (
					<div className="flex w-full sm:w-auto flex-1 items-center justify-end space-x-8">
						<div className="flex flex-1 flex-col py-32 px-24 md:px-32">
							<motion.div
								initial={{ x: 20, opacity: 0 }}
								animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
							>
								<Typography
									className="flex items-center sm:mb-12"
									component={Link}
									role="button"
									to="/apps/e-commerce/orders"
									color="inherit"
								>
									<FuseSvgIcon size={20}>
										{theme.direction === 'ltr'
											? 'heroicons-outline:arrow-sm-left'
											: 'heroicons-outline:arrow-sm-right'}
									</FuseSvgIcon>
									<span className="mx-4 font-medium">Orders</span>
								</Typography>
							</motion.div>

							<motion.div
								initial={{ x: -20, opacity: 0 }}
								animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
								className="flex flex-col min-w-0"
							>
								<Typography className="text-20 truncate font-semibold">
									{`Order ${order?.reference ? order?.reference : order.id}`}
								</Typography>
								<Typography
									variant="caption"
									className="font-medium"
								>
									{`From ${order.customer.firstName} ${order.customer.lastName}`}
								</Typography>
							</motion.div>
						</div>
						<motion.div
							className="flex flex-grow-0"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
						>
							<Button
								className="mx-8"
								variant="contained"
								color="secondary"
								onClick={handleBling}
								disabled={isDisabled}
							>
								<FuseSvgIcon size={20}>feather:upload-cloud</FuseSvgIcon>
								<span className="hidden sm:flex mx-8">
									{isDisabled ? "Gerando o seu Pedido..." : "Gerar Pedido no Bling"}
								</span>
							</Button>
						</motion.div>
					</div>
				)
			}
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
							label="Order Details"
						/>
						<Tab
							className="h-64"
							label="Products"
						/>
						<Tab
							className="h-64"
							label="Invoice"
						/>
					</Tabs>
					{order && (
						<div className="p-16 sm:p-24 max-w-3xl w-full">
							{tabValue === 0 && <OrderDetailsTab />}
							{tabValue === 1 && <ProductsTab />}
							{tabValue === 2 && <InvoiceTab order={order} />}
						</div>
					)}
				</>
			}
			scroll={isMobile ? 'normal' : 'content'}
		/>
	);
}

export default Order;
