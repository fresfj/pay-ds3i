import _ from '@lodash';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { ChangeEvent, useEffect, useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { Button, Card, Divider, Fab, FormControlLabel, Paper, Skeleton } from '@mui/material';
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

import CourseCard from './CourseCard';
import { Course, useGetAcademyCategoriesQuery, useGetAcademyCoursesQuery, useGetAcademyTeachersQuery } from '../AcademyApi';
import ImageCard from './ImageCard';
import { Link } from 'react-router-dom';
import TeacherCard from '../teacher/TeacherCard';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import CourseSidebarContent from '../CourseSidebarContent';
import { Image } from '@fuse/components/image'
import ClubScrollDialog from '../components/ClubScrollDialog';
import { Iconify } from '@fuse/components/iconify';
import { CONFIG } from 'src/config-global';

const dataParc = [
	{ image: 'assets/images/cards/z7.webp', site: 'https://www.z7suplementos.com.br', title: 'z7', content: '•	20% OFF no pote de 900g do Whey Gourmet New Millen Mousse de Maracujá pelo cupom CREABOXWHEY\n•	15 % OFF no pote de pré - treino C4 BLACK BETA PUMP Mango Crazy pelo cupom CREACRAZY \n•	 10% OFF em todo site da Z7 pelo cupom CREABOX', coupon: 'CREABOX' },
	{ image: 'assets/images/cards/vitao.webp', site: 'https://vitao.com.br', title: 'Vitão ', content: '30% OFF em todo site da VITAO', coupon: 'CREABOX' },
	{ image: 'assets/images/cards/pinati.png', site: 'https://pinati.com.br', title: 'Pinati', content: '15% OFF em todo site da Pinati', coupon: 'CREABOX' },
	{ image: 'assets/images/cards/brutali.webp', site: 'https://brutali.com.br', title: 'brutali ', content: '20% OFF em todo site da BRUTALI', coupon: 'CREABOX20' },
	{ image: 'assets/images/cards/pincbar.webp', site: 'https://pincbar.com.br', title: 'Pincbar', content: '12% OFF em todo site da PINCBAR', coupon: 'CREABOX12' },
	{ image: 'assets/images/cards/cacow.webp', site: 'https://www.cacow.com.br', title: 'cacow', content: '10% OFF em todo site da CACOW', coupon: 'CREABOX10' },
	{ image: 'assets/images/cards/cocorock.webp', site: 'https://www.cocorock.com.br', title: 'cocorock', content: '10% OFF em todo site da COCOROCK', coupon: 'CREABOX10' },
	{ image: 'assets/images/cards/cosju.webp', site: 'https://api.whatsapp.com/send?phone=554191459300&text=Oi,%20Julia!%20Tudo%20bem?%20%0A%0AVim%20pela%20CREABOX,%20tenho%20interesse%20em%20saber%20no%20desconto%20de%2020%25%20na%20sua%20loja%20%F0%9F%98%80', title: 'Cosméticos da Ju', content: '20% OFF em todos os produtos dos cosméticos da Ju', coupon: 'CREABOX20' },
	{ image: 'assets/images/cards/shotme.webp', site: 'https://shotme.com.br', title: 'Shotme', content: '15% OFF em todo site da SHOTME', coupon: 'CREABOX15' }
]

interface MediaProps {
	loading?: boolean;
}
interface DialogContentProps { title: string, content: string, site: string, coupon: string }

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
 * The Courses page.
 */
function Courses() {
	const routeParams = useParams();
	const { data: doctors } = useGetAcademyTeachersQuery({ type: 1 });
	const { data: personalTrainer } = useGetAcademyTeachersQuery({ type: 2 });
	const { data: OtherSpecialists } = useGetAcademyTeachersQuery({ type: 99 });
	const { data: courses, isLoading } = useGetAcademyCoursesQuery();
	const { data: categories } = useGetAcademyCategoriesQuery();

	const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
	const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));

	const [filteredData, setFilteredData] = useState<Course[]>(courses);
	const [searchText, setSearchText] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('all');
	const [hideCompleted, setHideCompleted] = useState(false);
	const [open, setOpen] = useState(false);
	const [dialogContent, setDialogContent] = useState<DialogContentProps>({ site: '', title: '', content: '', coupon: '' });

	const swiperRef = useRef(null)
	const [realIndex, setIndex] = useState(0)
	const [isEnd, setIsEnd] = useState(false)

	const handlePrev = useCallback(() => {
		swiperRef.current.swiper.slidePrev();
		setIndex(swiperRef.current?.swiper.realIndex);
		setIsEnd(swiperRef.current?.swiper.isEnd)

	}, [swiperRef]);

	const handleNext = useCallback(() => {
		swiperRef.current.swiper.slideNext();
		setIndex(swiperRef.current?.swiper.realIndex);
		setIsEnd(swiperRef.current?.swiper.isEnd)
	}, [swiperRef]);

	useEffect(() => {
		if (Boolean(routeParams.teacherId)) {
			setRightSidebarOpen(Boolean(routeParams.teacherId));
		}
	}, [routeParams]);

	useEffect(() => {
		function getFilteredArray() {
			if (courses && searchText.length === 0 && selectedCategory === 'all' && !hideCompleted) {
				return courses;
			}

			return _.filter(courses, (item) => {
				if (selectedCategory !== 'all' && item.category !== selectedCategory) {
					return false;
				}

				if (hideCompleted && item.progress.completed > 0) {
					return false;
				}

				return item.title.toLowerCase().includes(searchText.toLowerCase());
			});
		}

		if (courses) {
			setFilteredData(getFilteredArray());
		}
	}, [courses, doctors, personalTrainer, OtherSpecialists, hideCompleted, searchText, selectedCategory]);

	function handleSelectedCategory(event: SelectChangeEvent<string>) {
		setSelectedCategory(event.target.value);
	}

	function handleSearchText(event: ChangeEvent<HTMLInputElement>) {
		setSearchText(event.target.value);
	}

	if (isLoading) {
		return <FuseLoading />;
	}

	const handleClick = (url: any, coupon: any) => {
		navigator.clipboard.writeText(coupon)
			.then(() => {
				if (url) {
					window.open(url, '_blank');
				}
			})
			.catch((error) => {
				console.error('Erro ao copiar texto:', error);
			});
	};

	const handleClickOpen = (event: DialogContentProps) => {
		setDialogContent(event);
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
	}

	return (
		<Root
			header={
				<>
					<Box
						className="relative overflow-hidden flex min-h-288 md:min-h-[670px] w-full bg-no-repeat bg-cover bg-center shrink-0 items-center justify-center px-16 py-32 md:p-64 -mb-1"
						sx={{
							backgroundColor: 'primary.main',
							color: (theme: Theme) => theme.palette.getContrastText(theme.palette.primary.main),
							backgroundImage: "url('assets/images/etc/BEM-VINDO-AREA.jpg')"
						}}
					>
						{/* <div className="flex flex-col items-center justify-center mx-auto w-full">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0 } }}
						>
							<Typography
								color="inherit"
								className="text-18 font-semibold"
							>
								FUSE ACADEMY
							</Typography>
						</motion.div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0 } }}
						>
							<Typography
								color="inherit"
								className="text-center text-32 sm:text-48 font-extrabold tracking-tight mt-4"
							>
								What do you want to learn today?
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
								Our courses will step you through the process of a building small applications, or
								adding new features to existing applications.
							</Typography>
						</motion.div>
					</div> */}

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
					</Box>

					<Box className="flex flex-col items-center -mb-1 scroll-px-16 -mx-8 sm:-px-40" sx={{
						backgroundColor: (theme) =>
							theme.palette.mode === 'light'
								? theme.palette.background.default
								: theme.palette.background.default
					}}>
						<div className="w-full relative rounded-xl overflow-auto px-12 md:py-20 -mt-64 sm:-mt-96">
							<div className="flex justify-start md:justify-center gap-8 snap-proximity md:snap-x overflow-x-auto py-14">
								{dataParc.map((item, index) => (
									<Card
										key={index}
										onClick={() => handleClickOpen(item)}
										role="button"
										className="snap-center shrink-0 relative first:pl-8 last:pr-8 w-144 h-144 rounded-2xl shadow hover:shadow-lg overflow-hidden transition-shadow ease-in-out duration-150 content-center">
										<div className="flex items-center justify-center p-8 text-center">
											<Image
												src={item.image}
												alt={item.title}
												visibleByDefault
												className="bg-cover bg-center w-min-[100px] w-min-[100px]"
											/>
										</div>
									</Card>
								))}
							</div>
						</div>
					</Box>
				</>
			}
			content={
				<div className="flex flex-col flex-1 w-full mx-auto px-8 pt-24 overflow-hidden sm:py-40">
					<Box
						sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', backgroundImage: "url('assets/images/etc/BG-CREABOX_05.webp')" }}
						className="bg-cover bg-left-top flex items-center my-36 min-h-[340px] overflow-hidde py-20 sm:px-64 sm:py-48 rounded-lg"
					>
						<div className="static w-full">
							<div className="grid grid-cols-1 md:grid-cols-3 items-center pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">

								<div className="relative mx-20 col-span-2 max-w-xl px-14 sm:static sm:px-6 lg:px-8">

									<Typography className="text-2xl text-justify md:text-4xl uppercase font-bold leading-6 sm:text-6xl sm:leading-10">
										Bem-vindo ao Clube de Descontos e Vantagens!
									</Typography>
									<Typography className="mt-14 text-xl md:text-3xl text-gray-200">Experimente um programa de relacionamento que oferece benefícios e vantagens exclusivas.</Typography>

									<div className="md:columns-2">
										<div className='flex items-center mt-14'>
											<Iconify icon={'solar:verified-check-bold'} className='inline' />
											<Typography variant='h5' className="ml-4 text-xl md:text-2xl text-gray-200 font-bold	">
												25 mil ofertas
											</Typography>
										</div>
										<p className="mt-14 text-base md:text-2xl text-gray-200">Aproveite, descontos, ofertas, caschback e vantagens em mais de 25 mil estabelecimentos.</p>
										<div className='flex items-center mt-14'>
											<Iconify icon={'solar:verified-check-bold'} className='inline' />
											<Typography variant='h5' className="ml-4 text-xl md:text-2xl text-gray-200 font-bold	">
												30 mil produtos!
											</Typography>
										</div>
										<p className="mt-14 text-base md:text-2xl text-gray-200 ">Mais de 3 mil Marcas e mais de 30 mil produtos com descontos exclusivos para assinantes.</p>
										<div className='flex items-center mt-14'>
											<Iconify icon={'solar:verified-check-bold'} className='inline' />
											<Typography variant='h5' className="ml-4 text-xl md:text-2xl text-gray-200 font-bold	 break-before-column">
												Sorteios e +vantagens</Typography>
										</div>
										<p className="mt-14 text-base md:text-2xl text-gray-200">+ 10 mil promoções, além de sorteios e vantagens em produtos e serviços de parceiros.</p>
									</div>
									<div className="my-10 text-center md:text-left">
										<Button
											to={`/apps/academy/offers`}
											component={Link}
											className="mt-32 px-48 min-w-128 mx-8 whitespace-nowrap text-xl"
											color="secondary"
											variant="contained"
											endIcon={<FuseSvgIcon size={20}>heroicons-solid:arrow-sm-right</FuseSvgIcon>}
										>
											Aproveite agora
										</Button>
									</div>
								</div>
								<div className="static text-center mb-20 md:mb-0 lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-6xl">
									<div className="w-full flex gap-12 snap-x overflow-x-auto py-14 px-8">
										<Paper
											component={motion.div}
											variants={item}
											className="snap-start scroll-ml-6 shrink-0 relative first:pl-6 w-192"
										>
											<div className="flex flex-col flex-auto w-full p-32 text-center justify-center align-middle h-92">
												<img className="object-cover inline-block rounded-lg mx-auto overflow-hidden" src="https://logodownload.org/wp-content/uploads/2017/08/centauro-logo-03.png" alt="" />
											</div>
										</Paper>
										<Paper
											component={motion.div}
											variants={item}
											className="snap-start scroll-ml-6 shrink-0 relative first:pl-6 w-192"
										>
											<div className="flex flex-col flex-auto w-full p-32 text-center justify-center align-middle h-92">
												<img className="object-cover inline-block mx-auto overflow-hidden" src="https://logodownload.org/wp-content/uploads/2014/06/magalu-logo-5.png" alt="" />
											</div>
										</Paper>
										<Paper
											component={motion.div}
											variants={item}
											className="snap-start scroll-ml-6 shrink-0 relative first:pl-6 w-192"
										>
											<div className="flex flex-col flex-auto w-full p-32 text-center justify-center align-middle h-92">
												<img className="object-cover inline-block mx-auto overflow-hidden" src="https://logodownload.org/wp-content/uploads/2020/02/netshoes-logo-4.png" alt="" />
											</div>
										</Paper>
										<Paper
											component={motion.div}
											variants={item}
											className="snap-start scroll-ml-6 shrink-0 relative first:pl-6 w-192"
										>
											<div className="flex flex-col flex-auto w-full p-32 text-center justify-center align-middle h-92">
												<img className="object-cover inline-block mx-auto overflow-hidden" src="https://logodownload.org/wp-content/uploads/2018/01/droga-raia-logo-5.png" alt="" />
											</div>
										</Paper>
										<Paper
											component={motion.div}
											variants={item}
											className="snap-start scroll-ml-6 shrink-0 relative first:pl-6 w-192"
										>
											<div className="flex flex-col flex-auto w-full p-32 text-center justify-center align-middle h-92">
												<img className="object-cover inline-block mx-auto overflow-hidden" src="https://logodownload.org/wp-content/uploads/2014/05/natura-logo-4-1.png" alt="" />
											</div>
										</Paper>
									</div>

									<div className="absolute flex flex-auto overflow-hidden w-full md:w-480 justify-center align-middle">
										<img src="assets/images/etc/club-partners.png" alt="" className="h-112 object-cover object-center" />
									</div>
								</div>
							</div>
						</div>
					</Box>
					{/* <Box
						className="relative overflow-hidden rounded-lg h-480 md:min-h-[560px] my-32 w-full bg-no-repeat bg-cover bg-top shrink-0 grid text-2xl md:grid-cols-3 gap-4 px-16 py-32 md:p-64 "
						sx={{
							backgroundColor: 'primary.main',
							color: (theme: Theme) => theme.palette.getContrastText(theme.palette.primary.main),
							backgroundImage: "url('assets/images/etc/download.webp')"
						}}
					>
						<div className="col-span-2 py-24 sm:py-32">
							<div className="mx-auto mt-auto md:mt-10 grid max-w-lg grid-cols-1 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-1 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-1">
								<div className='flex justify-center'>
									<img
										className="object-contain"
										src="assets/images/etc/download-1.webp"
										alt="Transistor"
										width={180}
									/>
								</div>
								<div className='py-24 px-28 sm:py-32 sm:px-64'>
									<Typography className="text-lg md:text-3xl font-extrabold leading-tight tracking-tight">
										TRANSFORME SEU CORPO, TREINANDO DA FORMA CORRETA, MELHORANDO SUA MOBILIDADE, DIMINUINDO O RISCO DE LESÕES E TUDO ISSO SEM PRECISAR UTILIZAR NENHUM EQUIPAMENTO.
									</Typography>
									<Typography
										className="text-base md:text-lg mt-8 max-w-xl text-gray-300"
									>
										Um programa completo em que eu, Ronan Batista, serei o seu <b>Personal Trainer</b>.
										O RB Workouts possui mais de 100 treinos, e o melhor é que você só precisa se dedicar ao máximo 20 minutos por dia na execução dos seus exercícios, podendo executá-los de forma prática e rápida em qualquer lugar.
									</Typography>
									<Button
										size="large"
										className="mt-32 px-48 text-lg min-w-128"
										color="secondary"
										variant="contained"
										onClick={() => { handleClick('https://go.hotmart.com/G91506515S', '') }}
										endIcon={<FuseSvgIcon size={20}>heroicons-solid:arrow-sm-right</FuseSvgIcon>}
									>
										Saiba mais
									</Button>
								</div>
							</div>
						</div>
					</Box> */}

					<div className="flex justify-between items-center my-12">
						<Typography className='mb-0 text-xl md:text-4xl' variant="h4" gutterBottom>
							Aulas
						</Typography>
						<div className='grid gap-12 grid-cols-2'>
							<Fab size="medium" color="secondary" disabled={realIndex == 0} aria-label="add" onClick={handlePrev}>
								<ArrowForwardIcon className="rotate-180" />
							</Fab>
							<Fab size="medium" color="secondary" disabled={isEnd} aria-label="add" onClick={handleNext}>
								<ArrowForwardIcon />
							</Fab>
						</div>
					</div>

					<main className="flex justify-center items-center gap-4 p-4 mb-48">
						<Swiper
							ref={swiperRef}
							slidesPerView={2}
							slidesPerGroupSkip={1}
							spaceBetween={4}
							breakpoints={{
								640: {
									slidesPerView: 2,
									spaceBetween: 10,
								},
								768: {
									slidesPerView: 4,
									slidesPerGroup: 2,
									spaceBetween: 20,
								},
								1024: {
									slidesPerView: 5,
									slidesPerGroup: 2,
									spaceBetween: 10,
								},
							}}
							modules={[Navigation]}
						>
							<SwiperSlide>
								<ImageCard imgSrc={'assets/images/pages/profile/creatina.png'} unlocked={true} />
							</SwiperSlide>
							<SwiperSlide>
								<ImageCard imgSrc={'assets/images/pages/profile/6.png'} />
							</SwiperSlide>
							<SwiperSlide>
								<ImageCard imgSrc={'assets/images/pages/profile/7.png'} /></SwiperSlide>
							<SwiperSlide>
								<ImageCard imgSrc={'assets/images/pages/profile/3.png'} /></SwiperSlide>
							<SwiperSlide>
								<ImageCard imgSrc={'assets/images/pages/profile/4.png'} /></SwiperSlide>
							<SwiperSlide>
								<ImageCard imgSrc={'assets/images/pages/profile/5.png'} /></SwiperSlide>
							<SwiperSlide>
								<ImageCard imgSrc={'assets/images/pages/profile/9.png'} /></SwiperSlide>
						</Swiper>
					</main>

					<Box
						sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', backgroundImage: "url('assets/images/etc/BG-CREABOX_01.webp')" }}
						className="flex items-center my-36 min-h-[460px] overflow-hidde py-40 sm:px-64 sm:py-48 rounded-lg"
					>
						<div className="relative w-full">
							<div className="pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40">
								<div className="relative mx-auto max-w-7xl px-24 sm:static sm:px-6 lg:px-8">
									<div className="sm:max-w-lg">
										<Typography className="text-2xl md:text-4xl uppercase font-extrabold leading-6 sm:text-6xl sm:leading-10">
											Desafio 30 Dias CREABOX
										</Typography>
										<p className="mt-4 text-xl md:text-2xl text-gray-300">Desperte o atleta que existe dentro de você com 30 dias intensos de superação, determinação e transformação! 💪 Este desafio não é apenas sobre movimentar o corpo, mas sim sobre desbloquear o potencial incrível que você possui.</p>
									</div>
									<div className="my-10 text-center md:text-left">
										<div aria-hidden="true" className="pointer-events-none lg:absolute lg:inset-y-0 lg:mx-auto lg:w-full lg:max-w-6xl">
											<div className="absolute invisible md:visible transform sm:left-3/4 sm:top-0 sm:translate-x-8 lg:left-3/4 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-8">
												<div className="flex items-center space-x-6 lg:space-x-8">
													<div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
														<div className="h-[180px] w-[140px] shadow-xl overflow-hidden rounded-lg sm:opacity-0 lg:opacity-100">
															<Image
																src={`${CONFIG.site.basePath}/assets/images/pages/profile/19.png`}
																alt="about-vision"
																ratio={{ xs: '1/1', sm: '1/1' }}
																visibleByDefault
																className="h-full w-full object-cover object-center"
															/>
														</div>
														<div className="h-[180px] w-[140px] shadow-xl overflow-hidden rounded-lg">
															<Image
																src={`${CONFIG.site.basePath}/assets/images/pages/profile/13.png`}
																alt="about-vision"
																ratio={{ xs: '1/1', sm: '1/1' }}
																visibleByDefault
																className="h-full w-full object-cover object-center"
															/>
														</div>
													</div>
													<div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
														<div className="h-[180px] w-[140px] shadow-xl overflow-hidden rounded-lg">
															<Image
																src={`${CONFIG.site.basePath}/assets/images/pages/profile/20.png`}
																alt="about-vision"
																ratio={{ xs: '1/1', sm: '1/1' }}
																visibleByDefault
																className="h-full w-full object-cover object-center"
															/>
														</div>
														<div className="h-[180px] w-[140px] shadow-xl overflow-hidden rounded-lg">
															<Image
																src={`${CONFIG.site.basePath}/assets/images/pages/profile/15.png`}
																alt="about-vision"
																ratio={{ xs: '1/1', sm: '1/1' }}
																visibleByDefault
																className="h-full w-full object-cover object-center"
															/>
														</div>
														<div className="h-[180px] w-[140px] shadow-xl overflow-hidden rounded-lg">
															<Image
																src={`${CONFIG.site.basePath}/assets/images/pages/profile/16.png`}
																alt="about-vision"
																ratio={{ xs: '1/1', sm: '1/1' }}
																visibleByDefault
																className="h-full w-full object-cover object-center"
															/>
														</div>
													</div>
													<div className="grid flex-shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
														<div className="h-[180px] w-[140px] shadow-xl overflow-hidden rounded-lg">
															<Image
																src={`${CONFIG.site.basePath}/assets/images/pages/profile/17.png`}
																alt="about-vision"
																ratio={{ xs: '1/1', sm: '1/1' }}
																visibleByDefault
																className="h-full w-full object-cover object-center"
															/>

														</div>
														<div className="h-[180px] w-[140px] shadow-xl overflow-hidden rounded-lg">
															<Image
																src={`${CONFIG.site.basePath}/assets/images/pages/profile/18.png`}
																alt="about-vision"
																ratio={{ xs: '1/1', sm: '1/1' }}
																visibleByDefault
																className="h-full w-full object-cover object-center"
															/>

														</div>
													</div>
												</div>
											</div>
										</div>

										<Button
											size="large"
											className="mt-32 px-48 min-w-128 mx-8 whitespace-nowrap text-xl"
											color="secondary"
											variant="contained"
											onClick={() => { handleClick('https://drive.google.com/file/d/1GWGkKvhJCGVeNKnGu8XfL2bxxvPDYMTH/view?usp=sharing', '') }}
											endIcon={<FuseSvgIcon size={20}>heroicons-solid:arrow-sm-right</FuseSvgIcon>}
										>
											Desafie-se
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Box>
					{/* <div className="flex flex-col shrink-0 sm:flex-row items-center justify-between space-y-16 sm:space-y-0 mt-32">
						<div className="flex flex-col sm:flex-row w-full sm:w-auto items-center space-y-16 sm:space-y-0 sm:space-x-16">
							<FormControl
								className="flex w-full sm:w-136"
								variant="outlined"
							>
								<InputLabel id="category-select-label">Category</InputLabel>
								<Select
									labelId="category-select-label"
									id="category-select"
									label="Category"
									value={selectedCategory}
									onChange={handleSelectedCategory}
								>
									<MenuItem value="all">
										<em> All </em>
									</MenuItem>
									{categories?.map((category) => (
										<MenuItem
											value={category.slug}
											key={category.id}
										>
											{category.title}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<TextField
								label="Search for a course"
								placeholder="Enter a keyword..."
								className="flex w-full sm:w-256 mx-8"
								value={searchText}
								inputProps={{
									'aria-label': 'Search'
								}}
								fullWidth
								onChange={handleSearchText}
								variant="outlined"
								InputLabelProps={{
									shrink: true
								}}
							/>
						</div>

						<FormControlLabel
							label="Hide completed"
							control={
								<Switch
									onChange={(ev) => {
										setHideCompleted(ev.target.checked);
									}}
									checked={hideCompleted}
									name="hideCompleted"
								/>
							}
						/>
					</div>
					{
						filteredData &&
						(filteredData.length > 0 ? (
							<motion.div
								className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 mt-32 sm:mt-40"
								variants={container}
								initial="hidden"
								animate="show"
							>
								{filteredData.map((course) => {
									return (
										<motion.div
											variants={item}
											key={course.id}
										>
											<CourseCard course={course} />
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
									No courses found!
								</Typography>
							</div>
						))
					} */}

					<Dialog open={open} onClose={handleClose} maxWidth={'md'} aria-labelledby="responsive-dialog-title"
						sx={{ color: '#FFF', zIndex: theme => theme.zIndex.drawer + 1 }}
						style={{ backdropFilter: 'blur(5px)' }}>
						<IconButton
							aria-label="close"
							onClick={handleClose}
							size='large'
							sx={{
								position: 'absolute',
								right: 8,
								top: 8,
								color: (theme) => theme.palette.grey[500],
							}}>
							<CloseIcon />
						</IconButton>
						<DialogContent dividers className='p-24'>
							<Typography className='text-center text-2xl md:text-4xl' variant="h4" gutterBottom>
								Benefícios <b>CREABOX</b><br />com <b>apenas um clique</b>
							</Typography>
							<Typography
								className="flex mt-32 text-lg md:text-2xl whitespace-pre-line leading-relaxed"
								variant="h6"
								gutterBottom
								dangerouslySetInnerHTML={{ __html: dialogContent.content }}
							/>
						</DialogContent>
						<DialogActions className='grid grid-rows-3 md:grid-rows-2 gap-4 p-24 md:grid-cols-3' sx={{
							backgroundColor: (theme) =>
								theme.palette.mode === 'light'
									? lighten(theme.palette.background.default, 0.4)
									: lighten(theme.palette.background.default, 0.02)
						}}>
							<Typography className='text-xl md:text-2xl col-start-1 col-span-3 text-center' variant="h6" gutterBottom>
								Copie e cole o código no carrinho de compras da {dialogContent.title}!
							</Typography>
							<div className='col-start-1 col-span-3 rounded h-48 text-center content-center md:col-span-2 border-dashed border-2 border-indigo-600'>
								<div className='grid grid-cols-6 gap-4 justify-center items-center'>
									<Typography className='col-start-2 col-span-4 leading-relaxed font-bold text-2xl uppercase'>{dialogContent.coupon}</Typography>
									<IconButton onClick={() => handleClick(null, dialogContent.coupon)} sx={{ ml: 1, "&.MuiButtonBase-root:hover": { bgcolor: "transparent" } }}>
										<FuseSvgIcon size={22}>material-solid:content_copy</FuseSvgIcon>
									</IconButton>
								</div>
							</div>
							<Button className='col-span-4 md:col-span-1 rounded min-h-48 text-2xl' variant="contained" color='secondary' onClick={() => handleClick(dialogContent.site, dialogContent.coupon)} autoFocus>
								Copiar e para loja
							</Button>
						</DialogActions>
					</Dialog>
				</div>
			}
			scroll={isMobile ? 'normal' : 'page'}
			rightSidebarContent={<CourseSidebarContent />}
			rightSidebarOpen={rightSidebarOpen}
			rightSidebarOnClose={() => setRightSidebarOpen(false)}
			rightSidebarWidth={640}
			rightSidebarVariant="temporary"
		/>
	);
}

export default Courses;
