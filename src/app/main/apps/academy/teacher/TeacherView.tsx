import { useState, useRef } from 'react';
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
import { useGetAcademyTeacherQuery } from '../AcademyApi';

import FuseUtils from '@fuse/utils/FuseUtils';
import clsx from 'clsx';



/**
 * The teacher view.
 */
function TeacherView() {
	const routeParams = useParams();
	const [open, setOpen] = useState(false);
	const inputRef = useRef();
	const { teacherId } = routeParams as { teacherId: string };

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const {
		data: teacher,
		isLoading,
		isError
	} = useGetAcademyTeacherQuery({ teacherId }, {
		skip: !teacherId
	});


	const dispatch = useDispatch();
	const navigate = useNavigate();

	if (isLoading) {
		return <FuseLoading className="min-h-screen" />;
	}

	if (isError) {
		setTimeout(() => {
			navigate('/apps/academy/courses');
			dispatch(showMessage({ message: 'NOT FOUND' }));
		}, 0);

		return null;
	}

	if (!teacher) {
		return null;
	}

	return (
		<>
			<Box
				className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
				sx={{
					backgroundColor: 'background.default'
				}}>
				<img
					className="absolute inset-0 object-cover w-full h-full"
					src={'assets/images/etc/bg-teachers.png'}
					alt="user background"
				/>
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
							className="transition delay-150 duration-300 hover:scale-125 w-128 h-128 text-64 font-bold"
							src={teacher.avatar}
							alt={teacher.name}
						>
							{teacher.name.charAt(0)}
						</Avatar>
						<div className="flex items-center ml-auto mb-4">

						</div>
					</div>

					<Typography className="mt-12 text-4xl font-bold truncate">{teacher.name}</Typography>
					<div className="flex flex-wrap items-center mt-8">
						{teacher.tags.map((item, index) => (
							<Chip
								key={index}
								label={item.title}
								className="mr-12 mb-12 inline-flex items-center bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10"
								size="small"
							/>
						))}
					</div>

					<Divider className="mt-16 mb-24" />

					<div className="flex flex-col space-y-32">
						{teacher.title &&
							<figure className="mt-10">
								<blockquote className="text-center text-xl font-semibold leading-8 text-gray-900 sm:text-2xl sm:leading-9">
									{teacher.title}
								</blockquote>
							</figure>
						}
						<div className="flex">
							<FuseSvgIcon>heroicons-outline:menu-alt-2</FuseSvgIcon>
							<div
								className="max-w-none ml-24 prose dark:prose-invert"
								// eslint-disable-next-line react/no-danger
								dangerouslySetInnerHTML={{
									__html: teacher.description
								}}
							/>
						</div>
					</div>
					<div className="flex flex-col space-y-32">
						<div className="flex">
							<FuseSvgIcon>heroicons-outline:cash</FuseSvgIcon>
							<div className="max-w-full ml-24 prose dark:prose-invert">
								<h3 className="mt-0">Tarifas</h3>
								<div className='divide-y divide-dashed'>
									{teacher.prices.map((item, index) => (
										<div className="grid grid-cols-3 gap-24 py-8" key={index}>
											<span className="text-lg col-span-2 font-medium tracking-tight text-gray-900">
												{item.title}
												{item.discount &&
													<span className="ml-6 inline-flex items-center font-bold text-10 px-10 py-2 rounded-full tracking-wide uppercase bg-green-50 text-green-800 dark:bg-green-600 dark:text-green-50">{item.discount}</span>}
											</span>
											<span className="text-lg text-right font-medium tracking-tight">
												{item.off > 0 ?
													(<><del className="text-sm text-red-600">{FuseUtils.formatCurrency(item.price)}</del> {FuseUtils.formatCurrency(item.off)}</>)
													: `${FuseUtils.formatCurrency(item.price)}`}
											</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Box className="flex justify-center items-center mt-18 py-24 pr-16 pl-4 sm:pr-48 sm:pl-36">
				<Button
					className='h-48 bg-green-600 px-28 font-semibold text-white hover:bg-green-500 rounded-lg shadow-md hover:scale-110 transition delay-150 duration-300 ease-in-out py-38'
					size="large"
					disabled={teacher.phone ? false : true}
					onClick={() => { window.open(`https://wa.me/+${teacher.phone}?text=Sou%20assinante%20da%20CREABOX,%20tudo%20bem%20?`, '_blank') }}
					startIcon={<FuseSvgIcon className="text-48" size={24}>material-outline:chat_bubble</FuseSvgIcon>}>
					Agendar
				</Button>
				{/* <Button onClick={handleClickOpen}>
					Checkout
				</Button> */}
			</Box>
			{/* <CheckoutDialog checkoutType={'creditCard'} open={open} onClose={handleClose} teacher={teacher} /> */}
		</>
	);
}

export default TeacherView;
