import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Input from '@mui/material/Input';
import Masonry from 'react-masonry-css';
import { motion } from 'framer-motion';
import SinglePricingFeatureItem from './IndicationFeatureItem';
import SinglePricingCard from './IndicationCard';
import ContactCard from './ContactCard';
import { OutlinedInput } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import { useTranslation } from 'react-i18next'
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

const contatos = [
	// {
	// 	"id": "493190c9-5b61-4912-afe5-78c21f1044d7",
	// 	"icon": "heroicons-solid:star",
	// 	"title": "Daily challenges",
	// 	"description": "Your submission has been accepted",
	// 	"time": "2022-05-09T10:32:42.703Z",
	// 	"read": false
	// },
	{
		"id": "6e3e97e5-effc-4fb7-b730-52a151f0b641",
		"image": "assets/images/avatars/male-04.jpg",
		"description": "<strong>Leo Gill</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>",
		"time": "2022-05-09T10:07:42.703Z",
		"read": true,
		"link": "/dashboards/project",
		"useRouter": true
	},
	{
		"id": "6e3e97e5-effc-4fb7-b733-52a151f0b641",
		"image": "assets/images/avatars/male-03.jpg",
		"description": "<strong>Jonh Doe</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>",
		"time": "2022-05-09T10:07:42.703Z",
		"read": true,
		"link": "/dashboards/project",
		"useRouter": true
	},
	{
		"id": "b91ccb58-b06c-413b-b389-87010e03a120",
		"image": "assets/images/avatars/male-01.jpg",
		"description": "<strong>Pablo Richeli</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>",
		"time": "2022-05-09T10:07:42.703Z",
		"read": true,
		"link": "#",
		"useRouter": true
	},
	{
		"id": "b91ccb58-b06c-413b-b389-87010e02a120",
		"image": "assets/images/avatars/male-02.jpg",
		"description": "<strong>Francisco</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>",
		"time": "2022-05-09T10:07:42.703Z",
		"read": true,
		"link": "#",
		"useRouter": true
	},
	{
		"id": "6e3e97e5-effc-4fb7-b733-52a152f0b641",
		"image": "assets/images/avatars/male-02.jpg",
		"description": "<strong>Jonh Doe</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>",
		"time": "2022-05-09T10:07:42.703Z",
		"read": true,
		"link": "/dashboards/project",
		"useRouter": true
	},
	{
		"id": "6e3e97e5-effc-4fb1-b730-52a151f0b641",
		"image": "assets/images/avatars/male-01.jpg",
		"description": "<strong>Leo Gill</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>",
		"time": "2022-05-09T10:07:42.703Z",
		"read": true,
		"link": "/dashboards/project",
		"useRouter": true
	},
	{
		"id": "b91ccb58-b06c-433b-b389-87010e03a120",
		"image": "assets/images/avatars/male-03.jpg",
		"description": "<strong>Pablo Richeli</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>",
		"time": "2022-05-09T10:07:42.703Z",
		"read": true,
		"link": "#",
		"useRouter": true
	},
	{
		"id": "b41ccb58-b06c-413b-b389-87010e02a120",
		"image": "assets/images/avatars/male-04.jpg",
		"description": "<strong>Francisco</strong> added you to <em>Top Secret Project</em> group and assigned you as a <em>Project Manager</em>",
		"time": "2022-05-09T10:07:42.703Z",
		"read": true,
		"link": "#",
		"useRouter": true
	},

	// {
	// 	"id": "b91ccb58-b06c-413b-b389-87010e03a120",
	// 	"icon": "heroicons-solid:mail",
	// 	"title": "Mailbox",
	// 	"description": "You have 15 unread mails across 3 mailboxes",
	// 	"time": "2022-05-09T07:57:42.703Z",
	// 	"read": false,
	// 	"link": "/apps/mailbox",
	// 	"useRouter": true
	// },
]
/**
 * The single pricing page.
 */
