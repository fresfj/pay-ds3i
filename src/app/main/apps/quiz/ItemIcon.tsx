import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { amber, blue, green, grey, red } from '@mui/material/colors';
import { Iconify } from '@fuse/components/iconify';

const TypeBadge = styled(Box)(({ ...props }) => ({
	backgroundColor: {
		PDF: red[600],
		DOC: blue[600],
		XLS: green[600],
		TXT: grey[600],
		JPG: amber[600]
	}[props.color as string]
}));

type ItemIconProps = {
	type: string;
};

/**
 * The item icon component.
 */
function ItemIcon(props: ItemIconProps) {
	const { type } = props;

	if (type === 'folder') {
		return (
			<Iconify icon="solar:folder-bold-duotone" width={66} color="disabled" />
		);
	}

	return (
		<div className="relative">
			<Iconify icon="solar:file-check-bold-duotone" width={66} color="disabled" />
			<TypeBadge
				color={type}
				className="absolute left-0 bottom-0 px-6 rounded text-12 font-semibold leading-20 text-white"
			>
				{type}
			</TypeBadge>
		</div>
	);
}

export default ItemIcon;
