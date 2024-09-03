import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';

type Props = {
	onOpen?: () => void;
};
/**
 * The new board item component.
 */
function NewInstanceItem({ onOpen }: Props) {

	return (
		<Box
			sx={{
				borderColor: 'divider'
			}}
			className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer border-2 border-gray-300 border-dashed hover:bg-hover transition-colors duration-150 ease-in-out"
			onClick={onOpen}
			onKeyDown={onOpen}
			role="button"
			tabIndex={0}
		>
			<FuseSvgIcon
				size={48}
				color="disabled"
			>
				heroicons-outline:plus
			</FuseSvgIcon>
		</Box>
	);
}

export default NewInstanceItem;