function IndicationPage() {
	const { t } = useTranslation('helpCenterApp');
	return (
		<>
			<Box
				className="relative pt-32 pb-112 px-16 sm:pt-80 sm:pb-192 sm:px-64 overflow-hidden"
				sx={{
					backgroundColor: 'primary.dark',
					color: (theme) => theme.palette.getContrastText(theme.palette.primary.main)
				}}
			>
				<div className="flex flex-col items-center justify-center  mx-auto w-full">
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0 } }}
					>
						<Typography
							color="inherit"
							className="text-18 font-semibold"
						>
							Indique e Ganhe
						</Typography>
					</motion.div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0 } }}
					>
						<Typography className="mt-4 text-32 sm:text-48 font-extrabold tracking-tight leading-tight text-center">
							Envie Suas Indicações e Ganhe Dinheiro pelo WhatsApp
						</Typography>
					</motion.div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { delay: 0.3 } }}
					>
						<Typography
							color="text.secondary"
							className="mt-12 sm:text-20 text-center tracking-tight"
						>
							Transforme suas Indicações em Lucro
							<br />
							com Apenas alguns Cliques
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
						className="text-gray-700 opacity-25"
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
			</Box>

			<div className="flex flex-col items-center px-24 sm:px-40">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-32 md:gap-y-0 md:gap-x-24 w-full max-w-sm md:max-w-4xl -mt-64 sm:-mt-96"></div>
					<div className="relative overflow-hidden px-24 pb-24 sm:px-64 sm:pb-24 ">
						<svg
							className="pointer-events-none absolute inset-0 -z-1"
							viewBox="0 0 960 540"
							width="100%"
							height="100%"
							preserveAspectRatio="xMidYMax slice"
							xmlns="http://www.w3.org/2000/svg"
						>
							<Box
								component="g"
								sx={{ color: 'divider' }}
								className="opacity-20"
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
							</Box>
						</svg>
						<div className="flex flex-col items-center">

							<motion.div
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
								className=" flex justify-center "
							>
								<SinglePricingCard />
							</motion.div>
						</div>
					</div>
				</div>
		



			<div className="flex flex-col w-full px-68">
			<div className="flex flex-1 items-center pb-24 -mx-8">
				<Box
					component={motion.div}
					initial={{ y: -20, opacity: 0 }}
					animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
					className="flex flex-1 w-full sm:w-auto items-center px-16 mx-8 border-1 bg-white rounded-full"
				>
					<FuseSvgIcon
						color="action"
						size={20}
					>
						heroicons-outline:search
					</FuseSvgIcon>

					<Input
						placeholder="Search contacts"
						className="flex flex-1 px-16"
						disableUnderline
						fullWidth
						// value={''}
						inputProps={{
							'aria-label': 'Search'
						}}
						// onChange={(ev: ChangeEvent<HTMLInputElement>) => dispatch(setSearchText(ev))}
						onChange={() => {}}
					/>
				</Box>
				<Button
					className="mx-8"
					variant="contained"
					color="secondary"
					component={NavLinkAdapter}
					to="new/edit"
				>
					<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
					<span className="hidden sm:flex mx-8">Add</span>
				</Button>
			</div>
				<Masonry
					breakpointCols={{
						default: 4,
						960: 3,
						600: 2,
						480: 1
					}}
					className="my-masonry-grid flex w-full"
					columnClassName="my-masonry-grid_column flex flex-col p-8"
				>
					{
						contatos.map(item => (
							<ContactCard key={item.id} item={item} onClose={() => { }} className="mb-16" />
						))
					}
				</Masonry>

			</div>

			<Box
				sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText' }}
				className="px-24 py-40 sm:px-64 sm:py-48"
			>
				<div className="mx-auto flex w-full max-w-7xl flex-col items-center text-center">
					<Typography className="text-3xl font-extrabold leading-6 sm:text-5xl sm:leading-10">
						Boost your productivity.
					</Typography>
					<Typography
						className="mt-8 text-3xl font-extrabold leading-6 sm:text-5xl sm:leading-10"
						color="text.secondary"
					>
						Start using Fuse today.
					</Typography>
					<Button
						className="mt-32 px-48 text-lg"
						size="large"
						color="secondary"
						variant="contained"
					>
						Sign up for free
					</Button>
				</div>
			</Box>

			<div className="flex flex-col items-center px-24 pb-32 pt-12 sm:px-64 sm:pb-80 sm:pt-72">
				<div className="w-full max-w-7xl">
					<div>
						<Typography className="text-4xl font-extrabold leading-tight tracking-tight">
							Frequently asked questions
						</Typography>
						<Typography
							className="mt-8 max-w-xl text-xl"
							color="text.secondary"
						>
							Here are the most frequently asked questions you may check before getting started
						</Typography>
					</div>
					<div className="mt-48 grid w-full grid-cols-1 gap-x-24 gap-y-48 sm:mt-64 sm:grid-cols-2 lg:gap-x-64">
						<div>
							<Typography className="text-xl font-semibold">
								What is the duration of the free trial?
							</Typography>
							<Typography
								className="mt-8 leading-6"
								color="text.secondary"
							>
								Our app is free to try for 14 days, if you want more, you can provide payment details
								which will extend your trial to 30 days providing you an extra 16 more days to try our
								app.
							</Typography>
						</div>
						<div>
							<Typography className="text-xl font-semibold">
								Are there discounts for non-profits or educational use?
							</Typography>
							<Typography
								className="mt-2 leading-6"
								color="text.secondary"
							>
								Yes, our Personal and Premium packages are free for non-profits and educational use.
								E-mail your details to us after starting your Free Trial and we will upgrade your
								account if you qualify.
							</Typography>
						</div>
						<div>
							<Typography className="text-xl font-semibold">What is the storage is for?</Typography>
							<Typography
								className="mt-8 leading-6"
								color="text.secondary"
							>
								Since we provide an extremely detailed reporting and analytics tool, they require quite
								a bit storage space. For average use, you don’t have to worry about running out of space
								since the Personal package limits the projects you can have.
							</Typography>
							<Typography
								className="mt-8 leading-6"
								color="text.secondary"
							>
								For some reason if you run out of space, contact us and we will see what can be done
								about it and make sure you are not generating unnecessary reports and/or analytics data.
							</Typography>
						</div>
						<div>
							<Typography className="text-xl font-semibold">
								What happens if I’m not satisfied?
							</Typography>
							<Typography
								className="mt-8 leading-6"
								color="text.secondary"
							>
								If you are still in your free trial period, you can cancel your account at anytime with
								a single click of a button. If you already paid for your first month, we also offer
								30-day money-back guarantee with no questions asked.
							</Typography>
							<Typography
								className="mt-8 leading-6"
								color="text.secondary"
							>
								After first month, you can still cancel your account at any time but we will calculate
								the amount that corresponds to days you have been using our app for that month and
								refund only the remaining amount.
							</Typography>
						</div>
					</div>
				</div>
			</div>

		</>
	);
}

export default IndicationPage;
