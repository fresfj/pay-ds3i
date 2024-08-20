import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import WYSIWYGEditor from 'app/shared-components/WYSIWYGEditor';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import MailAttachment from './MailAttachment';
import { MailboxMail } from './MailboxApi';

type FormType = {
	from: { email?: MailboxMail['from']['email'] };
	to: MailboxMail['to'];
	cc: MailboxMail['cc'];
	bcc: MailboxMail['bcc'];
	subject: MailboxMail['subject'];
	message: string;
};

const defaultValues: FormType = {
	from: { email: 'johndoe@creapond.com' },
	to: '',
	cc: [],
	bcc: [],
	subject: '',
	message: ''
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	from: z.object({
		email: z.union([z.string().email('You must enter a valid e-mail.'), z.null()])
	}),
	to: z.string().email('You must enter a valid e-mail.'),
	cc: z.array(z.string().email('Must be a valid email')),
	bcc: z.array(z.string().email('Must be a valid email')),
	subject: z.string(),
	message: z.string()
});

type MailComposeProps = {
	className?: string;
};

/**
 * The mail compose.
 */
function MailCompose(props: MailComposeProps) {
	const { className } = props;
	const [openDialog, setOpenDialog] = useState(false);
	const { handleSubmit, formState, control } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const { t } = useTranslation('mailboxApp');

	function handleOpenDialog() {
		setOpenDialog(true);
	}

	function handleCloseDialog() {
		setOpenDialog(false);
	}

	function handleDiscard() {
		setOpenDialog(false);
	}

	function onSubmit(data: FormType) {
		// eslint-disable-next-line no-console
		console.info(data);
		setOpenDialog(false);
	}

	return (
		<div className={clsx('', className)}>
			<Button
				variant="contained"
				color="secondary"
				className="w-full"
				onClick={handleOpenDialog}
				startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
			>
				{t('COMPOSE')}
			</Button>

			<Dialog
				open={openDialog}
				onClose={handleCloseDialog}
				aria-labelledby="form-dialog-title"
				scroll="body"
			>
				<AppBar
					position="static"
					color="secondary"
					elevation={0}
				>
					<Toolbar className="flex w-full">
						<Typography
							variant="subtitle1"
							color="inherit"
						>
							New Message
						</Typography>
					</Toolbar>
				</AppBar>

				<form
					noValidate
					onSubmit={handleSubmit(onSubmit)}
					className="flex flex-col"
				>
					<DialogContent classes={{ root: 'p-16 pb-0 sm:p-32 sm:pb-0' }}>
						<Controller
							name="from.email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16"
									label="From"
									id="from"
									variant="outlined"
									fullWidth
									inputProps={{ readOnly: true }}
								/>
							)}
						/>

						<Controller
							name="to"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16"
									label="To"
									autoFocus
									id="to"
									error={!!errors.to}
									helperText={errors?.to?.message}
									variant="outlined"
									fullWidth
									required
								/>
							)}
						/>

						<Controller
							name="cc"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16"
									label="Cc"
									id="cc"
									variant="outlined"
									fullWidth
								/>
							)}
						/>

						<Controller
							name="bcc"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16"
									label="Bcc"
									id="bcc"
									name="bcc"
									variant="outlined"
									fullWidth
								/>
							)}
						/>

						<Controller
							name="subject"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mt-8 mb-16"
									label="Subject"
									id="subject"
									name="subject"
									variant="outlined"
									fullWidth
								/>
							)}
						/>

						<Controller
							render={({ field }) => (
								<WYSIWYGEditor
									className="mt-8 mb-16"
									{...field}
								/>
							)}
							name="message"
							control={control}
						/>

						<div className="pt-8">
							<MailAttachment
								fileName="attachment-2.doc"
								size="12 kb"
							/>
							<MailAttachment
								fileName="attachment-1.jpg"
								size="350 kb"
							/>
						</div>
					</DialogContent>

					<DialogActions className="flex flex-col sm:flex-row sm:items-center justify-between py-16 sm:py-24 px-24">
						<div className="-mx-8">
							<IconButton>
								<FuseSvgIcon size={20}>heroicons-solid:paper-clip</FuseSvgIcon>
							</IconButton>

							<IconButton>
								<FuseSvgIcon size={20}>heroicons-solid:link</FuseSvgIcon>
							</IconButton>

							<IconButton>
								<FuseSvgIcon size={20}>heroicons-solid:emoji-happy</FuseSvgIcon>
							</IconButton>

							<IconButton>
								<FuseSvgIcon size={20}>heroicons-solid:photograph</FuseSvgIcon>
							</IconButton>
						</div>

						<div className="flex items-center space-x-8 mt-16 sm:mt-0">
							<Button
								variant="outlined"
								color="secondary"
								onClick={handleDiscard}
							>
								Discard
							</Button>
							<Button
								variant="outlined"
								color="secondary"
							>
								Save as draft
							</Button>

							<Button
								variant="contained"
								color="secondary"
								type="submit"
								disabled={_.isEmpty(dirtyFields) || !isValid}
							>
								Send
							</Button>
						</div>
					</DialogActions>
				</form>
			</Dialog>
		</div>
	);
}

export default MailCompose;
