import Chip from '@mui/material/Chip';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import { labelColorDefs } from './labelColors';
import { selectLabelById } from '../MailboxApi';

type MailLabelProps = {
	className?: string;
	labelId?: string;
};

/**
 * The mail label.
 */
function MailLabel(props: MailLabelProps) {
	const { labelId, className = '' } = props;
	const label = useSelector(selectLabelById(labelId));

	if (!label) {
		return null;
	}

	return (
		<Chip
			label={label.title}
			classes={{
				root: clsx('h-24 border-0', className, label.color && labelColorDefs[label.color].combined),
				label: 'px-12 py-4 text-12 font-medium leading-none'
			}}
		/>
	);
}

export default MailLabel;
