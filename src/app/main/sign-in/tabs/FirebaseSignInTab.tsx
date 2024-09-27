import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import _ from '@lodash';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from 'app/store/store';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import firebase from 'firebase/compat/app';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Iconify } from '@fuse/components/iconify';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Form Validation Schema
 */
const schema = z.object({
	email: z.string().email('Você deve inserir um e-mail válido').nonempty('Você deve inserir um e-mail'),
	password: z
		.string()
		.min(4, 'A senha é muito curta – deve ter pelo menos 4 caracteres.')
		.nonempty('Por gentileza, insira sua senha')
});

type FormType = {
	email: string;
	password: string;
	remember?: boolean;
};

const defaultValues = {
	email: '',
	password: '',
	remember: true
};

function FirebaseSignInTab() {
	const { firebaseService } = useAuth();
	const dispatch = useAppDispatch();
	const [showPassword, setShowPassword] = useState(false)
	const [loading, setLoading] = useState(false);
	const { control, formState, handleSubmit, setValue, setError } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	async function onSubmit(formData: FormType) {

		setLoading(true);


		try {
			const { email, password } = formData;
			await firebaseService?.signIn(email, password);
		} catch (_error) {
			const error = _error as firebase.auth.Error;

			const errors: {
				type: 'email' | 'password';
				message: string;
			}[] = [];

			const emailErrorCodes = [
				'auth/email-already-in-use',
				'auth/invalid-email',
				'auth/operation-not-allowed',
				'auth/user-not-found',
				'auth/user-disabled'
			];
			const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];

			if (emailErrorCodes.includes(error.code)) {
				errors.push({
					type: 'email',
					message: error.message
				});
			}

			if (passwordErrorCodes.includes(error.code)) {
				errors.push({
					type: 'password',
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
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="w-full">
			<form
				name="loginForm"
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
							autoFocus
							type="email"
							error={!!errors.email}
							helperText={errors?.email?.message}
							variant="outlined"
							required
							fullWidth
						/>
					)}
				/>

				<Controller
					name="password"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="mb-24"
							label="Password"
							type={showPassword ? 'text' : 'password'}
							error={!!errors.password}
							helperText={errors?.password?.message}
							variant="outlined"
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
											{showPassword ? <Iconify icon={'solar:eye-linear'} /> : <Iconify icon={'solar:eye-closed-linear'} />}
										</IconButton>
									</InputAdornment>
								)
							}}
							required
							fullWidth
						/>
					)}
				/>

				<div className="flex flex-col items-center justify-center sm:flex-row sm:justify-between">

					<Controller
						name="remember"
						control={control}
						render={({ field }) => (
							<FormControl>
								<FormControlLabel
									label="Manter conectado"
									control={
										<Checkbox
											size="small"
											{...field}
										/>
									}
								/>
							</FormControl>
						)}
					/>

					<Link
						className="text-md font-medium"
						to="/forgot-password"
					>
						Esqueceu a senha?
					</Link>
				</div>

				<Button
					variant="contained"
					color="secondary"
					className=" mt-16 w-full"
					aria-label="Sign in"
					disabled={_.isEmpty(dirtyFields) || !isValid || loading}
					type="submit"
					size="large"
					startIcon={loading && <CircularProgress size={20} />}
				>
					{loading ? 'Entrando...' : 'Entrar'}
				</Button>
			</form>
		</div>
	);
}

export default FirebaseSignInTab;
