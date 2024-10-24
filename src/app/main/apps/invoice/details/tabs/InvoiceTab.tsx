import Card from '@mui/material/Card';
import { alpha, styled } from '@mui/material/styles';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Box from '@mui/material/Box';
import FuseUtils from '@fuse/utils/FuseUtils';

const Root = styled('div')(({ theme }) => ({
	'& table ': {
		'& th:first-of-type, & td:first-of-type': {
			paddingLeft: `${0}!important`
		},
		'& th:last-child, & td:last-child': {
			paddingRight: `${0}!important`
		}
	},

	'& .divider': {
		width: 1,
		backgroundColor: theme.palette.divider,
		height: 144
	},

	'& .seller': {
		backgroundColor: theme.palette.primary.dark,
		color: theme.palette.getContrastText(theme.palette.primary.dark),
		marginRight: -88,
		paddingRight: 66,
		width: 480,
		'& .divider': {
			backgroundColor: theme.palette.getContrastText(theme.palette.primary.dark),
			opacity: 0.5
		}
	}
}));

type InvoiceTabProps = {
	order: any;
};

/**
 * The invoice tab.
 */
function InvoiceTab(props: InvoiceTabProps) {
	const { order } = props;

	const formatter = new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2
	});

	return (
		<Root className="grow shrink-0 p-0">
			{order && (
				<Card className="w-full mx-auto shadow-0">
					<CardContent className="p-88 print:p-0">
						<Typography
							color="text.secondary"
							className="mb-32"
						>
							{order.payment.dateCreated}
						</Typography>

						<div className="flex sm:flex-row flex-col items-center justify-between">
							<div>
								<table className="mb-16">
									<tbody>
										<tr>
											<td className="pb-4">
												<Typography
													className="font-light"
													variant="h6"
													color="text.secondary"
												>
													INVOICE
												</Typography>
											</td>
											<td className="pb-4 px-8">
												<Typography
													className="font-light"
													variant="h6"
													color="inherit"
												>
													{order.id}
												</Typography>
											</td>
										</tr>
									</tbody>
								</table>

								<Typography color="text.secondary">
									{`${order.customer.name}`}
								</Typography>

								{order.customer.invoiceAddress.address && (
									<Typography color="text.secondary">
										{order.customer.invoiceAddress.address}
									</Typography>
								)}
								{order.customer.phone && (
									<Typography color="text.secondary">{order.customer.phone}</Typography>
								)}
								{order.customer.email && (
									<Typography color="text.secondary">{order.customer.email}</Typography>
								)}
							</div>

							<Box className="grid grid-cols-3 grid-flow-col gap-x-16 sm:gap-x-32 py-24 rounded-l-2xl">
								<div className="place-self-center w-96">
									<img
										className="w-96 rounded-8"
										src="assets/images/logo/logo-box.svg"
										alt="logo"
									/>
								</div>
								<Box
									className="pl-10 sm:pl-20 col-span-2 border-l text-md"
									sx={{
										borderColor: theme =>
											alpha(
												theme.palette.getContrastText(
													theme.palette.primary.dark
												),
												0.25
											)
									}}
								>
									<Typography className="font-medium">
										CREABOX COMERCIO LTDA
									</Typography>
									<Typography>Curitiba - Paraná - Brasil</Typography>
									<Typography>suporte@creabox.com.br</Typography>
									<Typography>(41) 9 9149 6623</Typography>
									<Typography>CNPJ: 53.007.816/0001-03</Typography>
								</Box>
							</Box>
						</div>

						<div className="mt-64">
							<Table className="simple">
								<TableHead>
									<TableRow>
										<TableCell>PRODUCT</TableCell>
										<TableCell>PRICE</TableCell>
										<TableCell align="right">QUANTITY</TableCell>
										<TableCell align="right">TOTAL</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{order?.cart.products?.map((product) => (
										<TableRow key={product.id}>
											<TableCell>
												<Typography variant="subtitle1">{product.name}</Typography>
											</TableCell>
											<TableCell align="right">
												{product.value && formatter.format(+product.value)}
											</TableCell>
											<TableCell align="right">{product.quantity}</TableCell>
											<TableCell align="right">
												{product.value &&
													product.quantity &&
													formatter.format(+product.value * product.quantity)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>

							<Table className="simple mt-32">
								<TableBody>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												SUBTOTAL
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												{formatter.format(+order?.cart.subTotal)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												TAX
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												0
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												DISCOUNT
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-normal"
												variant="subtitle1"
												color="text.secondary"
											>
												{formatter.format(+order.cart.discount.value)}
											</Typography>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Typography
												className="font-light"
												variant="h4"
												color="text.secondary"
											>
												TOTAL
											</Typography>
										</TableCell>
										<TableCell align="right">
											<Typography
												className="font-light"
												variant="h4"
												color="text.secondary"
											>
												{formatter.format(+order.payment.value)}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>

						<div className="mt-96">
							<Typography
								className="mb-24 print:mb-12"
								variant="body1"
							>
								Please pay within 15 days. Thank you for your business.
							</Typography>

							<div className="flex">
								<div className="shrink-0">
									<img
										className="w-32"
										src="assets/images/logo/logo.svg"
										alt="logo"
									/>
								</div>

								<Typography
									className="font-normal mb-64 px-24"
									variant="caption"
									color="text.secondary"
								>
									In condimentum malesuada efficitur. Mauris volutpat placerat auctor. Ut ac congue
									dolor. Quisque scelerisque lacus sed feugiat fermentum. Cras aliquet facilisis
									pellentesque. Nunc hendrerit quam at leo commodo, a suscipit tellus dapibus. Etiam
									at felis volutpat est mollis lacinia. Mauris placerat sem sit amet velit mollis, in
									porttitor ex finibus. Proin eu nibh id libero tincidunt lacinia et eget eros.
								</Typography>
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</Root>
	);
}

export default memo(InvoiceTab);
