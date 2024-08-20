import { Controller, useForm } from 'react-hook-form';
import { darken } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { useEffect, useState, MouseEvent } from 'react';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ScrumboardList, useCreateScrumboardBoardListMutation } from '../../ScrumboardApi';

type FormType = {
	title: ScrumboardList['title'];
};

const defaultValues = {
	title: ''
};

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a title')
});

/**
 * The board add list component.
 */
function BoardAddList() {
	const routeParams = useParams();
	const { boardId } = routeParams;

	const [createList] = useCreateScrumboardBoardListMutation();

	const [formOpen, setFormOpen] = useState(false);

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	useEffect(() => {
		if (!formOpen) {
			reset(defaultValues);
		}
	}, [formOpen, reset]);

	function handleOpenForm(ev: MouseEvent<HTMLButtonElement>) {
		ev.stopPropagation();
		setFormOpen(true);
	}

	function handleCloseForm() {
		setFormOpen(false);
	}

	function onSubmit(data: FormType) {
		createList({ boardId, list: data });
		handleCloseForm();
	}

	return (
		<div>
			<Card
				className="w-320 mx-8 sm:mx-12 rounded-xl shadow-0"
				square
				sx={{
					backgroundColor: (theme) =>
						darken(theme.palette.background.default, theme.palette.mode === 'light' ? 0.03 : 0.25)
				}}
			>
				{formOpen ? (
					<ClickAwayListener onClickAway={handleCloseForm}>
						<form
							className="p-12"
							onSubmit={handleSubmit(onSubmit)}
						>
							<Controller
								name="title"
								control={control}
								render={({ field }) => (
									<TextField
										{...field}
										className="mb-16"
										required
										fullWidth
										variant="filled"
										label="List title"
										autoFocus
										InputProps={{
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={handleCloseForm}
														size="large"
													>
														<FuseSvgIcon size={18}>heroicons-outline:x</FuseSvgIcon>
													</IconButton>
												</InputAdornment>
											)
										}}
									/>
								)}
							/>

							<div className="flex justify-between items-center">
								<Button
									variant="contained"
									color="secondary"
									type="submit"
									disabled={_.isEmpty(dirtyFields) || !isValid}
									size="small"
								>
									Add
								</Button>
							</div>
						</form>
					</ClickAwayListener>
				) : (
					<Button
						onClick={handleOpenForm}
						classes={{
							root: 'font-medium w-full rounded-lg p-24 justify-start'
						}}
						startIcon={<FuseSvgIcon>heroicons-outline:plus-circle</FuseSvgIcon>}
						sx={{ color: 'text.secondary' }}
					>
						Add another list
					</Button>
				)}
			</Card>
		</div>
	);
}

export default BoardAddList;
