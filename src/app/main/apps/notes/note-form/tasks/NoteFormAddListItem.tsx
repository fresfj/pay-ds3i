import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { Controller, useForm } from 'react-hook-form';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import NoteListItemModel from '../../models/NoteListItemModel';
import { NoteListItemType } from '../../NotesApi';

/**
 * Form Validation Schema
 */
const schema = z.object({
	content: z.string().nonempty('You must enter a content')
});

type FormType = Pick<NoteListItemType, 'content'>;

const defaultValues: FormType = {
	content: ''
};

type NoteFormAddListItemProps = {
	onListItemAdd: (noteListItem: NoteListItemType) => void;
};

/**
 * The note form add list item.
 */
function NoteFormAddListItem(props: NoteFormAddListItemProps) {
	const { onListItemAdd } = props;

	const { control, formState, handleSubmit, reset } = useForm<FormType>({
		mode: 'onChange',
		defaultValues,
		resolver: zodResolver(schema)
	});

	const { isValid, dirtyFields, errors } = formState;

	function onSubmit(data: FormType) {
		onListItemAdd(NoteListItemModel(data));
		reset(defaultValues);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<ListItem
				className="p-0"
				dense
			>
				<Controller
					name="content"
					control={control}
					render={({ field }) => (
						<TextField
							{...field}
							className="flex flex-1"
							error={!!errors.content}
							helperText={errors?.content?.message}
							placeholder="Add an item"
							variant="standard"
							autoFocus
							hiddenLabel
							InputProps={{
								disableUnderline: true,
								className: 'px-2',
								startAdornment: (
									<InputAdornment position="start">
										<IconButton
											className="w-32 h-32 p-0 -mx-6"
											aria-label="Add"
											type="submit"
											disabled={_.isEmpty(dirtyFields) || !isValid}
											size="large"
										>
											<FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
										</IconButton>
									</InputAdornment>
								)
							}}
						/>
					)}
				/>
			</ListItem>
		</form>
	);
}

export default NoteFormAddListItem;
