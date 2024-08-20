import Dialog from '@mui/material/Dialog';
import { useAppDispatch } from 'app/store/store';
import { useSelector } from 'react-redux';
import withSlices from 'app/store/withSlices';
import { closeDialog, fuseDialogSlice, selectFuseDialogProps } from '@fuse/core/FuseDialog/store/fuseDialogSlice';

/**
 * FuseDialog component
 * This component renders a material UI ```Dialog``` component
 * with properties pulled from the redux store
 */
function FuseDialog() {
	const dispatch = useAppDispatch();
	const options = useSelector(selectFuseDialogProps);

	return (
		<Dialog
			onClose={() => dispatch(closeDialog())}
			aria-labelledby="fuse-dialog-title"
			classes={{
				paper: 'rounded-8'
			}}
			{...options}
		/>
	);
}

export default withSlices([fuseDialogSlice])(FuseDialog);
