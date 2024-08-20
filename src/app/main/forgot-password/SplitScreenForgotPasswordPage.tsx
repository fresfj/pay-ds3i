import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import _ from '@lodash';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import { useAppDispatch } from 'app/store/store';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import firebase from 'firebase/compat/app';
import CardContent from '@mui/material/CardContent';
/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('Você deve inserir um e-mail válido').nonempty('Você deve inserir um e-mail')
});

type FormType = {
	email: string;
};
const defaultValues = {
	email: ''
};

/**
 * The modern forgot password page.
 */
function SplitScreenForgotPasswordPage() {
	const { firebaseService } = useAuth();
	const dispatch = useAppDispatch();
	const { control, formState, handleSubmit, reset, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(formData: FormType) {
		const { email } = formData;
		firebaseService?.forgotPassword(email).then(() => {

			dispatch(showMessage({
				variant: 'success',
				message: 'E-mail de redefinição de senha enviado.'
			}));
		})
			.catch((_error) => {
				const error = _error as firebase.auth.Error;

				const errors: {
					type: 'email';
					message: string;
				}[] = [];

				const emailErrorCodes = [
					'auth/email-already-in-use',
					'auth/invalid-email',
					'auth/operation-not-allowed',
					'auth/user-not-found',
					'auth/user-disabled'
				];

				if (emailErrorCodes.includes(error.code)) {
					errors.push({
						type: 'email',
						message: error.message
					});
				}

				if (!emailErrorCodes.includes(error.code)) {
					dispatch(showMessage({ message: error.message }));
				}

				errors.forEach((err) => {
					setError(err.type, {
						type: 'manual',
						message: err.message
					});
				});
			})
		reset(defaultValues);
	}

	return (
		<div className="flex min-w-0 flex-auto flex-col items-center sm:flex-row sm:justify-center md:items-start md:justify-start">
			<Paper className="h-full w-full px-16 py-8 ltr:border-r-1 rtl:border-l-1 sm:h-auto sm:w-auto sm:rounded-2xl sm:p-48 sm:shadow md:flex md:h-full md:w-1/2 md:items-center md:justify-end md:rounded-none md:p-64 md:shadow-none">
				<CardContent className="mx-auto w-full max-w-320 sm:mx-0 sm:w-320">
					<img
						className="w-68"
						src="assets/images/logo/logo.svg"
						alt="logo"
					/>

					<Typography className="mt-32 text-4xl font-extrabold leading-tight tracking-tight">
						Esqueceu a senha?
					</Typography>
					<div className="mt-2 flex items-baseline font-medium">
						<Typography>Insira o seu e-mail associado à sua conta que enviaremos um link para redefinir sua senha.</Typography>
					</div>

					<form
						name="registerForm"
						noValidate
						className="mt-32 flex w-full flex-col justify-center"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Controller
							name="email"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									className="mb-24"
									label="Email"
									type="email"
									error={!!errors.email}
									helperText={errors?.email?.message}
									variant="outlined"
									required
									fullWidth
								/>
							)}
						/>

						<Button
							variant="contained"
							color="secondary"
							className=" mt-4 w-full"
							aria-label="Register"
							disabled={_.isEmpty(dirtyFields) || !isValid}
							type="submit"
							size="large"
						>
							Enviar redefinição
						</Button>

						<Typography
							className="mt-32 text-md font-medium"
							color="text.secondary"
						>
							<span>Retornar para</span>
							<Link
								className="ml-4"
								to="/sign-in"
							>
								Acesso ao Club
							</Link>
						</Typography>
					</form>
				</CardContent>
			</Paper>

			<Box
				className="relative hidden h-full flex-auto items-center justify-center bg-cover bg-no-repeat bg-center overflow-hidden p-64 md:flex lg:px-112"
				sx={{
					backgroundColor: 'primary.main',
					backgroundImage: "url('assets/images/etc/BG-CREABOX_04-1024x972.webp')"
				}}
			>
				<svg
					className="pointer-events-none absolute inset-0"
					viewBox="0 0 960 540"
					width="100%"
					height="100%"
					preserveAspectRatio="xMidYMax slice"
					xmlns="http://www.w3.org/2000/svg"
				>
					<Box
						component="g"
						sx={{ color: 'primary.light' }}
						className="opacity-20"
						fill="none"
						stroke="currentColor"
						strokeWidth="100"
					>
						<circle
							r="34"
							cx="196"
							cy="23"
						/>
						<circle
							r="34"
							cx="790"
							cy="491"
						/>
					</Box>
				</svg>
				<Box
					component="svg"
					className="absolute -right-64 -top-64 opacity-20"
					sx={{ color: 'primary.light' }}
					viewBox="0 0 220 192"
					width="220px"
					height="192px"
					fill="none"
				>
					<defs>
						<pattern
							id="837c3e70-6c3a-44e6-8854-cc48c737b659"
							x="0"
							y="0"
							width="20"
							height="20"
							patternUnits="userSpaceOnUse"
						>
							<rect
								x="0"
								y="0"
								width="4"
								height="4"
								fill="currentColor"
							/>
						</pattern>
					</defs>
					<rect
						width="220"
						height="192"
						fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
					/>
				</Box>

				<div className="relative z-10 w-full max-w-2xl">
					<div className="text-7xl font-bold leading-none text-gray-100">
						<div>Pronto pra transformar sua rotina?</div>
					</div>
					<div className="mt-24 text-xl leading-6 tracking-tight text-gray-400">
						A Creabox Club comemora cada passo rumo à sua melhor versão juntos, numa vibe única de motivação e troca de ideias com a galera! Facilitamos a sua vida com acesso fácil a tudo que é fitness, direto pela net.
					</div>
					<div className="mt-32 flex items-center">
						<AvatarGroup
							sx={{
								'& .MuiAvatar-root': {
									borderColor: 'primary.main'
								}
							}}
						>
							<Avatar src="assets/images/avatars/female-18.jpg" />
							<Avatar src="assets/images/avatars/female-11.jpg" />
							<Avatar src="assets/images/avatars/male-09.jpg" />
							<Avatar src="assets/images/avatars/male-16.jpg" />
						</AvatarGroup>

						<div className="ml-16 font-medium tracking-tight text-gray-400">
							Mais de 2 mil pessoas se juntaram a nós, é a sua vez.
						</div>
					</div>
				</div>
			</Box>
		</div>
	);
}

export default SplitScreenForgotPasswordPage;
