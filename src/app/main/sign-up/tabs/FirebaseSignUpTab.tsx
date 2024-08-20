import { Controller, useForm } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import Button from '@mui/material/Button';
import _ from '@lodash';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import firebase from 'firebase/compat/app';
import { useAuth } from '../../../auth/AuthRouteProvider';
import InputMask from 'react-input-mask'
import { useAppDispatch } from 'app/store/store';
import { addCustomer } from '../../pages/checkout/store/cartSlice';
import { Customer, useCreateCustomersItemMutation } from '../../apps/customers/CustomersApi';

/**
 * Form Validation Schema
 */
const schema = z
	.object({
		displayName: z.string().nonempty('Você deve digitar seu nome completo')
			.regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+\s[A-Za-zÀ-ÖØ-öø-ÿ]+$/, 'Você deve inserir um nome e sobrenome válidos'),
		email: z.string().email('You must enter a valid email').nonempty('Você deve inserir um e-mail'),
		phone: z.string().regex(/^\(\d{2}\)\s9\d{4}-\d{4}$/, {
			message: "O telefone deve estar no formato (99) 9XXXX-XXXX e começar com o dígito 9.",
		}),
		password: z
			.string()
			.nonempty('Por favor digite sua senha')
			.min(8, 'A senha é muito curta - deve ter no mínimo 8 caracteres.'),
		passwordConfirm: z.string().nonempty('A confirmação da senha é necessária'),
		acceptTermsConditions: z.boolean().refine((val) => val === true, 'Os termos e condições devem ser aceitos.')
	})
	.refine((data) => data.password === data.passwordConfirm, {
		message: 'Passwords must match',
		path: ['passwordConfirm']
	});

const defaultValues = {
	displayName: '',
	phone: '',
	email: '',
	password: '',
	passwordConfirm: '',
	acceptTermsConditions: false
};


type SignUpPayload = z.infer<typeof schema>;

function FirebaseSignUpTab() {
	const { firebaseService } = useAuth();
	const dispatch = useAppDispatch()
	const [createCustomer] = useCreateCustomersItemMutation()
	const { control, formState, handleSubmit, setError } = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	const onSubmit = async (formData: SignUpPayload) => {
		const { displayName, email, password, phone } = formData;


		const result = schema.safeParse(formData);
		if (!result.success) {

			return;
		}


		firebaseService?.signUp(email, password, displayName).then(async ({ user }) => {

			const customerData = {
				uid: user.uid,
				email: email,
				cpfCnpj: '',
				birthday: '',
				address: '',
				addressNumber: '',
				complement: '',
				neighborhood: '',
				city: '',
				state: '',
				postalCode: '',
				invoiceAddress: {},
				shippingAddress: {},
				title: '',
				background: '',
				company: '',
				notes: '',
				tags: [],
				emails: [{ email: email, label: 'default' }],
				phoneNumbers: [{ country: 'br', phoneNumber: phone, label: 'default' }],
				name: displayName,
				status: 'ATIVO',
				updatedAt: new Date(),
				createdAt: new Date()
			}

			await createCustomer({ customer: customerData } as any)
				.unwrap()
				.then(async action => {
					console.log(action)

				})
		})
			.catch((_error) => {
				const error = _error as firebase.auth.Error;

				const usernameErrorCodes = ['auth/operation-not-allowed', 'auth/user-not-found', 'auth/user-disabled'];

				const emailErrorCodes = ['auth/email-already-in-use', 'auth/invalid-email'];

				const passwordErrorCodes = ['auth/weak-password', 'auth/wrong-password'];

				const errors: {
					type: 'displayName' | 'email' | 'password' | `root.${string}` | 'root';
					message: string;
				}[] = [];

				if (usernameErrorCodes.includes(error.code)) {
					errors.push({
						type: 'displayName',
						message: error.message
					});
				}

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

				errors.forEach((err) => {
					setError(err.type, {
						type: 'manual',
						message: err.message
					});
				});
			});
	}

	return (
		<form
			name="registerForm"
			noValidate
			className="mt-32 flex w-full flex-col justify-center"
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="displayName"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Nome completo"
						autoFocus
						error={!!errors.displayName}
						helperText={errors?.displayName?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>
			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="E-mail"
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
				name="phone"
				control={control}
				render={({ field }) => (
					<InputMask
						{...field}
						mask={'(99) 99999-9999'}
						maskChar=""
						type="tel"
					>
						{inputProps => (
							<TextField
								{...inputProps}
								className="mb-24"
								label="Telefone"
								type="tel"
								error={!!errors.phone}
								helperText={errors?.phone?.message}
								variant="outlined"
								required
								fullWidth
							/>
						)}
					</InputMask>
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
						type="password"
						error={!!errors.password}
						helperText={errors?.password?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="passwordConfirm"
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						className="mb-24"
						label="Password (Confirm)"
						type="password"
						error={!!errors.passwordConfirm}
						helperText={errors?.passwordConfirm?.message}
						variant="outlined"
						required
						fullWidth
					/>
				)}
			/>

			<Controller
				name="acceptTermsConditions"
				control={control}
				render={({ field }) => (
					<FormControl
						className="items-center"
						error={!!errors.acceptTermsConditions}
					>
						<FormControlLabel
							label="Eu concordo com os Termos de Serviço e Política de Privacidade"
							control={
								<Checkbox
									size="small"
									{...field}
								/>
							}
						/>
						<FormHelperText>{errors?.acceptTermsConditions?.message}</FormHelperText>
					</FormControl>
				)}
			/>

			<Button
				variant="contained"
				color="secondary"
				className="mt-24 w-full"
				aria-label="Register"
				disabled={_.isEmpty(dirtyFields) || !isValid}
				type="submit"
				size="large"
			>
				Crie sua conta gratuita
			</Button>
		</form>
	);
}

export default FirebaseSignUpTab;
