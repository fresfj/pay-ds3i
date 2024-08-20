import Dialog from '@mui/material/Dialog';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'react-redux';
import { closeCardDialog, selectCardDialogOpen } from '../../../store/cardDialogSlice';
import BoardCardForm from './BoardCardForm';

/**
 * The board card dialog component.
 */
function BoardCardDialog() {
	const dispatch = useAppDispatch();
	const cardDialogOpen = useSelector(selectCardDialogOpen);

	return (
		<Dialog
			classes={{
				paper: 'max-w-lg w-full m-8 sm:m-24'
			}}
			onClose={() => dispatch(closeCardDialog())}
			open={cardDialogOpen}
		>
			<BoardCardForm />
		</Dialog>
	);
}

export default BoardCardDialog;
