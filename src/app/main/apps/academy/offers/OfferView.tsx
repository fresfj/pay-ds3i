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
import { useGetAcademyOffersItemQuery } from '../AcademyApi';
import Grid from '@mui/material/Grid';
import { LazyLoadImage } from 'react-lazy-load-image-component';

/**
 * The contact view.
 */
function OfferView() {

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const routeParams = useParams();
	const { offerId: id, type = null } = routeParams;

	const {
		data: offer,
		isLoading,
		isError
	} = useGetAcademyOffersItemQuery(id, { skip: !id });


	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate('/apps/academy/offers');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!offer) {
		return null;
	}

	const ensureHttps = (url: string) => {
		if (!/^https?:\/\//i.test(url)) {
			return 'https://' + url;
		}
		return url;
	}

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}
			>
				{offer.establishmentImage?.cover && (
					<LazyLoadImage
						className="absolute inset-0 object-cover w-full h-full"
						src={offer.establishmentImage?.cover}
						alt="user background"
						effect="blur"
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
							alt={offer.name}
						>
							<LazyLoadImage
								src={offer.establishmentImage?.image}
								alt={offer.name}
								effect="blur"
								width={128}
								height={128}
								style={{ borderRadius: '50%' }}
							/>
						</Avatar>
					</div>

					<Typography className="mt-12 text-4xl font-bold truncate">{offer.name}</Typography>

					<div className="flex flex-wrap items-center mt-8">
						{offer?.category && Object.entries(offer.category).map(([key, text]) => (
							<Chip
								key={key}
								label={text}
								className="mr-12 mb-12"
								size="small"
							/>
						))}
					</div>
					<Divider className="mt-16 mb-24" />

					<div className="flex flex-col space-y-32">
						{offer.about && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:briefcase</FuseSvgIcon>
								<div className="ml-24 leading-6">{offer.about}</div>
							</div>
						)}

						{offer.site && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:external-link</FuseSvgIcon>
								<div className="ml-24 leading-6">
									<a
										className="hover:underline text-primary-500"
										href={ensureHttps(offer.site)}
										target="_blank"
										rel="noreferrer"
									>
										{offer.site}
									</a>
								</div>
							</div>
						)}

						{offer.establishmentAddress && (
							<div className="flex items-center">
								<FuseSvgIcon>heroicons-outline:location-marker</FuseSvgIcon>
								<div className="ml-24 leading-6">{offer.establishmentAddress?.formatAddress}</div>
							</div>
						)}

						{offer.rules && (
							<div className="flex">
								<FuseSvgIcon>heroicons-outline:menu-alt-2</FuseSvgIcon>
								<div
									className="max-w-none ml-24 prose dark:prose-invert"
									// eslint-disable-next-line react/no-danger
									dangerouslySetInnerHTML={{ __html: offer.rules }}
								/>
							</div>
						)}

						{offer?.benefits &&
							offer?.benefits?.length &&
							offer.benefits.some((item) => item.active) && (
								<div className="flex">
									<FuseSvgIcon>heroicons-outline:ticket</FuseSvgIcon>
									<div className="min-w-0 ml-24 space-y-28">
										{offer.benefits.map(
											(item, index) =>
												item.active && (
													<Grid container className="flex items-center leading-6" spacing={1} key={index}>
														<Grid item md={3} className='flex justify-center'>
															<span className="inline-flex items-center font-bold text-14 px-10 py-2 rounded-full tracking-wide uppercase bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50">{item.summary} OFF</span>
														</Grid>
														<Grid item md={9}>
															<Typography className="font-semibold">{item.description}</Typography>
															<Typography className="font-light max-w-none prose dark:prose-invert"
																// eslint-disable-next-line react/no-danger
																dangerouslySetInnerHTML={{ __html: item.rule }}
															/>
														</Grid>
													</Grid>
												)
										)}
									</div>
								</div>
							)}
					</div>
					<Box className="flex justify-center items-center mt-18 py-24 pr-16 pl-4 sm:pr-48 sm:pl-36">
						<Button
							className='h-48 px-28 bg-green-600 font-semibold text-white hover:bg-green-500 rounded-lg shadow-md hover:scale-110 transition delay-150 duration-300 ease-in-out py-38'
							size="large"
							onClick={() => { window.open(offer.store, '_blank') }}
							startIcon={<FuseSvgIcon className="text-48" size={24}>heroicons-outline:ticket</FuseSvgIcon>}>
							Usar oferta
						</Button>
					</Box>
				</div>
			</div>
		</>
	);
}

export default OfferView;
