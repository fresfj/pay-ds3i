import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import TextField from '@mui/material/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles';
import { Iconify } from '@fuse/components/iconify';
import clsx from 'clsx';
import { Divider } from '@mui/material';

type formValuesType = { name: string; email: string; subject: string; message: string };

const defaultValues = { name: '', email: '', subject: '', message: '' };

const schema = z.object({
	name: z.string().nonempty('You must enter a name'),
	subject: z.string().nonempty('You must enter a subject'),
	message: z.string().nonempty('You must enter a message'),
	email: z.string().email('You must enter a valid email').nonempty('You must enter an email')
});

const useStyles = makeStyles((theme) => ({
	button: {
		position: 'relative',
		backgroundColor: '#25D366',
		color: '#fff',
		'&:hover': {
			backgroundColor: '#128C7E',
		},
		'&:focus': {
			outline: 'none',
		},
		'&:active': {
			backgroundColor: '#075E54',
		},
		'&:not(:disabled):hover::before': {
			animation: 'pulse 1.5s infinite',
			content: '""',
			position: 'absolute',
			top: '-5px',
			left: '-5px',
			right: '-5px',
			bottom: '-5px',
			zIndex: '-1',
		},
	},
	'@keyframes pulse': {
		'0%': {
			transform: 'scale(0.95)',
			boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.7)',
		},
		'70%': {
			transform: 'scale(1)',
			boxShadow: '0 0 0 10px rgba(0, 0, 0, 0)',
		},
		'100%': {
			transform: 'scale(0.95)',
			boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)',
		},
	},
}));

/**
 * The help center support.
 */
function HelpCenterSupport() {
	const { t } = useTranslation('helpCenterApp');
	const { control, handleSubmit, watch, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState;

	const form = watch();

	function onSubmit(data: formValuesType) {
		// eslint-disable-next-line no-console
		console.log(data);
	}

	if (_.isEmpty(form)) {
		return null;
	}

	const classes = useStyles();

	const handleWhatsAppClick = () => {
		window.open('https://wa.me/554191890513?text=Sua%20mensagem%20aqui', '_blank');
	};

	return (
		<div className="flex flex-col items-center p-24 sm:p-40 container">
			<div className="flex flex-col w-full max-w-4xl">
				<div className="sm:mt-32">
					<Button
						component={Link}
						to="/apps/help-center"
						color="secondary"
						startIcon={<FuseSvgIcon>heroicons-outline:arrow-narrow-left</FuseSvgIcon>}
					>
						{t('BACK_TO_HELP_CENTER')}
					</Button>
				</div>
				<div className="mt-8 text-4xl sm:text-7xl font-extrabold tracking-tight leading-tight">
					{t('TITLE_SUPPORT')}
				</div>

				<Paper className="mt-32 sm:mt-48 p-24 pb-28 sm:p-40 sm:pb-28 rounded-2xl">
					<div className="px-0 sm:px-24 mb-24">
						<Button className={clsx('rounded-md px-14 py-24 relative transition duration-300 ease-in-out', classes.button)} onClick={handleWhatsAppClick} endIcon={
							<Iconify icon={'fa:whatsapp'} sx={{ width: 26, height: 26 }} />
						}>
							<Typography variant="button" className='text-18 font-medium normal-case'>Falar via WhatsApp</Typography>
						</Button>
					</div>
					<Divider className='m-24' />
					<form
						onSubmit={handleSubmit(onSubmit)}
						className="px-0 sm:px-24"
					>
						<div className="mb-24">
							<Typography className="text-2xl font-bold tracking-tight">Submit your request</Typography>
							<Typography color="text.secondary">
								Your request will be processed and our support staff will get back to you in 24 hours.
							</Typography>
						</div>
						<div className="space-y-32">
							<Controller
								control={control}
								name="name"
								render={({ field }) => (
									<TextField
										className="w-full"
										{...field}
										label="Name"
										placeholder="Name"
										id="name"
										error={!!errors.name}
										helperText={errors?.name?.message}
										variant="outlined"
										required
										fullWidth
									/>
								)}
							/>

							<Controller
								control={control}
								name="email"
								render={({ field }) => (
									<TextField
										{...field}
										className="mt-16 w-full"
										label="Email"
										placeholder="Email"
										variant="outlined"
										fullWidth
										error={!!errors.email}
										helperText={errors?.email?.message}
										required
									/>
								)}
							/>

							<Controller
								control={control}
								name="subject"
								render={({ field }) => (
									<TextField
										{...field}
										className="mt-16 w-full"
										label="Subject"
										placeholder="Subject"
										variant="outlined"
										fullWidth
										error={!!errors.subject}
										helperText={errors?.subject?.message}
										required
									/>
								)}
							/>

							<Controller
								name="message"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										label="Message"
										className="mt-16 w-full"
										margin="normal"
										multiline
										minRows={4}
										variant="outlined"
										error={!!errors.message}
										helperText={errors?.message?.message}
										required
									/>
								)}
							/>
						</div>
						<div className="flex items-center justify-end mt-32">
							<Button className="mx-8">Cancel</Button>
							<Button
								className="mx-8"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								type="submit"
							>
								Save
							</Button>
						</div>
					</form>
				</Paper>
			</div>
		</div>
	);
}

export default HelpCenterSupport;
