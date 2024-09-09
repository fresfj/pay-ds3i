import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@mui/styles';
import { Box, Divider, Step, StepContent, StepLabel, Stepper } from '@mui/material';
import initFacebookSDK from '../components/initFacebookSDK';
import clsx from 'clsx';
import { Iconify } from '@fuse/components/iconify';
import axios from 'axios';
import SelectImage from './SelectImage';

const steps = [
	{
		label: 'Autenticação no Facebook',
		description: 'Você deve se autenticar com sua conta do Facebook e conceder permissão de publicação para que possamos publicar em seu nome.',
	},
	{
		label: 'Seleção de Imagem',
		description: 'Selecione uma imagem disponível para divulgação em suas redes sociais.',
	},
	{
		label: 'Publicação da Divulgação',
		description: 'Clique em publicar para finalizar sua divulgação nas redes sociais selecionadas.',
	},
];


const defaultValues = {
	message: `🚀 Transforme a experiência de atendimento da sua empresa com automação e multicanalidade!

Ofereça suporte rápido e eficaz aos seus clientes por diversos canais, como WhatsApp, Facebook, Instagram e muito mais, tudo integrado em uma única plataforma. Com as nossas soluções de automação, sua equipe será capaz de focar no que realmente importa: entregar resultados! 🔥

Garanta mais eficiência, satisfação e fidelização. Não fique para trás, modernize o seu atendimento agora mesmo! 💼💡

Benefícios:

Integração com vários canais 📱
Atendimento automatizado 24/7 🤖
Maior produtividade e redução de custos 📈
Relatórios e insights avançados 📊
Entre em contato e descubra como nossas soluções podem elevar o atendimento da sua empresa ao próximo nível!

#Automação #AtendimentoInteligente #Multicanalidade #SoluçõesEmpresariais #Tecnologia #WhatsAppBusiness #AtendimentoAoCliente #Inovação #TransformaçãoDigital #Produtividade #Eficiência #Suporte24Horas #FidelizaçãoDeClientes` };

