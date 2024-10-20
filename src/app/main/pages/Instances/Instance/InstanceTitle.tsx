import { Controller, useForm } from 'react-hook-form';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useState, MouseEvent } from 'react';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetInstanceByIdQuery } from '../InstanceApi';

/**
 * Form Validation Schema
 */
const schema = z.object({
	title: z.string().nonempty('You must enter a title')
});

/**
 * The board title component.
 */
function InstanceTitle() {
	const routeParams = useParams();
	const { instanceId } = routeParams;

	const { data: instance } = useGetInstanceByIdQuery(instanceId);

	const [formOpen, setFormOpen] = useState(false);

	const { control, formState, handleSubmit, reset } = useForm({
		mode: 'onChange',
		defaultValues: {
			title: instance?.name
		},
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields } = formState;

	useEffect(() => {
		if (!formOpen) {
			reset({
				title: instance?.name
			});
		}
	}, [formOpen, reset, instance?.name]);

	function handleOpenForm(ev: MouseEvent<HTMLDivElement>) {
		ev.stopPropagation();
		setFormOpen(true);
	}

	function handleCloseForm() {
		setFormOpen(false);
	}

	return (
		<div className="flex items-center min-w-0">
			{formOpen ? (
				<ClickAwayListener onClickAway={handleCloseForm}>
					<form
						className="flex w-full"
					>
						<Controller
							name="title"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									variant="filled"
									margin="none"
									autoFocus
									hiddenLabel
									InputProps={{
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													type="submit"
													disabled={_.isEmpty(dirtyFields) || !isValid}
													size="large"
												>
													<FuseSvgIcon>heroicons-outline:check</FuseSvgIcon>
												</IconButton>
											</InputAdornment>
										)
									}}
								/>
							)}
						/>
					</form>
				</ClickAwayListener>
			) : (
				<div className="flex items-center justify-center space-x-12">
					<Typography
						className="text-18  sm:text-24 md:text-32 font-extrabold tracking-tight leading-none cursor-pointer"
						onClick={handleOpenForm}
						color="inherit"
					>
						{instance?.name}
					</Typography>

				</div>
			)}
		</div>
	);
}

export default InstanceTitle;
