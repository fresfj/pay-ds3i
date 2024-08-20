import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Box from '@mui/material/Box';
import { lighten, ThemeProvider } from '@mui/material/styles';
import { selectMainThemeDark } from '@fuse/core/FuseSettings/store/fuseSettingsSlice';
import { OutlinedInput } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useSelector } from 'react-redux';
import FaqList from '../faqs/FaqList';
import { useGetHelpCenterMostlyFaqsQuery } from '../HelpCenterApi';
import { useTranslation } from 'react-i18next'
/**
 * The help center home.
 */
function HelpCenterHome() {
	const mainThemeDark = useSelector(selectMainThemeDark);
	const { data: faqsMost } = useGetHelpCenterMostlyFaqsQuery();
	const { t } = useTranslation('helpCenterApp');
	return (
		<div className="flex flex-col flex-auto min-w-0">
			<ThemeProvider theme={mainThemeDark}>
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
								{t('HELP_CENTER')}
							</Typography>
						</motion.div>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1, transition: { delay: 0 } }}
						>
							<Typography className="mt-4 text-32 sm:text-48 font-extrabold tracking-tight leading-tight text-center">
								{t('HOW_CAN')}
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
								{t('SERACH_FOR')}
							</Typography>
						</motion.div>
						<motion.div
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
						>
							<OutlinedInput
								className="flex flex-1 items-center px-16 mx-8 rounded-full h-44 w-full max-w-320 sm:max-w-480 mt-40 sm:mt-80"
								placeholder={t('PLACEHOLDER_SEARCH')}
								fullWidth
								startAdornment={
									<InputAdornment position="start">
										<FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
									</InputAdornment>
								}
								inputProps={{
									'aria-label': 'Search'
								}}
							/>
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
			</ThemeProvider>

			<div className="flex flex-col items-center px-24 sm:px-40">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-y-32 md:gap-y-0 md:gap-x-24 w-full max-w-sm md:max-w-4xl -mt-64 sm:-mt-96">
					<Card
						component={Link}
						to="faqs"
						role="button"
						className="relative flex flex-col rounded-2xl shadow hover:shadow-lg overflow-hidden transition-shadow ease-in-out duration-150"
					>
						<div className="flex flex-col flex-auto items-center justify-center p-32 text-center">
							<div className="text-2xl font-semibold">{t('FAQs')}</div>
							<div
								className="md:max-w-160 mt-4"
								color="text.secondary"
							>
								{t('FAQs_TITLE')}
							</div>
						</div>
						<Box
							className="flex items-center justify-center py-16 px-32"
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
						>
							<Typography
								color="secondary"
								className="mx-8"
							>
								{t('GO_TO_FAQs')}
							</Typography>
							<FuseSvgIcon
								size={20}
								color="secondary"
							>
								heroicons-solid:arrow-narrow-right
							</FuseSvgIcon>
						</Box>
					</Card>

					<Card
						component={Link}
						to="guides"
						role="button"
						className="relative flex flex-col rounded-2xl shadow hover:shadow-lg overflow-hidden transition-shadow ease-in-out duration-150"
					>
						<div className="flex flex-col flex-auto items-center justify-center p-32 text-center">
							<div className="text-2xl font-semibold">{t('GUIDES')}</div>
							<div
								className="md:max-w-160 mt-4"
								color="text.secondary"
							>
								{t('GUIDES_TITLE')}
							</div>
						</div>
						<Box
							className="flex items-center justify-center py-16 px-32"
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
						>
							<Typography
								color="secondary"
								className="mx-8"
							>
								{t('GO_TO_GUIDES')}
							</Typography>
							<FuseSvgIcon
								size={20}
								color="secondary"
							>
								heroicons-solid:arrow-narrow-right
							</FuseSvgIcon>
						</Box>
					</Card>

					<Card
						component={Link}
						to="support"
						role="button"
						className="relative flex flex-col rounded-2xl shadow hover:shadow-lg overflow-hidden transition-shadow ease-in-out duration-150"
					>
						<div className="flex flex-col flex-auto items-center justify-center p-32 text-center">
							<div className="text-2xl font-semibold">{t('SUPPORT')}</div>
							<div
								className="md:max-w-160 mt-4"
								color="text.secondary"
							>
								{t('SUPPORT_TITLE')}
							</div>
						</div>
						<Box
							className="flex items-center justify-center py-16 px-32"
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
						>
							<Typography
								color="secondary"
								className="mx-8"
							>
								{t('GO_TO_SUPPORT')}
							</Typography>
							<FuseSvgIcon
								size={20}
								color="secondary"
							>
								heroicons-solid:arrow-narrow-right
							</FuseSvgIcon>
						</Box>
					</Card>
				</div>
			</div>

			<Typography className="mt-96 px-16 text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight text-center">
				{t('TITLE')}
			</Typography>
			<Typography
				className="mt-8 px-16 text-xl text-center"
				color="text.secondary"
			>
				{t('SUBTITLE')}
			</Typography>

			<div className="flex flex-col w-full px-16 items-center my-48">
				<FaqList
					className="w-full max-w-4xl"
					list={faqsMost}
				/>
			</div>
		</div>
	);
}

export default HelpCenterHome;
