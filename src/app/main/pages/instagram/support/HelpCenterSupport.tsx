import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, useForm } from 'react-hook-form';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import { Divider } from '@mui/material';
import initFacebookSDK from '../components/initFacebookSDK';
import clsx from 'clsx';
import { Iconify } from '@fuse/components/iconify';

type formValuesType = { name: string; subject: string; message: string };

const defaultValues = { name: '', subject: '', message: '' };

const schema = z.object({
	name: z.string().nonempty('You must enter a name'),
	subject: z.string().nonempty('You must enter a subject'),
	message: z.string().nonempty('You must enter a message'),
});

const useStyles = makeStyles(() => ({
	button: {
		position: 'relative',
		backgroundColor: '#1877F2',
		color: '#fff',
		'&:hover': {
			backgroundColor: '#145DBF',
		},
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	icon: {
		marginRight: '8px',
	},
	text: {
		fontSize: '16px',
		fontWeight: 'bold',
	},
}));

function HelpCenterSupport() {
	const { t } = useTranslation('helpCenterApp');
	const [imageUrl, setImageUrl] = useState(
		'https://bs-uploads.toptal.io/blackfish-uploads/components/open_graph_image/8961044/og_image/optimized/1005_Design-Patterns-in-React_Cover-9181bdf0d728b73804e11b6344434b0c.png'
	);
	const [postCaption, setPostCaption] = useState('TEST POST');
	const [isSharingPost, setIsSharingPost] = useState(false);
	const [facebookUserAccessToken, setFacebookUserAccessToken] = useState('');
	const [facebookPageId, setFacebookPageId] = useState(null);
	const [instagramAccountId, setInstagramAccountId] = useState(null);
	const { control, handleSubmit, watch, formState } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema),
	});

	const { isValid, dirtyFields, errors } = formState;

	const form = watch();
	const classes = useStyles();

	async function onSubmit(data: formValuesType) {
		console.log(data);

		setIsSharingPost(true);

		// const mediaObjectContainerId = await createInstagramMedia(
		// 	instagramAccountId
		// );

		// await publishInstagramMedia(instagramAccountId, mediaObjectContainerId);
		// await publishFacebookPost(facebookPages[0].id);


		const facebookPages = await getFacebookPages();
		if (facebookPages.length === 0) { setIsSharingPost(false); return; }

		const instagramAccountId = await getInstagramAccountId(facebookPages[0].id);
		if (!instagramAccountId) { setIsSharingPost(false); return; }

		const mediaObjectContainerId = await createMediaObjectContainer(instagramAccountId);
		if (!mediaObjectContainerId) { setIsSharingPost(false); return; }

		await publishMediaObjectContainer(instagramAccountId, mediaObjectContainerId);

		if (facebookPages[0].id) {
			await publishToFacebook(facebookPages[0].id);
		}
		setIsSharingPost(false);

		//setIsSharingPost(false);

		// Reset the form state
		// setImageUrl('');
		// setPostCaption('');
	}

	const logInToFB = () => {
		window.FB.login(
			(response) => {
				if (response.authResponse) {
					setFacebookUserAccessToken(response.authResponse.accessToken);
					console.log('Login bem-sucedido:', response);
				} else {
					console.log('Login não autorizado ou falhou.');
				}
			},
			{
				scope: 'pages_manage_engagement,pages_manage_posts,pages_read_engagement, publish_video,, instagram_basic',
			}
		);
	};

	const logOutOfFB = () => {
		window.FB.logout(() => {
			setFacebookUserAccessToken("");
			setFacebookPageId(null);
			setInstagramAccountId(null);
			console.log('Usuário desconectado.');
		});
	};

	const getFacebookPages = async () => {
		try {
			const response = await fetch(
				`https://graph.facebook.com/v20.0/me/accounts?access_token=${facebookUserAccessToken}`
			);
			const data = await response.json();
			if (data.error) {
				console.error('Erro ao obter páginas:', data.error);
				return [];
			}
			return data.data;
		} catch (error) {
			console.error('Erro na requisição de páginas:', error);
			return [];
		}
	};

	const getInstagramAccountId = async (facebookPageId: string) => {
		try {
			const response = await fetch(
				`https://graph.facebook.com/v20.0/${facebookPageId}?fields=instagram_business_account&access_token=${facebookUserAccessToken}`
			);
			const data = await response.json();
			if (data.error) {
				console.error('Erro ao obter conta do Instagram:', data.error);
				return null;
			}
			return data.instagram_business_account?.id;
		} catch (error) {
			console.error('Erro na requisição da conta do Instagram:', error);
			return null;
		}
	};

	const createMediaObjectContainer = async (instagramAccountId: string) => {
		try {
			const response = await fetch(
				`https://graph.facebook.com/v20.0/${instagramAccountId}/media`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						image_url: imageUrl,
						caption: postCaption,
						access_token: facebookUserAccessToken,
					}),
				}
			);
			const data = await response.json();
			if (data.error) {
				console.error('Erro ao criar container de mídia:', data.error);
				return null;
			}
			return data.id;
		} catch (error) {
			console.error('Erro na requisição para criação de mídia:', error);
			return null;
		}
	};

	const publishMediaObjectContainer = async (instagramAccountId: string, mediaObjectContainerId: string) => {
		try {
			const response = await fetch(
				`https://graph.facebook.com/v20.0/${instagramAccountId}/media_publish`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						creation_id: mediaObjectContainerId,
						access_token: facebookUserAccessToken,
					}),
				}
			);
			const data = await response.json();
			if (data.error) {
				console.error('Erro ao publicar container de mídia:', data.error);
				return null;
			}
			console.log('Publicação bem-sucedida no Instagram', data);
			return data.id;
		} catch (error) {
			console.error('Erro na requisição de publicação de mídia:', error);
			return null;
		}
	};

	const publishToFacebook = async (facebookPageId: string) => {
		try {
			const response = await fetch(
				`https://graph.facebook.com/v20.0/${facebookPageId}/feed`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						message: postCaption,
						access_token: facebookUserAccessToken,
					}),
				}
			);
			const data = await response.json();
			if (data.error) {
				console.error('Erro ao publicar no Facebook:', data.error);
				return null;
			}
			console.log('Publicação bem-sucedida no Facebook:', data);
			return data.id;
		} catch (error) {
			console.error('Erro na requisição de publicação no Facebook:', error);
			return null;
		}
	};

	useEffect(() => {
		initFacebookSDK().then(() => {
			window.FB.getLoginStatus((response) => {
				if (response.status === 'connected') {
					setFacebookUserAccessToken(response.authResponse?.accessToken);
					console.log('Login bem-sucedido:', response);
				} else {
					console.error('Usuário não conectado ao Facebook:', response);
				}
			}, (error) => {
				console.error('Erro ao verificar status de login:', error);
			});
		});
	}, []);

	return (
		<div className="flex flex-col items-center p-24 sm:p-40 container">
			<div className="flex flex-col w-full max-w-4xl">
				<div className="mt-8 text-4xl sm:text-7xl font-extrabold tracking-tight leading-tight">
					{t('TITLE_SUPPORT')}
				</div>
				<Paper className="mt-32 sm:mt-48 p-24 pb-28 sm:p-40 sm:pb-28 rounded-2xl">

					<div className="px-0 sm:px-24 mb-24">
						{!facebookUserAccessToken ? (
							<Button className={clsx('rounded-md px-14 py-24 relative transition duration-300 ease-in-out', classes.button)}
								onClick={logInToFB} endIcon={
									<Iconify icon={'fa:facebook'} sx={{ width: 26, height: 26 }} className={classes.icon} />
								}>
								<Typography variant="button" className='text-18 font-medium normal-case'>Login com Facebook</Typography>
							</Button>
						) : (
							<Button color='inherit' className={clsx('rounded-md px-14 py-24 relative transition duration-300 ease-in-out')}
								onClick={logOutOfFB} endIcon={
									<Iconify icon={'fa:facebook'} sx={{ width: 26, height: 26 }} className={classes.icon} />
								}>
								<Typography variant="button" className='text-18 font-medium normal-case'>Logout do Facebook</Typography>
							</Button>
						)}
					</div>
					<Divider className="m-24" />
					<form onSubmit={handleSubmit(onSubmit)} className="px-0 sm:px-24">
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