import Chip from '@mui/material/Chip';
import clsx from 'clsx';
import { labelColorDefs } from './labelColors';


type ProductLabelProps = {
	className?: string;
	label?: {
		content?: string;
		color?: string;
	};
};

/**
 * The product label.
 */
function ProductLabel(props: ProductLabelProps) {
	const { label, className = '' } = props;

	if (!label) {
		return null;
	}

	return (
		<Chip
			label={label.content}
			classes={{
				root: clsx('h-24 border-0 rounded-4', className, label.color && labelColorDefs[label.color].combined),
				label: 'px-8 py-4 text-10 font-semibold uppercase leading-none'
			}}
		/>
	);
}

export default ProductLabel;
