import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';

import { PasswordChange, useGetAccountAboutQuery } from '../../AccountApi';
import CardActions from '@mui/material/CardActions';
import { Divider, Grid, Paper, Box, Stack } from '@mui/material';
import { Iconify } from '@fuse/components/iconify'
import _ from '@lodash';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { showMessage } from '@fuse/core/FuseMessage/store/fuseMessageSlice';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { useAuth } from 'src/app/auth/AuthRouteProvider';
import { useAppDispatch } from 'app/store/store';
import { useTranslation } from 'react-i18next'

type FormType = PasswordChange;

const schema = z.object({
	currentPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
	newPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
	confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
}).refine((val) => val.newPassword === val.confirmPassword, {
	message: 'As senhas não coincidem',
	path: ["confirmPassword"]
});


/**
 * The billing tab.
 */
function SecurityTab() {
	const { t } = useTranslation('accountApp');
	const { firebaseService } = useAuth();
	const dispatch = useAppDispatch();
	const { control, watch, reset, handleSubmit, formState } = useForm<FormType>({
		mode: 'all',
		resolver: zodResolver(schema)
	});
	const { isValid, dirtyFields, errors } = formState

	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)


	const onSubmit = async (data) => {
		await firebaseService?.updatePassword(data.currentPassword, data.newPassword).then((res) => {
			dispatch(
				showMessage({
					message: 'Password updated successfully',
					autoHideDuration: 6000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'success'
				}))
		}).catch((_error) => {
			dispatch(
				showMessage({
					message: `Password updated Error:${_error}`,
					autoHideDuration: 6000,
					anchorOrigin: {
						vertical: 'top',
						horizontal: 'center'
					},
					variant: 'error'
				}))
		})

		reset({
			newPassword: '',
			confirmPassword: ''
		})

	};


	const container = {
		show: {
			transition: {
				staggerChildren: 0.04
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 40 },
		show: { opacity: 1, y: 0 }
	};

	return (
		<motion.div
			variants={container}
			initial="hidden"
			animate="show"
			className="w-full"
		>
			<div className="md:flex">
				<div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
					<Card
						component={motion.div}
						variants={item}
						className="w-full mb-32"
					>
						<div className="px-32 pt-24">
							<Typography className="text-2xl font-semibold leading-tight">
								{t('NEW_PASSWORD')}
							</Typography>
						</div>

						<CardContent className="px-32 py-24 md:w-2xl">
							<Controller
								name="currentPassword"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										label={t('CURRENT_PASSWORD')}
										type={showPassword ? 'text' : 'password'}
										className="mt-16"
										fullWidth
										error={!!errors.currentPassword}
										helperText={errors.currentPassword?.message}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
														{showPassword ? <Iconify icon={'solar:eye-linear'} /> : <Iconify icon={'solar:eye-closed-linear'} />}
													</IconButton>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>
							<Controller
								name="newPassword"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										label={t('NEW_PASSWORD')}
										type={showConfirmPassword ? 'text' : 'password'}
										className="mt-16"
										fullWidth
										error={!!errors.newPassword}
										helperText={errors.newPassword?.message}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton onClick={() => setShowPassword(!showConfirmPassword)} edge="end">
														{showConfirmPassword ? <Iconify icon={'solar:eye-linear'} /> : <Iconify icon={'solar:eye-closed-linear'} />}
													</IconButton>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>
							<Controller
								name="confirmPassword"
								control={control}
								defaultValue=""
								render={({ field }) => (
									<TextField
										{...field}
										label={t('CONFIRM_PASSWORD')}
										type={showConfirmPassword ? 'text' : 'password'}
										className="mt-16"
										fullWidth
										error={!!errors.confirmPassword}
										helperText={errors.confirmPassword?.message}
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
														{showConfirmPassword ? <Iconify icon={'solar:eye-linear'} /> : <Iconify icon={'solar:eye-closed-linear'} />}
													</IconButton>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>
						</CardContent>
						<Divider className='border-dashed' />
						<CardActions className="flex justify-end p-24 w-full">
							<Button
								className="whitespace-nowrap"
								variant="contained"
								color="secondary"
								disabled={_.isEmpty(dirtyFields) || !isValid}
								onClick={handleSubmit(onSubmit)}
							>
								<span className="sm:flex mx-8">{t('SAVE_CHANGE')}</span>
							</Button>
						</CardActions>
					</Card>
				</div>
			</div>
		</motion.div>
	);
}

export default SecurityTab;
