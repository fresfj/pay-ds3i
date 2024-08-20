import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import { ForwardedRef, forwardRef } from 'react';
import clsx from 'clsx';
import EmailInput from './EmailInput';
import { CustomerEmailModel } from '../../models/CustomerModel';
import { CustomerEmail } from '../../CustomersApi';

type CustomerEmailSelectorProps = {
	value: CustomerEmail[] | undefined;
	onChange: (T: CustomerEmail[]) => void;
	className?: string;
};

/**
 * The Customer email selector.
 */
const CustomerEmailSelector = forwardRef((props: CustomerEmailSelectorProps, ref: ForwardedRef<HTMLDivElement>) => {
	const { value, onChange, className } = props;

	return (
		<div
			className={clsx('w-full', className)}
			ref={ref}
		>
			{value?.map((item, index) => (
				<EmailInput
					value={item}
					key={index}
					onChange={(val: CustomerEmail) => {
						onChange(value.map((_item, _index) => (index === _index ? val : _item)));
					}}
					onRemove={() => {
						onChange(value.filter((_item, _index) => index !== _index));
					}}
					hideRemove={value.length === 1}
				/>
			))}
			<Button
				className="group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer"
				onClick={() => value && onChange([...value, CustomerEmailModel({})])}
			>
				<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

				<span className="ml-8 font-medium text-secondary group-hover:underline">Add an email address</span>
			</Button>
		</div>
	);
});

export default CustomerEmailSelector;
