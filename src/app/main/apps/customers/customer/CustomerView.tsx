import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { useNavigate, useParams } from 'react-router-dom';
import FuseLoading from '@fuse/core/FuseLoading';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/system/Box';
import format from 'date-fns/format';
import _ from '@lodash';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import { useDispatch } from 'react-redux';
import { useGetCustomersItemQuery, useGetCustomersCountriesQuery, useGetCustomersTagsQuery } from '../CustomersApi';
import FuseUtils from '@fuse/utils/FuseUtils';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent, {
	timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent';
import clsx from 'clsx';

/**
 * The customer view.
 */
function CustomerView() {
	const { data: countries } = useGetCustomersCountriesQuery();
	const { data: tags } = useGetCustomersTagsQuery();
	const routeParams = useParams();
	const { id: customerId } = routeParams as { id: string };
	const {
		data: customer,
		isLoading,
		isError
	} = useGetCustomersItemQuery(customerId, {
		skip: !customerId
	});
	const dispatch = useDispatch();
	const navigate = useNavigate();

	function getCountryByIso(iso: string) {
		return countries?.find((country) => country.iso === iso);
	}

	function stringParaData(stringData) {
		const [dia, mes, ano] = stringData.split("/");
		return new Date(ano, mes - 1, dia);
	}

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate('/apps/customers');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!customer) {
		return null;
	}

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{customer.background && (
					<img
						className="absolute inset-0 object-cover w-full h-full"
						src={customer.background}
						alt="user background"
					/>
				)}
			</Box>
			<div className="relative flex flex-col flex-auto items-center p-24 pt-0 sm:p-48 sm:pt-0">
				<div className="w-full max-w-3xl">
					<div className="flex flex-auto items-end -mt-64">
						<Avatar
							sx={{
								borderWidth: 4,
								borderStyle: 'solid',
								borderColor: 'background.paper',
								backgroundColor: 'background.default',
								color: 'text.secondary'
							}}
							className="w-128 h-128 text-64 font-bold"
							src={customer.avatar}
							alt={customer.name}
						>
							{customer?.name?.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-4">
							<Button
								variant="contained"
								color="secondary"
								component={NavLinkAdapter}
								to="edit"
							>
								<FuseSvgIcon size={20}>heroicons-outline:pencil-alt</FuseSvgIcon>
								<span className="mx-8">Edit</span>
							</Button>
						</div>
					</div>

					<Typography className="mt-12 text-4xl font-bold truncate">{customer.name}</Typography>

					<div className="flex flex-wrap items-center mt-8">
						{customer?.tags?.map((id) => (
							<Chip
								key={id}
								label={_.find(tags, { id })?.title}
								className="mr-12 mb-12"
								size="small"
							/>
						))}
					</div>

					<Divider className="mt-16 mb-24" />

					<div className="flex flex-col space-y-32">
						{customer.title && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
								<div className="ml-24 leading-6">{customer.title}</div>
							</div>
						)}

						{customer.cpfCnpj && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:finger-print</FuseSvgIcon>
								<div className="ml-24 leading-6">{customer.cpfCnpj}</div>
							</div>
						)}
						{customer.title && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
								<div className="ml-24 leading-6">{customer.title}</div>
							</div>
						)}

						{customer?.emails?.length && customer.emails.some((item) => item.email?.length > 0) && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:mail</FuseSvgIcon>
								<div className="min-w-0 ml-24 space-y-4">
									{customer.emails.map(
										(item) =>
											item.email !== '' && (
												<div
													className="flex items-center leading-6"
													key={item.email}
												>
													<a
														className="hover:underline text-primary-500"
														href={`mailto: ${item.email}`}
														target="_blank"
														rel="noreferrer"
													>
														{item.email}
													</a>
													{item.label && (
														<Typography
															className="text-md truncate"
															color="text.secondary"
														>
															<span className="mx-8">&bull;</span>
															<span className="font-medium">{item.label}</span>
														</Typography>
													)}
												</div>
											)
									)}
								</div>
							</div>
						)}

						{customer?.phoneNumbers &&
							customer?.phoneNumbers?.length &&
							customer.phoneNumbers.some((item) => item.phoneNumber?.length > 0) && (
								<div className="flex">
									<FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
									<div className="min-w-0 ml-24 space-y-4">
										{customer.phoneNumbers.map(
											(item, index) =>
												item.phoneNumber !== '' && (
													<div
														className="flex items-center leading-6"
														key={index}
													>
														<Box
															className="hidden sm:flex w-24 h-16 overflow-hidden"
															sx={{
																background:
																	"url('/assets/images/apps/contacts/flags.png') no-repeat 0 0",
																backgroundSize: '24px 3876px',
																backgroundPosition: getCountryByIso(item.country)
																	?.flagImagePos
															}}
														/>

														<div className="sm:ml-12 font-mono">
															{getCountryByIso(item.country)?.code}
														</div>

														<div className="ml-10 font-mono">{item.phoneNumber}</div>

														{item.label && (
															<Typography
																className="text-md truncate"
																color="text.secondary"
															>
																<span className="mx-8">&bull;</span>
																<span className="font-medium">{item.label}</span>
															</Typography>
														)}
													</div>
												)
										)}
									</div>
								</div>
							)}

						{customer.address && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
								<div className="ml-24 leading-6">{
									customer.invoiceAddress.address ? customer.invoiceAddress.address : `${customer.address}, ${customer.addressNumber} - ${customer.neighborhood}, ${customer.city} - ${customer.state}, ${customer.postalCode}`
								}</div>
							</div>
						)}

						{customer.birthday && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:cake</FuseSvgIcon>
								<div className="ml-24 leading-6">{format(stringParaData(customer.birthday), 'MMMM d, y')}</div>
							</div>
						)}

						{customer.notes && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:menu-alt-2</FuseSvgIcon>
								<div
									className="max-w-none ml-24 prose dark:prose-invert"
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={{ __html: customer.notes }}
								/>
							</div>
						)}
						{customer.subscription && (
							<>
								<div className="flex items-center">
									<FuseSvgIcon>heroicons-outline:tag</FuseSvgIcon>
									<div className="ml-24 leading-6">
										{customer.subscription.description}
										<p className="flex items-baseline gap-x-2">
											<span className="text-sm font-bold tracking-tight text-gray-900">{FuseUtils.formatCurrency(customer.subscription.value)}</span>
											<span className="text-xs font-semibold leading-6 tracking-wide text-gray-600">{customer.subscription.cycle}</span>
										</p>
									</div>
								</div>
								{customer.subscription?.billingType === 'CREDIT_CARD' && customer.subscription.creditCard &&
									<div className="flex items-center">
										<FuseSvgIcon>heroicons-outline:credit-card</FuseSvgIcon>
										<div className="ml-24 leading-6 ">
											<div className="flex flex-warp grid-cols-2 items-center content-center justify-around">
												<div className='flex flex-warp items-center justify-between'>
													<img
														className="img-fluid w-32"
														alt="Flag Card"
														src={FuseUtils.cardFlag(customer.subscription.creditCard?.creditCardBrand)}
													/>
												</div>
												<span className="w-full flex flex-warp grid-cols-8 items-center content-center justify-between mt-2 mb-5">
													<span className="col-auto text-center">
														<h5 className="mb-0">****</h5>
													</span>
													<span className="col-auto text-center">
														<h5 className="mb-0">****</h5>
													</span>
													<span className="col-auto text-center">
														<h5 className="mb-0">****</h5>
													</span>
													<span className="col-auto text-center">
														<h5 className="mb-0">
															{customer.subscription.creditCard.creditCardNumber}
														</h5>
													</span>
												</span>
											</div>
										</div>
									</div>
								}
							</>
						)}
						{customer.subscriptions && (
							<div className="flex items-start">
								<FuseSvgIcon>heroicons-outline:cash</FuseSvgIcon>
								<div className="ml-24 leading-6">
									<Timeline
										className="pb-48"
										sx={{
											[`& .${timelineOppositeContentClasses.root}`]: {
												flex: 0.2,
											},
											'& .MuiTimelineItem-root:before': {
												display: 'none'
											}
										}}
									>
										{customer.subscriptions.map((item, index) => (
											<TimelineItem>
												<TimelineOppositeContent color="textSecondary">
													{format(new Date(item.dueDate), 'MMMM d, y')}
												</TimelineOppositeContent>
												<TimelineSeparator>
													<TimelineDot />
													<TimelineConnector />
												</TimelineSeparator>
												<TimelineContent>
													<div className="flex items-center">
														{FuseUtils.formatCurrency(item.value)}
													</div>
													<div className="mt-8 flex flex-col text-md leading-5 sm:mt-4 sm:flex-row sm:items-center sm:space-x-8">
														<Typography
															className={clsx(
																'inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase',
																item.status === 'PENDING' &&
																'bg-red-100 text-red-800 dark:bg-red-600 dark:text-red-50',
																item.status === 'CONFIRMED' &&
																'bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50',
																item.status === 'RECEIVED' &&
																'bg-blue-50 text-blue-800 dark:bg-blue-600 dark:text-blue-50'
															)}
														>
															{item.status}
														</Typography>
														<Typography
															className="text-13"
															color="text.secondary"
														>
															{item.confirmedDate ? format(new Date(item.confirmedDate), 'MMMM d, y') : ''}
														</Typography>
													</div>
												</TimelineContent>
											</TimelineItem>
										))}
									</Timeline>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}

export default CustomerView;
