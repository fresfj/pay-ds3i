import { orange } from '@mui/material/colors';
import { lighten, styled } from '@mui/material/styles';
import clsx from 'clsx';
import FuseUtils from '@fuse/utils';
import { Controller, useFormContext } from 'react-hook-form';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { EcommerceProduct } from '../../ECommerceApi';
import IconButton from '@mui/material/IconButton';
import { Iconify } from '@fuse/components/iconify';
import { varAlpha } from 'src/theme/styles/utils';
import firebase from 'firebase/compat/app'
import { useDispatch } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';

const Root = styled('div')(({ theme }) => ({
	'& .productImageFeaturedStar': {
		position: 'absolute',
		top: 0,
		left: 0,
		color: orange[400],
		opacity: 0
	},

	'& .productImageUpload': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut
	},

	'& .productImageItem': {
		transitionProperty: 'box-shadow',
		transitionDuration: theme.transitions.duration.short,
		transitionTimingFunction: theme.transitions.easing.easeInOut,
		'&:hover': {
			'& .productImageFeaturedStar': {
				opacity: 0.8
			}
		},
		'&.featured': {
			pointerEvents: 'none',
			boxShadow: theme.shadows[3],
			'& .productImageFeaturedStar': {
				opacity: 1
			},
			'&:hover .productImageFeaturedStar': {
				opacity: 1
			}
		}
	}
}));

/**
 * The product images tab.
 */
function ProductImagesTab() {
	const methods = useFormContext();
	const { control, watch, setValue } = methods;
	const dispatch = useDispatch()
	const images = watch('images') as EcommerceProduct['images'];


	const handleDeleteImage = async (media) => {
		const storageRef = firebase.storage().ref()
		const imagesRef = storageRef.child(`images/${media.id}.jpg`)

		try {
			imagesRef.delete().then(() => {
				const updatedImages = images.filter(image => image.id !== media.id);
				setValue('images', updatedImages);
			}).catch((error) => {
				console.log(`Uh-oh, an error occurred!`, error)
			});

		} catch (error) {
			console.log(`catch`, error)
		}

	};

	return (
		<Root>
			<div className="flex justify-center sm:justify-start flex-wrap -mx-16">
				<Controller
					name="images"
					control={control}
					render={({ field: { onChange, value } }) => (
						<Box
							sx={{
								backgroundColor: (theme) =>
									theme.palette.mode === 'light'
										? lighten(theme.palette.background.default, 0.4)
										: lighten(theme.palette.background.default, 0.02)
							}}
							component="label"
							htmlFor="button-file"
							className="productImageUpload flex items-center justify-center relative w-128 h-128 rounded-16 mx-12 mb-24 overflow-hidden cursor-pointer shadow hover:shadow-lg"
						>
							<input
								accept="image/*"
								className="hidden"
								id="button-file"
								type="file"
								onChange={async (e) => {
									function readFileAsync() {
										return new Promise((resolve, reject) => {
											const file = e?.target?.files?.[0];

											if (!file) {
												return;
											}

											const reader = new FileReader();

											reader.onload = () => {
												resolve({
													id: FuseUtils.generateGUID(),
													url: `data:${file.type};base64,${btoa(reader.result as string)}`,
													type: 'image'
												});
											};

											reader.onerror = reject;

											reader.readAsBinaryString(file);
										});
									}

									const newImage = await readFileAsync();

									onChange([newImage, ...(value as EcommerceProduct['images'])]);
								}}
							/>
							<FuseSvgIcon
								size={32}
								color="action"
							>
								heroicons-outline:upload
							</FuseSvgIcon>
						</Box>
					)}
				/>
				<Controller
					name="featuredImageId"
					control={control}
					defaultValue=""
					render={({ field: { onChange, value } }) => {
						return (
							<>
								{images.map((media) => (
									<div className='flex items-center justify-center relative rounded-16 mx-12 mb-24 overflow-hidden'>
										<div
											key={media.id}
											tabIndex={0}
											className={clsx(
												'productImageItem w-128 h-128 cursor-pointer outline-none shadow hover:shadow-lg',
												media.id === value && 'featured'
											)}
											onClick={() => onChange(media.id)}
											onKeyDown={() => onChange(media.id)}
										>
											<IconButton
												size="small"
												className="productImageFeaturedStar"
												sx={{
													p: 0.35,
													position: 'absolute'
												}}
											>
												<FuseSvgIcon>
													heroicons-solid:star
												</FuseSvgIcon>
											</IconButton>

											<img
												className="max-w-none w-auto h-full"
												src={media.url}
												alt="product"
											/>
										</div>
										<Tooltip
											arrow
											title={`Delete`}
											slotProps={{ popper: { modifiers: [{ name: 'offset', options: { offset: [0, -12] } }] } }}
										>
											<IconButton
												size="small"
												onClick={() => handleDeleteImage(media)}
												onKeyDown={() => handleDeleteImage(media)}
												sx={{
													p: 0.35,
													top: 4,
													right: 4,
													position: 'absolute',
													color: 'common.white',
													bgcolor: (theme) => varAlpha(theme.palette.grey['900Channel'], 0.48),
													'&:hover': { bgcolor: (theme) => varAlpha(theme.palette.grey['900Channel'], 0.72) },
												}}
											>
												<Iconify icon="mingcute:close-line" width={16} />
											</IconButton>
										</Tooltip>
									</div>
								))}
							</>
						);
					}}
				/>
			</div>
		</Root>
	);
}

export default ProductImagesTab;
