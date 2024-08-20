import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { forwardRef, ReactElement, ReactNode } from 'react';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'react-redux';
import { closeNoteDialog, selectNoteDialogId } from '../../store/dialogsSlice';

import NoteForm from '../../note-form/NoteForm';

const Transition = forwardRef(function Transition(props: { children: ReactElement<ReactNode> }, ref) {
	const { children, ...other } = props;

	return (
		<Slide
			direction="up"
			ref={ref}
			{...other}
		>
			{children}
		</Slide>
	);
});

/**
 * The note dialog.
 */
function NoteDialog() {
	const dispatch = useAppDispatch();
	const noteDialogId = useSelector(selectNoteDialogId);

	return (
		<Dialog
			classes={{
				paper: 'w-full m-24'
			}}
			TransitionComponent={Transition}
			onClose={() => dispatch(closeNoteDialog())}
			open={Boolean(noteDialogId)}
		>
			<NoteForm onClose={() => dispatch(closeNoteDialog())} />
		</Dialog>
	);
}

export default NoteDialog;
