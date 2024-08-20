import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';
import WYSIWYGEditor from 'app/shared-components/WYSIWYGEditor';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import Autocomplete from '@mui/material/Autocomplete';
import QuestionSelector from './QuestionSelector';
import { fetchAddQuiz } from './fetchQuizzes';

const defaultValues = {
	title: '',
	description: '',
	categories: [],
	questions: [{
		text: '',
		options: ['', '', ''],
		correctOption: '',
		image: '',
	}],
};


const QuestionsSchema = z.object({
	text: z.string().min(1, 'A pergunta é obrigatório'),
	options: z.array(z.string().optional()),
	image: z.string().optional(),
	correctOption: z.string().optional()
});

const schema = z.object({
	title: z.string().min(1, 'O título é obrigatório'),
	description: z.string().min(1, 'A descrição é obrigatória'),
	categories: z.string().array().nonempty('Informe um categoria'),
	questions: z.array(QuestionsSchema).optional(),
});

function QuizAdd(props) {
	const { className, setShouldUpdate } = props;
	const [openDialog, setOpenDialog] = useState(false);

	const methods = useForm({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema),
	});

	const { handleSubmit, formState, control, register } = methods;
	const { isValid, dirtyFields, errors } = formState;

	const handleOpenDialog = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDialog(false);
	};

	const handleDiscard = () => {
		setOpenDialog(false);
	};

	const onSubmit = async (data) => {
		const quizData = {
			title: data.title,
			description: data.description,
			categories: data.categories.map((cat) => cat.trim()),
			questions: data.questions,
			conclusionsCount: 0,
			startedCount: 0,
			totalPoints: 0,
			createdAt: Timestamp.now(),
			modifiedAt: Timestamp.now(),
			createdBy: 'Francisco Freitas Jr',
		};

		fetchAddQuiz(quizData)
		setShouldUpdate(true)
		setOpenDialog(false);
	};

	return (
		<>
			<Button
				variant="contained"
				color="secondary"
				className="w-full"
				onClick={handleOpenDialog}
				startIcon={<FuseSvgIcon>heroicons-outline:plus</FuseSvgIcon>}
			>
				Adiconar avaliação
			</Button>

			<Dialog
				classes={{
					paper: 'm-24',
				}}
				open={openDialog}
				onClose={handleCloseDialog}
				fullWidth
				maxWidth="md"
			>
				<AppBar position="static" elevation={0}>
					<Toolbar className="flex w-full">
						<Typography variant="subtitle1" color="inherit">
							Adicionar avaliação
						</Typography>
					</Toolbar>
				</AppBar>

				<FormProvider {...methods}>
					<form className="flex flex-col overflow-hidden" onSubmit={handleSubmit(onSubmit)}>
						<DialogContent className="p-24">
							<div className="flex">
								<Controller
									control={control}
									name="title"
									render={({ field }) => (
										<TextField
											{...field}
											className="mt-8 mb-16"
											required
											label="Título"
											autoFocus
											id="title"
											variant="outlined"
											fullWidth
											error={!!errors.title}
											helperText={errors?.title?.message}
										/>
									)}
								/>
							</div>

							<div className="flex">
								<Controller
									control={control}
									name="description"
									render={({ field }) => (
										<TextField
											{...field}
											className="mt-8 mb-16"
											required
											label="Descrição"
											id="description"
											variant="outlined"
											fullWidth
											error={!!errors.description}
											helperText={errors?.description?.message}
										/>
									)}
								/>
							</div>

							<div className="flex flex-col space-y-8">
								<Controller
									control={control}
									name="categories"
									render={({ field: { onChange, value } }) => (
										<Autocomplete
											multiple
											freeSolo
											value={value}
											onChange={(event, newValue) => {
												onChange(newValue);
											}}
											options={[]}
											renderInput={(params) => (
												<TextField
													{...params}
													className="mt-8 mb-16"
													variant="outlined"
													label="Categorias"
													placeholder="Adicionar categoria"
													fullWidth
													error={!!errors.categories}
													helperText={errors?.categories?.message}
												/>
											)}
										/>
									)}
								/>
							</div>
							<Controller
								control={control}
								name="questions"
								render={({ field }) => (
									<QuestionSelector
										className="mt-32"
										{...field}
										value={field?.value}
										onChange={(val) => field.onChange(val)}
									/>
								)}
							/>
						</DialogContent>

						<DialogActions className="justify-between px-8 py-16">
							<div className="-mx-8">

							</div>

							<div className="flex items-center space-x-8 mt-16 sm:mt-0">
								<Button
									variant="outlined"
									color="secondary"
									onClick={handleDiscard}
								>
									Descartar
								</Button>
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									disabled={_.isEmpty(dirtyFields) || !isValid}
								>
									Salvar
								</Button>

							</div>
						</DialogActions>
					</form>
				</FormProvider>
			</Dialog>
		</>
	);
}

export default QuizAdd