const schema = z.object({
	template: z.string().nonempty('Você deve selecionar um template de imagem.'),
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

const IMAGES = [
	{
		"id": 1,
		"image": "https://firebasestorage.googleapis.com/v0/b/checkout-shop-b5bb3.appspot.com/o/post%2FInstagramPost.png?alt=media&token=c27d246c-5298-4b43-bea3-e99fc029965b"
	},
	{
		"id": 2,
		"image": "https://firebasestorage.googleapis.com/v0/b/checkout-shop-b5bb3.appspot.com/o/post%2FInstagramStory.png?alt=media&token=4171dadc-5225-4584-a10a-fe8156a88089"
	}
]
function HelpCenterSupport() {
	const { t } = useTranslation('helpCenterApp');
	const [mediaUrls, setMediaUrls] = useState({
		post: 'https://firebasestorage.googleapis.com/v0/b/checkout-shop-b5bb3.appspot.com/o/post%2FInstagramPost.png?alt=media&token=c27d246c-5298-4b43-bea3-e99fc029965b',
		story: 'https://firebasestorage.googleapis.com/v0/b/checkout-shop-b5bb3.appspot.com/o/post%2FInstagramStory.png?alt=media&token=4171dadc-5225-4584-a10a-fe8156a88089',
	});

	const [postCaption, setPostCaption] = useState(`🚀 Transforme a experiência de atendimento da sua empresa com automação e multicanalidade!

Ofereça suporte rápido e eficaz aos seus clientes por diversos canais, como WhatsApp, Facebook, Instagram e muito mais, tudo integrado em uma única plataforma. Com as nossas soluções de automação, sua equipe será capaz de focar no que realmente importa: entregar resultados! 🔥

Garanta mais eficiência, satisfação e fidelização. Não fique para trás, modernize o seu atendimento agora mesmo! 💼💡

Benefícios:

Integração com vários canais 📱
Atendimento automatizado 24/7 🤖
Maior produtividade e redução de custos 📈
Relatórios e insights avançados 📊
Entre em contato e descubra como nossas soluções podem elevar o atendimento da sua empresa ao próximo nível!

#Automação #AtendimentoInteligente #Multicanalidade #SoluçõesEmpresariais #Tecnologia #WhatsAppBusiness #AtendimentoAoCliente #Inovação #TransformaçãoDigital #Produtividade #Eficiência #Suporte24Horas #FidelizaçãoDeClientes`);
	const [isSharingPost, setIsSharingPost] = useState(false);
	const [facebookUserAccessToken, setFacebookUserAccessToken] = useState(localStorage.getItem('facebookUserAccessToken') || '');
	const [facebookPageId, setFacebookPageId] = useState(null);
	const [instagramAccountId, setInstagramAccountId] = useState(null);
	const [activeStep, setActiveStep] = React.useState(0);
	const [account, setAccount] = useState<any>(localStorage.getItem('instagramAccount') || '')

	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema),
	}) as any;

	const { handleSubmit, formState: { isValid, dirtyFields }, setValue, watch } = methods;
	const form = watch()
	const classes = useStyles();

	const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
	const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
	const handleReset = () => setActiveStep(0);


	const handleApplyShipping = (e: any) => {
		setValue('template', e)
	}

	const onSubmit = async () => {
		//setIsSharingPost(true);

		const facebookPages = await getFacebookPages();
		if (facebookPages.length === 0) { setIsSharingPost(false); return; }

		const facebookPageId = facebookPages[0].id;
		// const mediaObjectContainerId = await createMediaObjectContainer(facebookPageId);

		// if (mediaObjectContainerId) {
		// 	await publishMediaObjectContainer(facebookPageId, mediaObjectContainerId);
		// } else {
		// 	console.error('Falha ao criar o container de mídia.');
		//}

		const instagramAccountId = await getInstagramAccountId(facebookPageId);
		if (!instagramAccountId) { setIsSharingPost(false); return; }

		const mediaObjectContainerId = await createMediaObjectContainer(instagramAccountId);
		if (!mediaObjectContainerId) { setIsSharingPost(false); return; }

		// // const storyObjectContainerId = await createStoryObjectContainer(instagramAccountId);
		// // if (!storyObjectContainerId) { setIsSharingPost(false); return; }

		await publishMediaObjectContainer(instagramAccountId, mediaObjectContainerId);
		// // await publishStoryObjectContainer(instagramAccountId, storyObjectContainerId);

		// setIsSharingPost(false);
	}

	async function getIds() {
		const facebookPages = await getFacebookPages();
		const facebookPageId = facebookPages[0].id;
		const instagramAccountId = await getInstagramAccountId(facebookPageId);
	}

	const logInToFB = async () => {
		window.FB.login(
			(response) => {
				if (response.authResponse) {
					const newAccessToken = response.authResponse.accessToken;
					setFacebookUserAccessToken(newAccessToken);
					localStorage.setItem('facebookUserAccessToken', newAccessToken);
					console.log('Login bem-sucedido:', response);
					handleNext()
					getIds()
				} else {
					console.log('Login não autorizado ou falhou.');
				}
			},
			{
				scope: 'pages_manage_engagement,pages_manage_posts, pages_read_engagement, pages_show_list, publish_video, instagram_basic, instagram_content_publish, ads_management'
			}
		);
	};

	const logOutOfFB = () => {
		window.FB.logout(() => {
			localStorage.removeItem('facebookUserAccessToken')
			setFacebookUserAccessToken("");
			setFacebookPageId(null);
			setInstagramAccountId(null);
			console.log('Usuário desconectado.');
		})
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

	const createMediaObjectContainerFacebook = async (facebookPageId) => {
		try {
			const response = await fetch(
				`https://graph.facebook.com/v20.0/${facebookPageId}/feed`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						url: mediaUrls.post,
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

	const publishMediaObjectContainerFacebook = async (facebookPageId, mediaObjectContainerId) => {
		try {
			const response = await fetch(
				`https://graph.facebook.com/v20.0/${facebookPageId}/media_publish`,
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
			console.log('Publicação bem-sucedida no Facebook:', data);
			return data.id;
		} catch (error) {
			console.error('Erro na requisição de publicação de mídia:', error);
			return null;
		}
	};

	const getInstagramAccountId = async (facebookPageId: string) => {
		try {
			const response = await fetch(
				`https://graph.facebook.com/v20.0/${facebookPageId}?fields=instagram_business_account,name,picture,emails,phone&access_token=${facebookUserAccessToken}`
			);
			const data = await response.json();
			if (data.error) {
				console.error('Erro ao obter conta do Instagram:', data.error);
				return null;
			}
			setAccount(data)
			localStorage.setItem('instagramAccount', data);
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
						image_url: mediaUrls.post,
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

	async function createStoryObjectContainer(instagramAccountId: string) {
		try {
			const response = await fetch(
				`https://graph.facebook.com/v20.0/${instagramAccountId}/media`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						image_url: mediaUrls.story,
						is_stories: true,
						caption: postCaption,
						access_token: facebookUserAccessToken,
					}),
				}
			);
			const data = await response.json();
			if (data.error) {
				console.error('Erro ao criar container de mídia para stories:', data.error);
				return null;
			}
			return data.id;
		} catch (error) {
			console.error('Erro na requisição para criação de story:', error);
			return null;
		}
	}

	async function publishStoryObjectContainer(instagramAccountId: string, mediaObjectContainerId: string) {
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
						is_stories: true,
						access_token: facebookUserAccessToken,
					}),
				}
			);
			const data = await response.json();
			if (data.error) {
				console.error('Erro ao publicar story no Instagram:', data.error);
				return null;
			}
			console.log('Publicação bem-sucedida no story do Instagram', data);
			return data.id;
		} catch (error) {
			console.error('Erro na requisição de publicação de story:', error);
			return null;
		}
	}

	useEffect(() => {
		initFacebookSDK().then(() => {
			window.FB.getLoginStatus((response) => {
				if (response.status === 'connected') {
					setFacebookUserAccessToken(response.authResponse?.accessToken);
					localStorage.setItem('facebookUserAccessToken', response.authResponse?.accessToken);
					console.log('Login bem-sucedido:', response);
					setActiveStep(1)
				} else {
					console.error('Usuário não conectado ao Facebook:', response);
					localStorage.removeItem('facebookUserAccessToken')
					setFacebookUserAccessToken("");
					setFacebookPageId(null);
					setInstagramAccountId(null);
					console.log('Usuário desconectado.');
				}
			}, (error) => {
				console.error('Erro ao verificar status de login:', error);
			});
		});
	}, [facebookUserAccessToken]);

	return (
		<div className="flex flex-col items-center p-24 sm:p-40 container">
			<div className="flex flex-col w-full max-w-4xl">
				<div className="mt-8 text-4xl sm:text-7xl font-extrabold tracking-tight leading-tight">
					Nas redes
				</div>
				<Paper className="mt-32 sm:mt-48 p-24 pb-28 sm:p-40 sm:pb-28 rounded-2xl">
					<FormProvider {...methods}>
						<form onSubmit={handleSubmit(onSubmit)}>
							<Box sx={{ maxWidth: '100%' }}>
								<Stepper activeStep={activeStep} orientation="vertical">
									{steps.map((step, index) => (
										<Step key={step.label}>
											<StepLabel
												optional={
													index === steps.length - 1 ? (
														<Typography variant="caption">Last step</Typography>
													) : null
												}
											>
												{step.label}
											</StepLabel>
											<StepContent>
												<Box sx={{ mb: 2 }}>
													<Typography sx={{ mb: 2 }} gutterBottom>{step.description}</Typography>
													{index === 0 &&
														<div className="px-0 sm:px-24">
															{!facebookUserAccessToken ? (
																<Button variant='contained' className={clsx('rounded-md px-14 py-24 relative transition duration-300 ease-in-out', classes.button)}
																	onClick={logInToFB} endIcon={
																		<Iconify icon={'fa:facebook'} sx={{ width: 26, height: 26 }} className={classes.icon} />
																	}>
																	<Typography variant="button" className='text-18 font-medium normal-case'>Login com Facebook</Typography>
																</Button>
															) : (
																<Button color='inherit' variant='contained' className={clsx('rounded-md px-14 py-24 relative transition duration-300 ease-in-out')}
																	onClick={logOutOfFB} endIcon={
																		<Iconify icon={'fa:facebook'} sx={{ width: 26, height: 26 }} className={classes.icon} />
																	}>
																	<Typography variant="button" className='text-18 font-medium normal-case'>Logout do Facebook</Typography>
																</Button>
															)}
														</div>
													}
													{index === 1 &&
														<SelectImage templates={IMAGES} onApplyShipping={handleApplyShipping} />
													}
													{index === 2 && (
														<>
															<Typography>{account?.name}</Typography>
															<img src={account?.picture?.data?.url} width={100} height={100} />

															{console.log(`account`, account)}
															<Button variant="contained" color="primary" type="submit"
																onClick={onSubmit}
															>
																Publicar
															</Button>
														</>
													)}
													{index > 0 && <Button onClick={handleBack}>Voltar</Button>}
													{index < steps.length - 1 && (
														<Button variant="contained" onClick={handleNext} >
															Próximo
														</Button>
													)}
												</Box>
											</StepContent>
										</Step>
									))}
								</Stepper>
								{activeStep === steps.length && (
									<Paper square elevation={0} sx={{ p: 3 }}>
										<Typography>Todas as etapas foram concluídas!</Typography>
										<Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
											Reiniciar
										</Button>
									</Paper>
								)}
							</Box>
						</form>
					</FormProvider>
				</Paper>
			</div>
		</div>
	);
}

export default HelpCenterSupport;