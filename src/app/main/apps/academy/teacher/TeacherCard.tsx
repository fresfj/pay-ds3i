import { useRef, useState, useCallback, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ListItemButton from '@mui/material/ListItemButton';
import { Image } from '@fuse/components/image'
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import './styles.css'
import { Box } from '@mui/material';


type TeacherCardProps = {
	teachers: any[];
	title: string;
	loading?: boolean;
}
/**
 * The TeacherCard component.
 */
function TeacherCard(props: TeacherCardProps) {
	const { teachers, title, loading = false } = props;

	const swiperRef = useRef(null)
	const [realIndex, setIndex] = useState(0)
	const [isEnd, setIsEnd] = useState(false)
	const [totalSlides, setTotalSlides] = useState(0)
	const [spaceBetween, setSpaceBetween] = useState(0);

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

	const formatArray = (array) => {
		let formatted = '';
		array.map(item => {
			for (const key in item) {
				if (item[key]) {
					if (formatted) {
						formatted += ' & ';
					}
					formatted += key.replace('in-person', 'Presencial').replace('online', 'Online');
				}
			}
		});

		return formatted;
	}

	useEffect(() => {
		const swiper = swiperRef.current?.swiper;
		if (swiper) {
			const totalSlidesWidth = swiper.slides.length * swiper.slides[0]?.offsetWidth;
			const containerWidth = swiperRef.current.offsetWidth;
			const remainingSpace = containerWidth - totalSlidesWidth;
			const spaceBetweenSlides = remainingSpace / (swiper.slides.length - 1);
			setSpaceBetween(spaceBetweenSlides);
			setTotalSlides(swiper.slides.length);
		}
	}, [swiperRef.current])

	return (
		<>
			<div className="flex justify-between items-center my-12">
				<Typography className='mb-0 text-xl md:text-4xl' variant="h4" gutterBottom>{title}</Typography>
				<div className='grid gap-12 grid-cols-2'>
					<Fab size="medium" color="secondary" disabled={realIndex == 0} aria-label="add" onClick={handlePrev}>
						<ArrowForwardIcon className="rotate-180" />
					</Fab>
					<Fab size="medium" color="secondary" disabled={isEnd || realIndex === totalSlides - 1} aria-label="add" onClick={handleNext}>
						<ArrowForwardIcon />
					</Fab>
				</div>
			</div>
			<div className="flex justify-center items-center gap-4">
				{teachers &&
					<Swiper
						onSlideChange={(swiper) => {
							setIndex(swiper.realIndex);
							setIsEnd(swiper.isEnd);
							setTotalSlides(swiper.slides.length);
						}}
						ref={swiperRef}
						slidesPerView={2}
						slidesPerGroupSkip={1}
						spaceBetween={4}
						roundLengths={true}
						breakpoints={{
							640: {
								slidesPerView: 2,
								spaceBetween: 10,
							},
							768: {
								slidesPerView: teachers.length > 3 ? 4 : 2,
								slidesPerGroup: 2,
								spaceBetween: 20,
							},
							1024: {
								slidesPerView: teachers.length > 4 ? 5 : 2,
								slidesPerGroup: 2,
								spaceBetween: 10,
							},
						}}
						modules={[Navigation]}
						pagination={{ clickable: true }}
						style={{ display: 'flex', justifyContent: 'center' }}
					>
						{teachers.map((item, index) => (
							<SwiperSlide key={index} style={{ maxWidth: 320 }}>
								<div
									{...props}
									className="relative max-w-xs overflow-hidden rounded-2xl shadow-lg group">
									<Box
										className="group-hover:blur-sm hover:!blur-none group-hover:scale-75 hover:!scale-100 cursor-pointer"
										component={NavLinkAdapter}
										to={`/apps/academy/courses/teacher/${item?.id}`}>
										<Image
											alt={item.name}
											src={item.avatar}
											ratio="1/1"
											loading="lazy"
											className="w-[320px] h-[320px] md:w-320 md:h-320 object-cover transition-transform group-hover:scale-110 delay-150 duration-300 ease-in-out"
										/>
										<div className='landing-pic-mask' />
										<div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
											<div className="p-8 w-full text-white">
												<h3 className="text-xl font-bold mb-2">{item.name}</h3>
												<p className="hidden md:block">{`${item.city} (${formatArray(item.work)})`}</p>
											</div>
										</div>
									</Box>
								</div>
							</SwiperSlide>
						))}
					</Swiper>
				}
			</div>
		</>
	);
}

export default TeacherCard;
