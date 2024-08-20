import _ from '@lodash';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { ChangeEvent, useEffect, useRef, useState, useCallback, SyntheticEvent } from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { Button, Card, CircularProgress, Divider, Fab, FormControlLabel, InputAdornment, Menu, Paper, Skeleton, Stack, Tab, Tabs } from '@mui/material';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import { Theme } from '@mui/material/styles';
import FuseLoading from '@fuse/core/FuseLoading';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { lighten, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation } from 'swiper/modules';

import OfferCard from './OfferCard';
import { Course, Offer, useGetAcademyCashbackQuery, useGetAcademyCategoriesQuery, useGetAcademyCoursesQuery, useGetAcademyOffersCategoriesQuery, useGetAcademyOffersQuery, useGetAcademyTeachersQuery } from '../AcademyApi';
import { Link } from 'react-router-dom';
import TeacherCard from '../teacher/TeacherCard';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CourseSidebarContent from '../CourseSidebarContent';
import { Image } from '@fuse/components/image'
import ClubScrollDialog from '../components/ClubScrollDialog';
import { Iconify } from '@fuse/components/iconify';
import OfferSidebarContent from '../OfferSidebarContent';
import { useGetProjectDashboardProjectsQuery } from 'src/app/main/dashboards/project/ProjectDashboardApi';
import useInfiniteScroll from '@fuse/hooks/useInfiniteScroll';


const container = {
	show: {
		transition: {
			staggerChildren: 0.04
		}
	}
};

const item = {
	hidden: {
		opacity: 0,
		y: 10
	},
	show: {
		opacity: 1,
		y: 0
	}
};

const Root = styled(FusePageSimple)(({ theme }) => ({

	display: 'flex',
	flexDirection: 'column',
	minWidth: 0,
	minHeight: '100%',
	position: 'relative',
	flex: '1 1 auto',
	width: '100%',
	height: 'auto',
	backgroundColor: theme.palette.background.default,

	'&.FusePageSimple-scroll-content': {
		height: '100%'
	},

	'& .FusePageSimple-wrapper': {
		display: 'flex',
		flexDirection: 'row',
		flex: '1 1 auto',
		zIndex: 2,
		minWidth: 0,
		height: '100%',
		backgroundColor: theme.palette.background.default,
	},
	'& .FusePageSimple-header': {
		backgroundColor: theme.palette.background.paper,
		borderBottomWidth: 1,
		borderStyle: 'solid',
		borderColor: theme.palette.divider,
		'& > .container': {
			maxWidth: '100%'
		}
	},
	'& .FusePageSimple-content': {
		display: 'flex',
		flex: '1 1 auto',
		alignItems: 'start',
		minHeight: 0,
		overflowY: 'auto'
	},
	'& .FusePageSimple-leftSidebar': {},
	'& .description': {
		fontSize: 16,
		marginBottom: 24
	}

}));

/**
 * The Offers page.
 */
