import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GoogleMap from 'google-map-react';
import { useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'react-router-dom';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import OrdersStatus from '../OrdersStatus';
import FuseUtils from '@fuse/utils';
import { useGetECommerceOrderQuery } from '../../../e-commerce/ECommerceApi';

const mapKey = import.meta.env.VITE_MAP_KEY;

type MarkerPropsType = {
	text: string;
	lat: number;
	lng: number;
};

/**
 * The marker.
 */
function Marker(props: MarkerPropsType) {
	const { text, lat, lng } = props;
	return (
		<Tooltip
			title={
				<div>
					{text}
					<br />
					{lat}, {lng}
				</div>
			}
			placement="top"
		>
			<FuseSvgIcon className="text-red">heroicons-outline:location-marker</FuseSvgIcon>
		</Tooltip>
	);
}

/**
 * The order details tab.
 */
function OrderDetailsTab() {
	const routeParams = useParams();

	const { orderId } = routeParams;

	const { data: order, isError } = useGetECommerceOrderQuery(orderId, {
		skip: !orderId
	});

	const [map, setMap] = useState<string>('shipping');

	if (!isError && !order) {
		return null;
	}

	return (
		<div>
			<div className="pb-48">
				<div className="pb-16 flex items-center">
					<FuseSvgIcon color="action">heroicons-outline:user-circle</FuseSvgIcon>
					<Typography
						className="h2 mx-12 font-medium"
						color="text.secondary"
					>
						Customer
					</Typography>
				</div>

				<div className="mb-24">
					<div className="table-responsive mb-48">
						<table className="simple">
							<thead>
								<tr>
									<th>
										<Typography className="font-semibold">Name</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Email</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Document</Typography>
									</th>
									<th>
										<Typography className="font-semibold">Phone</Typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<div className="flex items-center">
											<Avatar src={order.customer.avatar} />
											<Typography className="truncate mx-8">
												{`${order.customer.firstName} ${order.customer.lastName}`}
											</Typography>
										</div>
									</td>
									<td>
										<Typography className="truncate">{order.customer.email}</Typography>
									</td>
									<td>
										<span className="truncate">{order.customer.cpfCnpj}</span>
									</td>
									<td>
										<Typography className="truncate">{order.customer.phone}</Typography>
									</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div className="space-y-12">
						<Accordion
							className="border-0 shadow-0 overflow-hidden"
							expanded={map === 'shipping'}
							onChange={() => setMap(map !== 'shipping' ? 'shipping' : '')}
							sx={{ backgroundColor: 'background.default', borderRadius: '12px!important' }}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className="font-semibold">Shipping Address</Typography>
							</AccordionSummary>
							<AccordionDetails className="flex flex-col md:flex-row">
								<Typography className="w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16">
									{order.customer.shippingAddress.address}
									{order.customer.complement &&
										<>
											<br />
											{`Complemento: ${order.customer.complement}`}
										</>
									}
								</Typography>
								<div className="w-full h-320 rounded-16 overflow-hidden mx-8">
									<GoogleMap
										bootstrapURLKeys={{
											key: mapKey
										}}
										defaultZoom={15}
										defaultCenter={{
											lng: order.customer.shippingAddress.lng,
											lat: order.customer.shippingAddress.lat
										}}
									>
										<Marker
											text={order.customer.shippingAddress.address}
											lat={order.customer.shippingAddress.lat}
											lng={order.customer.shippingAddress.lng}
										/>
									</GoogleMap>
								</div>
							</AccordionDetails>
						</Accordion>

						<Accordion
							className="border-0 shadow-0 overflow-hidden"
							expanded={map === 'invoice'}
							onChange={() => setMap(map !== 'invoice' ? 'invoice' : '')}
							sx={{ backgroundColor: 'background.default', borderRadius: '12px!important' }}
						>
							<AccordionSummary expandIcon={<ExpandMoreIcon />}>
								<Typography className="font-semibold">Invoice Address</Typography>
							</AccordionSummary>
							<AccordionDetails className="flex flex-col md:flex-row -mx-8">
								<Typography className="w-full md:max-w-256 mb-16 md:mb-0 mx-8 text-16">
									{order.customer.invoiceAddress.address}
									{order.customer.complement &&
										<>
											<br />
											{`Complemento: ${order.customer.complement}`}
										</>
									}
								</Typography>
								<div className="w-full h-320 rounded-16 overflow-hidden mx-8">
									<GoogleMap
										bootstrapURLKeys={{
											key: mapKey
										}}
										defaultZoom={15}
										defaultCenter={{
											lng: order.customer.invoiceAddress.lng,
											lat: order.customer.invoiceAddress.lat
										}}
									>
										<Marker
											text={order.customer.invoiceAddress.address}
											lat={order.customer.invoiceAddress.lat}
											lng={order.customer.invoiceAddress.lng}
										/>
									</GoogleMap>
								</div>
							</AccordionDetails>
						</Accordion>
					</div>
				</div>
			</div>
			{order.coupon?.code &&
				<div className="pb-48">
					<div className="pb-16 flex items-center">
						<FuseSvgIcon color="action">heroicons-outline:ticket</FuseSvgIcon>
						<Typography
							className="h2 mx-12 font-medium"
							color="text.secondary"
						>
							Coupon
						</Typography>
					</div>

					<div className="table-responsive">
						<Table className="simple">
							<TableHead>
								<TableRow>
									<TableCell>
										<Typography className="font-semibold">Code</Typography>
									</TableCell>
									<TableCell>
										<Typography className="font-semibold">Applied</Typography>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell>{order.coupon.code}</TableCell>
									<TableCell>{order.coupon?.applied}</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				</div>
			}

			<div className="pb-48">
				<div className="pb-16 flex items-center">
					<FuseSvgIcon color="action">heroicons-outline:clock</FuseSvgIcon>
					<Typography
						className="h2 mx-12 font-medium"
						color="text.secondary"
					>
						Order Status
					</Typography>
				</div>

				<div className="table-responsive">
					<Table className="simple">
						<TableHead>
							<TableRow>
								<TableCell>
									<Typography className="font-semibold">Status</Typography>
								</TableCell>
								<TableCell>
									<Typography className="font-semibold">Updated On</Typography>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{order.status.map((status) => (
								<TableRow key={status.id}>
									<TableCell>
										<OrdersStatus name={status.name} />
									</TableCell>
									<TableCell>{status.date}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className="pb-48">
				<div className="pb-16 flex items-center">
					<FuseSvgIcon color="action">heroicons-outline:currency-dollar</FuseSvgIcon>
					<Typography
						className="h2 mx-12 font-medium"
						color="text.secondary"
					>
						Payment
					</Typography>
				</div>
				<div className="table-responsive">
					<table className="simple">
						<thead>
							<tr>
								<th>
									<Typography className="font-semibold">TransactionID</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Payment Method</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Amount</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Date</Typography>
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<span className="truncate">{order.payment.transactionId}</span>
								</td>
								<td>
									{order.payment?.creditCard ? (
										<span className="flex flex-warp grid-cols-2 items-center content-center justify-around">
											<img
												className="img-fluid w-32"
												alt="Flag Card"
												src={FuseUtils.cardFlag(order?.payment?.creditCard?.creditCardBrand)}
											/>
											<span className="col-auto text-center">
												<h5 className="mb-0">
													{order?.payment?.creditCard?.creditCardNumber}
												</h5>
											</span>
										</span>

									) :
										<span className="truncate">{order.payment.method}</span>
									}
								</td>
								<td>
									<span className="truncate">{FuseUtils.formatCurrency(order.payment.amount)}</span>
								</td>
								<td>
									<span className="truncate">{order.payment.date}</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div className="pb-48">
				<div className="pb-16 flex items-center">
					<FuseSvgIcon color="action">heroicons-outline:truck</FuseSvgIcon>
					<Typography
						className="h2 mx-12 font-medium"
						color="text.secondary"
					>
						Shipping
					</Typography>
				</div>

				<div className="table-responsive">
					{order.shipping?.delivery &&
						<Typography className="h4 mx-12 font-medium">
							Deliver: {order.shipping?.title}
						</Typography>
					}
					<table className="simple">
						<thead>
							<tr>
								<th>
									<Typography className="font-semibold">Tracking Code</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Carrier</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Weight</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Fee</Typography>
								</th>
								<th>
									<Typography className="font-semibold">Date</Typography>
								</th>
							</tr>
						</thead>
						<tbody>
							{order.shippingDetails.map((shipping) => (
								<tr key={shipping.date}>
									<td>
										<span className="truncate">{shipping.tracking}</span>
									</td>
									<td>
										<span className="truncate">{shipping.carrier}</span>
									</td>
									<td>
										<span className="truncate">{shipping.weight}</span>
									</td>
									<td>
										<span className="truncate">{shipping.fee}</span>
									</td>
									<td>
										<span className="truncate">{shipping.date}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default OrderDetailsTab;