function Offers() {
	const pageLayout = useRef(null);
	const routeParams = useParams();
	const [page, setPage] = useState(0);
	const [limit, setLimit] = useState(60);
	const { data: offers, isLoading } = useGetAcademyOffersQuery({ page, limit });
	const { data: cashback } = useGetAcademyCashbackQuery({ page, limit });
	const { data: categories } = useGetAcademyOffersCategoriesQuery()
	const [searchText, setSearchText] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [selectedTab, setSelectedTab] = useState(0);

	function handleTabChange(event: SyntheticEvent, value: number) {
		setSelectedTab(value);
	}

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [filteredData, setFilteredData] = useState<Offer[]>(offers);
	const [filteredCash, setFilteredCash] = useState<Offer[]>(cashback);

	const fetchMoreOffers = useCallback(async () => {
		if (!isLoadingMore) {
			setIsLoadingMore(true);
			setLimit(20)
			setPage((prevPage) => prevPage + 1);
		}
	}, [isLoadingMore]);

	const [isFetching, setIsFetching] = useInfiniteScroll(fetchMoreOffers);

	useEffect(() => {
		function getFilteredArray() {
			if (cashback && searchText.length === 0) {
				return cashback;
			}

			return _.filter(cashback, (item) => {
				return item.name.toLowerCase().includes(searchText.toLowerCase());
			});
		}

		if (cashback) {
			const previousFilteredCash = filteredCash || [];
			if (searchText) {
				setFilteredCash(getFilteredArray())
			} else {
				setTimeout(() => {
					setIsLoadingMore(false);
				}, 1500);
				setFilteredCash([...previousFilteredCash, ...getFilteredArray()]);
			}
		}
	}, [cashback]);

	useEffect(() => {
		function getFilteredArray() {
			if (offers && searchText.length === 0 && selectedCategory === 'all') {
				return offers;
			}

			return _.filter(offers, (item) => {
				if (selectedCategory !== 'all' && item.category.name !== selectedCategory) {
					return false;
				}

				return item.name.toLowerCase().includes(searchText.toLowerCase());
			});
		}

		if (offers) {
			const previousFilteredData = filteredData || [];
			if (selectedCategory !== 'all' || searchText) {
				setFilteredData(getFilteredArray())
			} else {
				setTimeout(() => {
					setIsLoadingMore(false);
				}, 1500);

				setFilteredData([...previousFilteredData, ...getFilteredArray()]);
			}
		}
	}, [offers, searchText, selectedCategory]);

	useEffect(() => {
		setRightSidebarOpen(Boolean(routeParams?.offerId));
	}, [routeParams]);


	if (isLoading) {
		return <FuseLoading />;
	}

	function handleSelectedCategory(event: SelectChangeEvent<string>) {
		setSelectedCategory(event.target.value);
	}

	function handleSearchText(event: ChangeEvent<HTMLInputElement>) {
		setSearchText(event.target.value);
	}


	return (
		<Root
			header={
				<Box className="relative overflow-hidden flex flex-col min-h-288 md:min-h-360 w-full bg-no-repeat bg-cover bg-center shrink-0 items-center justify-center px-16 py-32 md:p-64 -mb-1"
					sx={{
						backgroundColor: 'primary.main',
						color: (theme: Theme) => theme.palette.getContrastText(theme.palette.primary.main)
					}}
				>

					<div className="flex flex-col items-center justify-center mx-auto w-full">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0 } }}
						>
							<Typography
								color="inherit"
								className="text-center text-32 sm:text-48 font-extrabold tracking-tight mt-4"
							>
								Seu Clube, Seus Privilégios!
							</Typography>
						</motion.div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0.3 } }}
						>
							<Typography
								color="inherit"
								className="text-16 sm:text-20 mt-16 sm:mt-24 opacity-75 tracking-tight max-w-md text-center"
							>
								Descubra o poder de comprar mais por menos. Exclusividade e economia ao seu alcance!
							</Typography>
						</motion.div>

					</div>

					<svg
						className="absolute inset-0 pointer-events-none"
						viewBox="0 0 960 540"
						width="100%"
						height="100%"
						preserveAspectRatio="xMidYMax slice"
						xmlns="http://www.w3.org/2000/svg"
					>
						<g
							className="text-gray-700 opacity-10"
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
						</g>
					</svg>
					<div className='landing-pic-mask' />

					<div className="flex flex-row justify-end mt-16 ">
						<Tabs
							value={selectedTab}
							onChange={handleTabChange}
							indicatorColor="primary"
							textColor="inherit"
							variant="scrollable"
							scrollButtons={false}
							className="-mx-4 min-h-40"
							classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
							TabIndicatorProps={{
								children: (
									<Box
										sx={{ bgcolor: 'text.disabled' }}
										className="w-full h-full rounded-full opacity-20"
									/>
								)
							}}
						>
							<Tab
								className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
								disableRipple
								label={
									<div className='flex items-center justify-center px-16'>
										<Iconify icon={'solar:ticket-sale-line-duotone'} className='inline' />
										<Typography className="flex-1 ml-6 text-14 font-semibold">Descontos</Typography>
									</div>
								}
							/>
							<Tab
								className="text-14 font-semibold min-h-40 min-w-64 mx-4 px-12 "
								disableRipple
								label={
									<div className='flex items-center justify-center px-16'>
										<Iconify icon={'solar:dollar-minimalistic-broken'} className='inline' />
										<Typography className="flex-1 ml-6 text-14 font-semibold">Cashback</Typography>
									</div>
								}
							/>
						</Tabs>
					</div>
				</Box>
			}
			content={
				<div className="flex flex-col flex-1 w-full mx-auto px-8 pt-24 overflow-hidden sm:py-40">
					{selectedTab === 0 && (
						<motion.div
							variants={container}
							initial="hidden"
							animate="show"
							className="w-full"
						>
							<div className="py-0">
								<Button
									to="/apps/academy/courses"
									component={Link}
									className="mb-4 px-12"
									color="secondary"
									variant="text"
									startIcon={
										<FuseSvgIcon size={20}>
											{'ltr' === 'ltr'
												? 'heroicons-outline:arrow-sm-left'
												: 'heroicons-outline:arrow-sm-right'}
										</FuseSvgIcon>
									}
								>
									Voltar para o clube
								</Button>
							</div>
							<div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0 mt-32">
								<div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
									<TextField
										label="Pesquisar por ofertas"
										placeholder="Pesquisar oferta..."
										className="flex w-full sm:w-320 mx-8"
										value={searchText}
										inputProps={{
											'aria-label': 'Pesquisar'
										}}
										fullWidth
										onChange={handleSearchText}
										variant="outlined"
										InputLabelProps={{
											shrink: true
										}}

										InputProps={{
											startAdornment: (
												<InputAdornment position="start">
													<Iconify icon={'eva:search-fill'} />
												</InputAdornment>
											),
										}}

									/>
								</div>
								<FormControl
									className="flex w-288 md:w-320"
									variant="outlined"
								>
									<InputLabel id="category-select-label">Categoria</InputLabel>
									<Select
										labelId="category-select-label"
										id="category-select"
										label="Category"
										value={selectedCategory}
										onChange={handleSelectedCategory}
									>
										<MenuItem value="all" sx={{ mx: 1, my: 0.5, borderRadius: 1 }}>
											<em> Todos </em>
										</MenuItem>
										{categories?.map((category: any) => (
											<MenuItem
												value={category.name}
												key={category.id}
												sx={{ mx: 1, my: 0.5, borderRadius: 1 }}
											>
												{category.name}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</div>
							{
								filteredData &&
								(filteredData.length > 0 ? (
									<motion.div
										className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-32 mt-32 sm:mt-40"
										variants={container}
										initial="hidden"
										animate="show"
									>
										{filteredData.map((offer, index) => {
											return (
												<motion.div
													variants={item}
													key={index + 1}
												>
													<OfferCard offer={offer} />
												</motion.div>
											);
										})}
									</motion.div>
								) : (
									<div className="flex flex-1 items-center justify-center">
										<Typography
											color="text.secondary"
											className="text-24 my-24"
										>
											No offers found!
										</Typography>
									</div>
								))
							}
							{isFetching && (
								<div className="flex items-center justify-center m-28">
									<CircularProgress />
									<Typography className="ml-8">Carregando mais ofertas...</Typography>
								</div>
							)}
						</motion.div>
					)}
					{selectedTab === 1 && (
						<motion.div
							variants={container}
							initial="hidden"
							animate="show"
							className="w-full"
						>
							<div className="py-0">
								<Button
									to="/apps/academy/courses"
									component={Link}
									className="mb-4 px-12"
									color="secondary"
									variant="text"
									startIcon={
										<FuseSvgIcon size={20}>
											{'ltr' === 'ltr'
												? 'heroicons-outline:arrow-sm-left'
												: 'heroicons-outline:arrow-sm-right'}
										</FuseSvgIcon>
									}
								>
									Voltar para o clube
								</Button>
							</div>
							{
								filteredCash &&
								(filteredCash.length > 0 ? (
									<motion.div
										className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-32 mt-32 sm:mt-40"
										variants={container}
										initial="hidden"
										animate="show"
									>
										{filteredCash.map((offer, index) => {
											return (
												<motion.div
													variants={item}
													key={index + 1}
												>
													<OfferCard offer={offer} />
												</motion.div>
											);
										})}
									</motion.div>
								) : (
									<div className="flex flex-1 items-center justify-center">
										<Typography
											color="text.secondary"
											className="text-24 my-24"
										>
											No offers found!
										</Typography>
									</div>
								))
							}
							{isFetching && (
								<div className="flex items-center justify-center m-28">
									<CircularProgress />
									<Typography className="ml-8">Carregando mais ofertas...</Typography>
								</div>
							)}
						</motion.div>
					)}
				</div>
			}
			ref={pageLayout}
			scroll={isMobile ? 'normal' : 'page'}
			rightSidebarContent={<OfferSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
		/>
	);
}

export default Offers;
